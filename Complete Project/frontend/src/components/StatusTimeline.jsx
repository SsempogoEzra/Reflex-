import { Check } from 'lucide-react';
import { STATUS_CONFIG, STATUS_ORDER } from '../lib/mockData';

export default function StatusTimeline({ status }) {
  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div className="timeline">
      {STATUS_ORDER.map((s, idx) => {
        const isDone = idx < currentIdx || status === 'DELIVERED';
        const isCurrent = idx === currentIdx && status !== 'DELIVERED';
        return (
          <div key={s} className={`timeline__step${isDone ? ' done' : ''}${isCurrent ? ' current' : ''}`}>
            <div className="timeline__dot">
              {isDone ? <Check size={14} strokeWidth={3} /> : idx + 1}
              <span className="timeline__line" />
            </div>
            <span className="timeline__label">{STATUS_CONFIG[s].label}</span>
          </div>
        );
      })}
    </div>
  );
}
