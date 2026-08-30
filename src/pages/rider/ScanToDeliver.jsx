import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Scanner from '../../components/Scanner';
import { STATUS } from '../../lib/mockData';

export default function ScanToDeliver() {
  const { orderId } = useParams();
  const { getDelivery, advanceStatus } = useData();
  const navigate = useNavigate();
  const delivery = getDelivery(orderId);

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

  function handleConfirmed() {
    advanceStatus(delivery.id, STATUS.DELIVERED, { viaScan: true });
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
