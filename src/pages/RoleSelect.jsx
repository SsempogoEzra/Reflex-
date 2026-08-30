import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ClipboardList, Bike, Truck } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ROLES, RIDERS } from '../lib/mockData';

const ROLE_OPTIONS = [
  {
    role: ROLES.RETAILER,
    icon: Store,
    title: 'Retailer',
    desc: 'Create delivery requests and track them',
    color: 'var(--role-retailer)',
    soft: 'var(--role-retailer-soft)',
  },
  {
    role: ROLES.DISPATCHER,
    icon: ClipboardList,
    title: 'Dispatcher',
    desc: 'Assign riders and monitor active deliveries',
    color: 'var(--role-dispatcher)',
    soft: 'var(--role-dispatcher-soft)',
  },
  {
    role: ROLES.RIDER,
    icon: Bike,
    title: 'Rider',
    desc: 'Update status and confirm delivery',
    color: 'var(--role-rider)',
    soft: 'var(--role-rider-soft)',
  },
];

export default function RoleSelect() {
  const { loginAs } = useData();
  const navigate = useNavigate();
  const [pickingRider, setPickingRider] = useState(false);

  function handlePick(role) {
    if (role === ROLES.RIDER) {
      setPickingRider(true);
      return;
    }
    loginAs(role);
    navigate(role === ROLES.RETAILER ? '/retailer' : '/dispatcher');
  }

  function handlePickRider(riderId) {
    loginAs(ROLES.RIDER, riderId);
    navigate('/rider');
  }

  return (
    <div className="role-select">
      <div className="role-select__panel">
        <div className="role-select__brand">
          <div className="role-select__brand-mark">
            <Truck size={20} />
          </div>
          <h1>Reflex</h1>
        </div>
        <p className="role-select__tagline">Delivery Visibility & Coordination System — choose a role to continue</p>

        {!pickingRider ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.role}
                className="role-option"
                style={{ '--role-color': opt.color, '--role-soft': opt.soft }}
                onClick={() => handlePick(opt.role)}
              >
                <span className="role-option__icon">
                  <opt.icon size={20} />
                </span>
                <span className="role-option__text">
                  <strong>{opt.title}</strong>
                  <span>{opt.desc}</span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="card card-pad rider-picker">
            <p style={{ color: 'var(--color-text-dim)', marginBottom: 4 }}>Continue as which rider?</p>
            {RIDERS.map((r) => (
              <button
                key={r.id}
                className="rider-picker__option"
                style={{ '--role-rider': 'var(--role-rider)' }}
                onClick={() => handlePickRider(r.id)}
              >
                <span>
                  <strong>{r.name}</strong>
                </span>
                <span style={{ color: 'var(--color-text-dim)', fontSize: 12 }}>{r.phone}</span>
              </button>
            ))}
            <button className="btn btn-ghost" onClick={() => setPickingRider(false)}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
