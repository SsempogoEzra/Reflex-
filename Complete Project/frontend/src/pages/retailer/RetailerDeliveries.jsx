import { useData } from '../../context/DataContext';
import DeliveryList from '../../components/DeliveryList';

export default function RetailerDeliveries() {
  const { deliveries } = useData();

  return (
    <div className="page">
      <div className="page-header__title">
        <h1>My Deliveries</h1>
        <p>Every request you've created, oldest to newest.</p>
      </div>
      <div className="card">
        <DeliveryList deliveries={deliveries} basePath="/retailer/delivery" />
      </div>
    </div>
  );
}
