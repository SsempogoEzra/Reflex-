import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';
import { STATUS } from '../../lib/mockData';

export default function DispatcherDashboard() {
  const { deliveries, riders, assignRider } = useData();
  const [tab, setTab] = useState('open');
  const [selectedRider, setSelectedRider] = useState({});
  const navigate = useNavigate();

  const open = deliveries.filter((d) => d.status === STATUS.CREATED);
  const active = deliveries.filter((d) => d.status === STATUS.ASSIGNED || d.status === STATUS.PICKED_UP || d.status === STATUS.IN_TRANSIT);

  function handleAssign(orderId) {
    const riderId = selectedRider[orderId];
    if (!riderId) return;
    assignRider(orderId, riderId);
  }

  return (
    <div className="page">
      <div className="page-header__title">
        <h1>Dashboard</h1>
        <p>Assign riders to new requests and keep an eye on active deliveries.</p>
      </div>

      <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="card card-pad summary-card">
          <div className="summary-card__icon" style={{ background: 'var(--role-dispatcher-soft)', color: 'var(--role-dispatcher)' }}>
            <PackageSearch size={20} />
          </div>
          <div className="summary-card__body">
            <span className="summary-card__value">{open.length}</span>
            <span className="summary-card__label">Open / Unassigned</span>
          </div>
        </div>
        <div className="card card-pad summary-card">
          <div className="summary-card__icon" style={{ background: 'var(--color-warning-soft)', color: 'var(--color-warning)' }}>
            <PackageSearch size={20} />
          </div>
          <div className="summary-card__body">
            <span className="summary-card__value">{active.length}</span>
            <span className="summary-card__label">Active Deliveries</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab${tab === 'open' ? ' active' : ''}`} onClick={() => setTab('open')}>
          Open / Unassigned ({open.length})
        </button>
        <button className={`tab${tab === 'active' ? ' active' : ''}`} onClick={() => setTab('active')}>
          Active ({active.length})
        </button>
      </div>

      <div className="card">
        {tab === 'open' ? (
          open.length === 0 ? (
            <div className="empty-state">
              <PackageSearch size={32} />
              <p>No unassigned orders right now.</p>
            </div>
          ) : (
            open.map((d) => (
              <div key={d.id} className="order-card">
                <div className="order-card__info">
                  <strong>#{d.id} · {d.customer}</strong>
                  <span>{d.item} · {d.amount || '—'}</span>
                  <span>{d.address}</span>
                  <span>Requested {d.requestedAt}</span>
                </div>
                <div className="order-card__actions">
                  <select
                    className="select-rider"
                    value={selectedRider[d.id] || ''}
                    onChange={(e) => setSelectedRider((s) => ({ ...s, [d.id]: e.target.value }))}
                  >
                    <option value="" disabled>
                      Select Rider
                    </option>
                    {riders.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-primary" disabled={!selectedRider[d.id]} onClick={() => handleAssign(d.id)}>
                    Assign
                  </button>
                </div>
              </div>
            ))
          )
        ) : active.length === 0 ? (
          <div className="empty-state">
            <PackageSearch size={32} />
            <p>No active deliveries right now.</p>
          </div>
        ) : (
          active.map((d) => (
            <div key={d.id} className="order-card" role="button" onClick={() => navigate(`/dispatcher/delivery/${d.id}`)}>
              <div className="order-card__info">
                <strong>#{d.id} · {d.customer}</strong>
                <span>{d.address}</span>
              </div>
              <StatusBadge status={d.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
