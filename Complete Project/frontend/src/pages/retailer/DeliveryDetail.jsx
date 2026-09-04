import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';
import StatusTimeline from '../../components/StatusTimeline';
import { STATUS } from '../../lib/mockData';

export default function RetailerDeliveryDetail() {
  const { orderId } = useParams();
  const { getDelivery, riderName, cancelDelivery } = useData();
  const navigate = useNavigate();
  const delivery = getDelivery(orderId);

  if (!delivery) {
    return (
      <div className="page">
        <p>Delivery #{orderId} was not found.</p>
        <Link to="/retailer" className="btn btn-ghost" style={{ width: 'fit-content' }}>
          Back to dashboard
        </Link>
      </div>
    );
  }

  const canCancel = delivery.status !== STATUS.DELIVERED && delivery.status !== STATUS.CANCELLED;

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <button className="btn btn-ghost" style={{ width: 'fit-content' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="page-header">
        <div className="page-header__title">
          <h1>#{delivery.id}</h1>
          <p>Requested {delivery.requestedAt} · Updated {delivery.updatedAt}</p>
        </div>
        <StatusBadge status={delivery.status} />
      </div>

      {delivery.status !== STATUS.CANCELLED && (
        <div className="card card-pad">
          <StatusTimeline status={delivery.status} />
        </div>
      )}

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
          {delivery.amount && (
            <>
              <dt>Value</dt>
              <dd>{delivery.amount}</dd>
            </>
          )}
          <dt>Rider</dt>
          <dd>{delivery.riderId ? riderName(delivery.riderId) : 'Not yet assigned'}</dd>
          {delivery.notes && (
            <>
              <dt>Notes</dt>
              <dd>{delivery.notes}</dd>
            </>
          )}
        </dl>
      </div>

      {canCancel && (
        <button
          className="btn btn-danger-ghost"
          style={{ width: 'fit-content' }}
          onClick={() => {
            cancelDelivery(delivery.id);
          }}
        >
          Cancel Request
        </button>
      )}
    </div>
  );
}
