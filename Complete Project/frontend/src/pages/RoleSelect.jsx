import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ClipboardList, Bike, Truck } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ROLES } from '../lib/mockData';

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
  const { loginAs, riders, retailers, dispatchers, loading } = useData();
  const navigate = useNavigate();
  const [pickingRider, setPickingRider] = useState(false);

  function handlePick(role) {
    if (role === ROLES.RIDER) {
      setPickingRider(true);
      return;
    }
    // NOTE: no real per-user login yet — this logs in as the first fetched
    // retailer/dispatcher. Fine while there's one of each; revisit once
    // there's an actual account/login system.
    loginAs(role);
    navigate(role === ROLES.RETAILER ? '/retailer' : '/dispatcher');
  }

  function handlePickRider(riderId) {
    loginAs(ROLES.RIDER, riderId);
    navigate('/rider');
  }

  if (loading) {
    return (
      <div className="role-select">
        <div className="role-select__panel">
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  const noRetailers = retailers.length === 0;
  const noDispatchers = dispatchers.length === 0;
  const noRiders = riders.length === 0;

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
            {ROLE_OPTIONS.map((opt) => {
              const unavailable =
                (opt.role === ROLES.RETAILER && noRetailers) ||
                (opt.role === ROLES.DISPATCHER && noDispatchers) ||
                (opt.role === ROLES.RIDER && noRiders);
              return (
                <button
                  key={opt.role}
                  className="role-option"
                  style={{ '--role-color': opt.color, '--role-soft': opt.soft }}
                  onClick={() => handlePick(opt.role)}
                  disabled={unavailable}
                  title={unavailable ? `No ${opt.title.toLowerCase()} accounts exist yet` : undefined}
                >
                  <span className="role-option__icon">
                    <opt.icon size={20} />
                  </span>
                  <span className="role-option__text">
                    <strong>{opt.title}</strong>
                    <span>{unavailable ? `No ${opt.title.toLowerCase()} accounts yet` : opt.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="card card-pad rider-picker">
            <p style={{ color: 'var(--color-text-dim)', marginBottom: 4 }}>Continue as which rider?</p>
            {riders.map((r) => (
              <button
                key={r._id}
                className="rider-picker__option"
                style={{ '--role-rider': 'var(--role-rider)' }}
                onClick={() => handlePickRider(r._id)}
              >
                <span>
                  <strong>{r.name}</strong>
                </span>
                <span style={{ color: 'var(--color-text-dim)', fontSize: 12 }}>{r.contact}</span>
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
