import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';
import StatusTimeline from '../../components/StatusTimeline';

export default function DispatcherDeliveryDetail() {
  const { orderId } = useParams();
  const { getDelivery, riderName } = useData();
  const navigate = useNavigate();
  const delivery = getDelivery(orderId);

  if (!delivery) {
    return (
      <div className="page">
        <p>Delivery #{orderId} was not found.</p>
        <Link to="/dispatcher" className="btn btn-ghost" style={{ width: 'fit-content' }}>
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <button className="btn btn-ghost" style={{ width: 'fit-content' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="page-header">
        <div className="page-header__title">
          <h1>#{delivery.id}</h1>
          <p>Rider: {delivery.riderId ? riderName(delivery.riderId) : 'Unassigned'}</p>
        </div>
        <StatusBadge status={delivery.status} />
      </div>

      <div className="card card-pad">
        <StatusTimeline status={delivery.status} />
      </div>

      <div className="card card-pad">
        <dl className="detail-grid">
          <dt>Customer</dt>
          <dd>{delivery.customer}</dd>
          <dt>Phone</dt>
          <dd>{delivery.phone}</dd>
          <dt>Address</dt>
          <dd>{delivery.address}</dd>
          <dt>Item</dt>
          <dd>{delivery.item}</dd>
          <dt>Updated</dt>
          <dd>{delivery.updatedAt}</dd>
        </dl>
      </div>
    </div>
  );
}
