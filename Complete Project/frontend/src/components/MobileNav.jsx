import { NavLink } from 'react-router-dom';

export default function MobileNav({ roleColorVar, links }) {
  return (
    <nav className="mobile-nav" style={{ '--role-color': roleColorVar.color }}>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => `mobile-nav__link${isActive ? ' active' : ''}`}
        >
          <link.icon size={20} />
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
