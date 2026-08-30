import { useState } from 'react';
import { ScanLine, CheckCircle2, Zap } from 'lucide-react';

export default function Scanner({ orderId, onConfirmed }) {
  const [state, setState] = useState('idle'); // idle | scanning | success

  function simulateScan() {
    setState('scanning');
    setTimeout(() => {
      setState('success');
      setTimeout(() => onConfirmed(), 700);
    }, 1200);
  }

  return (
    <div className="scanner">
      <div className="scanner__frame">
        {state === 'success' ? (
          <div className="scanner__success">
            <CheckCircle2 size={44} />
          </div>
        ) : (
          <>
            <ScanLine size={40} color="var(--color-text-faint)" />
            <span className="scanner__scanline" />
          </>
        )}
      </div>

      {state === 'success' ? (
        <p style={{ color: 'var(--color-success)', fontWeight: 700 }}>Order #{orderId} confirmed delivered</p>
      ) : (
        <>
          <p style={{ color: 'var(--color-text-dim)', textAlign: 'center' }}>
            Point the camera at the customer's QR / barcode to confirm order #{orderId}.
          </p>
          <button className="btn btn-success btn-block" onClick={simulateScan} disabled={state === 'scanning'}>
            <Zap size={16} />
            {state === 'scanning' ? 'Scanning…' : 'Simulate Scan'}
          </button>
        </>
      )}
    </div>
  );
}
