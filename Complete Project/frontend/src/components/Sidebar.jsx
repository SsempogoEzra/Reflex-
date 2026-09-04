import { NavLink } from 'react-router-dom';
import { Truck, LogOut } from 'lucide-react';

export default function Sidebar({ roleLabel, roleColorVar, links, onLogout }) {
  return (
    <aside className="sidebar" style={{ '--role-color': roleColorVar.color, '--role-soft': roleColorVar.soft }}>
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark">
          <Truck size={17} />
        </div>
        <div className="sidebar__brand-text">
          <strong>Reflex</strong>
          <span>Delivery coordination</span>
        </div>
      </div>

      <div className="sidebar__role-pill">{roleLabel}</div>

      <nav className="sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__link" onClick={onLogout} style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%' }}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
