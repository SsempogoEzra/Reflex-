import { useData } from '../../context/DataContext';
import DeliveryList from '../../components/DeliveryList';
import { STATUS } from '../../lib/mockData';

export default function RiderDashboard() {
  const { deliveries, session } = useData();
  const riderId = session.user.id;

  const myDeliveries = deliveries.filter((d) => d.riderId === riderId);
  const activeDeliveries = myDeliveries.filter((d) => d.status !== STATUS.DELIVERED && d.status !== STATUS.CANCELLED);
  const history = myDeliveries.filter((d) => d.status === STATUS.DELIVERED || d.status === STATUS.CANCELLED);

  return (
    <div className="page">
      <div className="page-header__title">
        <h1>My Deliveries</h1>
        <p>Deliveries assigned to you. Tap one to update its status.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Active ({activeDeliveries.length})</h2>
        </div>
        <DeliveryList deliveries={activeDeliveries} basePath="/rider/delivery" emptyLabel="Nothing assigned to you right now." />
      </div>

      {history.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>History</h2>
          </div>
          <DeliveryList deliveries={history} basePath="/rider/delivery" />
        </div>
      )}
    </div>
  );
}
