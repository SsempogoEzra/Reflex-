import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';
import StatusTimeline from '../../components/StatusTimeline';
import { STATUS } from '../../lib/mockData';

function formatDateTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RetailerDeliveryDetail() {
  const { orderId } = useParams();
  const { getDelivery, riderName, cancelDelivery, loading } = useData();
  const navigate = useNavigate();
  const delivery = getDelivery(orderId);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  if (loading) {
    return (
      <div className="page">
        <p>Loading delivery…</p>
      </div>
    );
  }

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

  async function handleCancel() {
    setCancelling(true);
    setCancelError('');
    try {
      await cancelDelivery(delivery.id);
    } catch (err) {
      setCancelError(err.message || 'Could not cancel this delivery');
    } finally {
      setCancelling(false);
    }
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
          <p>
            Requested {formatDateTime(delivery.requestedAt)} · Updated {formatDateTime(delivery.updatedAt)}
          </p>
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
          {!!delivery.amount && (
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

      {cancelError && <p style={{ color: 'var(--color-danger)' }}>{cancelError}</p>}

      {canCancel && (
        <button
          className="btn btn-danger-ghost"
          style={{ width: 'fit-content' }}
          onClick={handleCancel}
          disabled={cancelling}
        >
          {cancelling ? 'Cancelling…' : 'Cancel Request'}
        </button>
      )}
    </div>
  );
}
