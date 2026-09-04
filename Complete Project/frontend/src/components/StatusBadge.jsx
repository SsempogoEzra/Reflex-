import { STATUS_CONFIG } from '../lib/mockData';

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.CREATED;
  return (
    <span
      className="badge"
      style={{
        color: cfg.color,
        background: cfg.soft,
      }}
    >
      {cfg.label}
    </span>
  );
}
