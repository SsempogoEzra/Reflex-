export default function TopBar({ title, userName, roleColorVar }) {
  const initials = userName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');

  return (
    <header className="topbar">
      <span className="topbar__title">{title}</span>
      <div className="topbar__user">
        <span className="text-small" style={{ color: 'var(--color-text-dim)' }}>
          {userName}
        </span>
        <div className="avatar" style={{ '--role-color': roleColorVar.color }}>
          {initials}
        </div>
      </div>
    </header>
  );
}
