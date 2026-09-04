import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import TopBar from './TopBar';
import { useData } from '../context/DataContext';

const ROLE_COLORS = {
  RETAILER: { color: 'var(--role-retailer)', soft: 'var(--role-retailer-soft)' },
  DISPATCHER: { color: 'var(--role-dispatcher)', soft: 'var(--role-dispatcher-soft)' },
  RIDER: { color: 'var(--role-rider)', soft: 'var(--role-rider-soft)' },
};

export default function RoleLayout({ roleLabel, roleKey, links }) {
  const { session, logout } = useData();
  const navigate = useNavigate();
  const roleColorVar = ROLE_COLORS[roleKey];

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (!session) {
    navigate('/');
    return null;
  }

  return (
    <div className="app-shell">
      <Sidebar roleLabel={roleLabel} roleColorVar={roleColorVar} links={links} onLogout={handleLogout} />
      <div className="main-col">
        <TopBar title={`Reflex · ${roleLabel}`} userName={session.user.name} roleColorVar={roleColorVar} />
        <Outlet />
      </div>
      <MobileNav roleColorVar={roleColorVar} links={links} />
    </div>
  );
}
