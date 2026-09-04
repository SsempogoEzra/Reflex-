import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ListChecks, ClipboardList, Bike } from 'lucide-react';
import { DataProvider, useData } from './context/DataContext';
import RoleLayout from './components/RoleLayout';
import { ROLES } from './lib/mockData';

import RoleSelect from './pages/RoleSelect';
import RetailerDashboard from './pages/retailer/RetailerDashboard';
import RetailerDeliveries from './pages/retailer/RetailerDeliveries';
import NewDelivery from './pages/retailer/NewDelivery';
import RetailerDeliveryDetail from './pages/retailer/DeliveryDetail';
import DispatcherDashboard from './pages/dispatcher/DispatcherDashboard';
import DispatcherDeliveryDetail from './pages/dispatcher/DispatcherDeliveryDetail';
import RiderDashboard from './pages/rider/RiderDashboard';
import RiderDeliveryDetail from './pages/rider/RiderDeliveryDetail';
import ScanToDeliver from './pages/rider/ScanToDeliver';

const RETAILER_LINKS = [
  { to: '/retailer', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/retailer/new', label: 'New Delivery', icon: PlusCircle },
  { to: '/retailer/deliveries', label: 'My Deliveries', icon: ListChecks },
];

const DISPATCHER_LINKS = [{ to: '/dispatcher', label: 'Dashboard', icon: ClipboardList, end: true }];

const RIDER_LINKS = [
  { to: '/rider', label: 'My Deliveries', icon: Bike, end: true },
];

function RequireRole({ role, children }) {
  const { session } = useData();
  if (!session || session.role !== role) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelect />} />

      <Route
        path="/retailer"
        element={
          <RequireRole role={ROLES.RETAILER}>
            <RoleLayout roleLabel="Retailer" roleKey="RETAILER" links={RETAILER_LINKS} />
          </RequireRole>
        }
      >
        <Route index element={<RetailerDashboard />} />
        <Route path="new" element={<NewDelivery />} />
        <Route path="deliveries" element={<RetailerDeliveries />} />
        <Route path="delivery/:orderId" element={<RetailerDeliveryDetail />} />
      </Route>

      <Route
        path="/dispatcher"
        element={
          <RequireRole role={ROLES.DISPATCHER}>
            <RoleLayout roleLabel="Dispatcher" roleKey="DISPATCHER" links={DISPATCHER_LINKS} />
          </RequireRole>
        }
      >
        <Route index element={<DispatcherDashboard />} />
        <Route path="delivery/:orderId" element={<DispatcherDeliveryDetail />} />
      </Route>

      <Route
        path="/rider"
        element={
          <RequireRole role={ROLES.RIDER}>
            <RoleLayout roleLabel="Rider" roleKey="RIDER" links={RIDER_LINKS} />
          </RequireRole>
        }
      >
        <Route index element={<RiderDashboard />} />
        <Route path="delivery/:orderId" element={<RiderDeliveryDetail />} />
        <Route path="delivery/:orderId/scan" element={<ScanToDeliver />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DataProvider>
  );
}
