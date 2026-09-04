import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { STATUS, STATUS_ORDER, ROLES } from '../lib/mockData';
import {
  fetchDeliveries,
  apiCreateDelivery,
  apiAssignDelivery,
  apiUpdateStatus,
  apiVerifyDelivery,
  apiCancelDelivery,
  fetchRiders,
  fetchDispatchers,
  fetchRetailers,
  mapDelivery,
  getSocket,
  disconnectSocket,
} from '../lib/api';

const DataContext = createContext(null);
const SESSION_KEY = 'reflex.session.v1';

export function DataProvider({ children }) {
  const [deliveries, setDeliveries] = useState([]);
  const [riders, setRiders] = useState([]);
  const [dispatchers, setDispatchers] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* storage unavailable — session simply won't persist across reloads */
    }
  }, [session]);

  // --- Initial load: deliveries + user lists from the backend -------------
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [deliveriesData, ridersData, dispatchersData, retailersData] = await Promise.all([
          fetchDeliveries(),
          fetchRiders(),
          fetchDispatchers(),
          fetchRetailers(),
        ]);
        if (cancelled) return;
        // Defensive dedupe by id — guards against any duplicate entries
        // coming back from the API or being introduced during merges.
        const uniqueDeliveries = Array.from(new Map(deliveriesData.map((d) => [d.id, d])).values());
        setDeliveries(uniqueDeliveries);
        setRiders(ridersData);
        setDispatchers(dispatchersData);
        setRetailers(retailersData);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // --- Socket.io: keep deliveries in sync in real time ---------------------
  // NOTE: connect, subscribe, and disconnect are kept in ONE effect on
  // purpose. They used to be split across two effects (subscribe in one,
  // disconnect-on-unmount in another) — under React StrictMode's dev-only
  // double-invoke (mount -> cleanup -> mount), the disconnect effect's
  // cleanup could tear down the shared socket singleton while the listener
  // effect still held a reference to it, occasionally leaving two live
  // connections briefly and causing the same server event to be processed
  // twice (visible as an exact duplicate delivery row). Keeping the full
  // lifecycle in one effect means its own cleanup always matches its own
  // setup, regardless of how many times React invokes it.
  useEffect(() => {
    const socket = getSocket();

    function upsert(rawDelivery) {
      const mapped = mapDelivery(rawDelivery);
      setDeliveries((prev) => {
        const idx = prev.findIndex((d) => d.id === mapped.id);
        if (idx === -1) return [mapped, ...prev];
        const next = [...prev];
        next[idx] = mapped;
        return next;
      });
    }

    socket.on('delivery:created', upsert);
    socket.on('delivery:assigned', upsert);
    socket.on('delivery:statusUpdated', upsert);
    socket.on('delivery:delivered', upsert);
    socket.on('delivery:cancelled', upsert);

    return () => {
      socket.off('delivery:created', upsert);
      socket.off('delivery:assigned', upsert);
      socket.off('delivery:statusUpdated', upsert);
      socket.off('delivery:delivered', upsert);
      socket.off('delivery:cancelled', upsert);
      disconnectSocket();
    };
  }, []);

  // --- Session ---------------------------------------------------------
  // NOTE: there's still no real auth on the backend — "login" just picks
  // an existing User document fetched above. Anyone can act as anyone.
  function loginAs(role, userId) {
    if (role === ROLES.RETAILER) {
      const user = retailers.find((r) => r._id === userId) || retailers[0];
      if (user) setSession({ role, user });
    } else if (role === ROLES.DISPATCHER) {
      const user = dispatchers.find((d) => d._id === userId) || dispatchers[0];
      if (user) setSession({ role, user });
    } else if (role === ROLES.RIDER) {
      const user = riders.find((r) => r._id === userId) || riders[0];
      if (user) setSession({ role, user });
    }
  }

  function logout() {
    setSession(null);
  }

  // --- Business rules (Spec §7 Sample Status Rules) -----------------------
  // "Only Dispatcher can assign an order" / "Only assigned Rider can update status"
  // "Status moves forward only (cannot skip backward)"
  // "Order is marked DELIVERED only after QR scan"
  // These are enforced backend-side now — the functions below just call the
  // API and surface any rejection as a thrown error for the caller to catch.

  async function createDelivery(input) {
    const delivery = await apiCreateDelivery(input);
    setDeliveries((prev) => [delivery, ...prev]);
    return delivery;
  }

  async function assignRider(orderId, riderId) {
    if (!session?.user?._id) throw new Error('No dispatcher session found');
    const updated = await apiAssignDelivery(orderId, riderId, session.user._id);
    setDeliveries((prev) => prev.map((d) => (d.id === orderId ? updated : d)));
    return updated;
  }

  // toStatus: "PICKED_UP" | "IN_TRANSIT" | "DELIVERED"
  // For DELIVERED, pass opts.verificationCode — it goes through the verify
  // endpoint instead of the status endpoint (scan is mandatory, same as before).
  async function advanceStatus(orderId, toStatus, opts = {}) {
    if (!session?.user?._id) throw new Error('No rider session found');

    let updated;
    if (toStatus === STATUS.DELIVERED) {
      if (!opts.verificationCode) {
        throw new Error('A verification code is required to mark a delivery as DELIVERED');
      }
      updated = await apiVerifyDelivery(orderId, opts.verificationCode, session.user._id);
    } else {
      updated = await apiUpdateStatus(orderId, toStatus, session.user._id);
    }

    setDeliveries((prev) => prev.map((d) => (d.id === orderId ? updated : d)));
    return updated;
  }

  async function cancelDelivery(orderId, reason) {
    if (!session?.user?._id) throw new Error('No session found');
    const updated = await apiCancelDelivery(orderId, session.user._id, reason);
    setDeliveries((prev) => prev.map((d) => (d.id === orderId ? updated : d)));
    return updated;
  }

  function getDelivery(orderId) {
    return deliveries.find((d) => d.id === orderId) || null;
  }

  const riderName = useCallback(
    (riderId) => riders.find((r) => r._id === riderId)?.name || 'Unassigned',
    [riders]
  );

  const value = useMemo(
    () => ({
      deliveries,
      riders,
      dispatchers,
      retailers,
      loading,
      error,
      session,
      loginAs,
      logout,
      createDelivery,
      assignRider,
      advanceStatus,
      cancelDelivery,
      getDelivery,
      riderName,
    }),
    [deliveries, riders, dispatchers, retailers, loading, error, session, riderName]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
