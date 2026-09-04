export default function SummaryCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card card-pad summary-card">
      <div className="summary-card__icon" style={{ background: `${color}22`, color }}>
        <Icon size={20} strokeWidth={2.2} />
      </div>
      <div className="summary-card__body">
        <span className="summary-card__value">{value}</span>
        <span className="summary-card__label">{label}</span>
      </div>
    </div>
  );
}
