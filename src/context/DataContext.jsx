import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DISPATCHER_USER,
  INITIAL_DELIVERIES,
  RETAILER_USER,
  RIDERS,
  ROLES,
  STATUS,
  STATUS_ORDER,
  nextOrderId,
  timeNow,
} from '../lib/mockData';

const DataContext = createContext(null);
const SESSION_KEY = 'reflex.session.v1';

export function DataProvider({ children }) {
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
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

  function loginAs(role, riderId) {
    if (role === ROLES.RETAILER) setSession({ role, user: RETAILER_USER });
    else if (role === ROLES.DISPATCHER) setSession({ role, user: DISPATCHER_USER });
    else if (role === ROLES.RIDER) {
      const rider = RIDERS.find((r) => r.id === riderId) || RIDERS[0];
      setSession({ role, user: rider });
    }
  }

  function logout() {
    setSession(null);
  }

  // --- Business rules (Spec §7 Sample Status Rules) -----------------------
  // "Only Dispatcher can assign an order" / "Only assigned Rider can update status"
  // "Status moves forward only (cannot skip backward)"
  // "Order is marked DELIVERED only after QR scan"

  function createDelivery(input) {
    const delivery = {
      id: nextOrderId(),
      status: STATUS.CREATED,
      riderId: null,
      requestedAt: timeNow(),
      updatedAt: timeNow(),
      ...input,
    };
    setDeliveries((prev) => [delivery, ...prev]);
    return delivery;
  }

  function assignRider(orderId, riderId) {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === orderId && d.status === STATUS.CREATED
          ? { ...d, riderId, status: STATUS.ASSIGNED, updatedAt: timeNow() }
          : d
      )
    );
  }

  function advanceStatus(orderId, toStatus, opts = {}) {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id !== orderId) return d;
        const fromIdx = STATUS_ORDER.indexOf(d.status);
        const toIdx = STATUS_ORDER.indexOf(toStatus);
        const isForward = toIdx === fromIdx + 1;
        // DELIVERED requires an explicit QR/scan confirmation flag.
        if (toStatus === STATUS.DELIVERED && !opts.viaScan) return d;
        if (!isForward) return d;
        return { ...d, status: toStatus, updatedAt: timeNow() };
      })
    );
  }

  function cancelDelivery(orderId) {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === orderId && d.status !== STATUS.DELIVERED
          ? { ...d, status: STATUS.CANCELLED, updatedAt: timeNow() }
          : d
      )
    );
  }

  function getDelivery(orderId) {
    return deliveries.find((d) => d.id === orderId) || null;
  }

  function riderName(riderId) {
    return RIDERS.find((r) => r.id === riderId)?.name || 'Unassigned';
  }

  const value = useMemo(
    () => ({
      deliveries,
      riders: RIDERS,
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
    [deliveries, session]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
