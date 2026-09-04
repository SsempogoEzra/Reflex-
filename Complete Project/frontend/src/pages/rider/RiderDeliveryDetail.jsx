import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, ScanLine } from 'lucide-react';
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

export default function RiderDeliveryDetail() {
  const { orderId } = useParams();
  const { getDelivery, advanceStatus, loading } = useData();
  const navigate = useNavigate();
  const delivery = getDelivery(orderId);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

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
        <Link to="/rider" className="btn btn-ghost" style={{ width: 'fit-content' }}>
          Back to my deliveries
        </Link>
      </div>
    );
  }

  const isDone = delivery.status === STATUS.DELIVERED || delivery.status === STATUS.CANCELLED;

  async function handleAdvance(toStatus) {
    setUpdating(true);
    setUpdateError('');
    try {
      await advanceStatus(delivery.id, toStatus);
    } catch (err) {
      setUpdateError(err.message || 'Could not update status');
    } finally {
      setUpdating(false);
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
          <p>Assigned {formatDateTime(delivery.updatedAt)}</p>
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
          <dd style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Phone size={14} /> {delivery.phone}
          </dd>
          <dt>Address</dt>
          <dd style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} /> {delivery.address}
          </dd>
          <dt>Item</dt>
          <dd>{delivery.item}</dd>
          {!!delivery.amount && (
            <>
              <dt>Value</dt>
              <dd>{delivery.amount}</dd>
            </>
          )}
          {delivery.notes && (
            <>
              <dt>Notes</dt>
              <dd>{delivery.notes}</dd>
            </>
          )}
        </dl>
      </div>

      {updateError && <p style={{ color: 'var(--color-danger)' }}>{updateError}</p>}

      {!isDone && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {delivery.status === STATUS.ASSIGNED && (
            <button className="btn btn-primary btn-block" disabled={updating} onClick={() => handleAdvance(STATUS.PICKED_UP)}>
              {updating ? 'Updating…' : 'Mark as Picked Up'}
            </button>
          )}
          {delivery.status === STATUS.PICKED_UP && (
            <button className="btn btn-primary btn-block" disabled={updating} onClick={() => handleAdvance(STATUS.IN_TRANSIT)}>
              {updating ? 'Updating…' : 'Mark as In Transit'}
            </button>
          )}
          {delivery.status === STATUS.IN_TRANSIT && (
            <button className="btn btn-success btn-block" onClick={() => navigate(`/rider/delivery/${delivery.id}/scan`)}>
              <ScanLine size={16} />
              Scan to Deliver
            </button>
          )}
        </div>
      )}
    </div>
  );
}
