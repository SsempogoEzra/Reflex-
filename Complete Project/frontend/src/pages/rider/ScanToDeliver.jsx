import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Scanner from '../../components/Scanner';

export default function ScanToDeliver() {
  const { orderId } = useParams();
  const { getDelivery, loading } = useData();
  const navigate = useNavigate();
  const delivery = getDelivery(orderId);

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

  // Scanner now calls advanceStatus(orderId, 'DELIVERED', {verificationCode})
  // internally and only fires onConfirmed() once that succeeds — this just
  // needs to navigate away, not update status again.
  function handleConfirmed() {
    navigate(`/rider/delivery/${delivery.id}`);
  }

  return (
    <div className="page" style={{ maxWidth: 480 }}>
      <button className="btn btn-ghost" style={{ width: 'fit-content' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Back
      </button>
      <div className="page-header__title">
        <h1>Scan to Deliver</h1>
        <p>Point your camera at the QR / barcode to confirm this order as delivered.</p>
      </div>
      <div className="card">
        <Scanner orderId={delivery.id} onConfirmed={handleConfirmed} />
      </div>
    </div>
  );
}
