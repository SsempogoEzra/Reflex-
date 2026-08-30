import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { useData } from '../../context/DataContext';
import SummaryCard from '../../components/SummaryCard';
import DeliveryList from '../../components/DeliveryList';
import { STATUS } from '../../lib/mockData';

export default function RetailerDashboard() {
  const { deliveries } = useData();
  const navigate = useNavigate();

  const total = deliveries.length;
  const inProgress = deliveries.filter((d) => d.status === STATUS.ASSIGNED || d.status === STATUS.PICKED_UP || d.status === STATUS.IN_TRANSIT).length;
  const delivered = deliveries.filter((d) => d.status === STATUS.DELIVERED).length;
  const cancelled = deliveries.filter((d) => d.status === STATUS.CANCELLED).length;

  const recent = [...deliveries].slice(0, 6);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header__title">
          <h1>Dashboard</h1>
          <p>Track your delivery requests in real time.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/retailer/new')}>
          <Plus size={16} />
          New Delivery
        </button>
      </div>

      <div className="summary-grid">
        <SummaryCard icon={Package} label="Total Deliveries" value={total} color="var(--color-primary)" />
        <SummaryCard icon={Clock} label="In Progress" value={inProgress} color="var(--color-warning)" />
        <SummaryCard icon={CheckCircle2} label="Delivered" value={delivered} color="var(--color-success)" />
        <SummaryCard icon={XCircle} label="Cancelled" value={cancelled} color="var(--color-danger)" />
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Recent Deliveries</h2>
          <span className="link-muted" style={{ cursor: 'pointer' }} onClick={() => navigate('/retailer/deliveries')}>
            View all
          </span>
        </div>
        <DeliveryList deliveries={recent} basePath="/retailer/delivery" />
      </div>
    </div>
  );
}
