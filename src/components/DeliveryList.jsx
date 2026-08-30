import { useNavigate } from 'react-router-dom';
import { ChevronRight, PackageSearch } from 'lucide-react';
import StatusBadge from './StatusBadge';

// basePath e.g. "/retailer/delivery" or "/rider/delivery"
export default function DeliveryList({ deliveries, basePath, emptyLabel = 'No deliveries yet' }) {
  const navigate = useNavigate();

  if (!deliveries.length) {
    return (
      <div className="empty-state">
        <PackageSearch size={32} />
        <p>{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="delivery-list__head">
        <span>Order ID</span>
        <span>Customer</span>
        <span>Address</span>
        <span>Status</span>
        <span>Updated</span>
        <span />
      </div>
      {deliveries.map((d) => (
        <div key={d.id} className="delivery-row" onClick={() => navigate(`${basePath}/${d.id}`)} role="button" tabIndex={0}>
          <span className="delivery-row__id">#{d.id}</span>
          <div className="delivery-row__meta">
            <strong>{d.customer}</strong>
            <span>{d.item}</span>
          </div>
          <div className="delivery-row__meta">
            <strong style={{ fontWeight: 500 }}>{d.address}</strong>
          </div>
          <span className="delivery-row__status">
            <StatusBadge status={d.status} />
          </span>
          <span className="delivery-row__time">{d.updatedAt}</span>
          <span className="delivery-row__chevron">
            <ChevronRight size={16} />
          </span>
        </div>
      ))}
    </div>
  );
}
