import { useState } from 'react';
import { ScanLine, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';

// NOTE: no real camera/QR decoding wired up yet — this is a manual code-entry
// flow that calls the real /verify endpoint. Swap the input for an actual QR
// scanner library later; the onConfirmed contract (passing the code up)
// stays the same either way.
export default function Scanner({ orderId, onConfirmed }) {
  const { advanceStatus } = useData();
  const [code, setCode] = useState('');
  const [state, setState] = useState('idle'); // idle | scanning | success | error
  const [errorMessage, setErrorMessage] = useState('');

  async function submitCode(e) {
    e?.preventDefault();
    if (!code.trim()) return;

    setState('scanning');
    setErrorMessage('');

    try {
      await advanceStatus(orderId, 'DELIVERED', { verificationCode: code.trim().toUpperCase() });
      setState('success');
      setTimeout(() => onConfirmed(), 700);
    } catch (err) {
      setState('error');
      setErrorMessage(err.message || 'Verification failed');
    }
  }

  return (
    <div className="scanner">
      <div className="scanner__frame">
        {state === 'success' ? (
          <div className="scanner__success">
            <CheckCircle2 size={44} />
          </div>
        ) : state === 'error' ? (
          <div className="scanner__error">
            <XCircle size={44} color="var(--color-danger)" />
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
        <form onSubmit={submitCode} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ color: 'var(--color-text-dim)', textAlign: 'center' }}>
            Enter the customer's verification code to confirm order #{orderId}.
          </p>

          <input
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. A1B2C3D4"
            autoCapitalize="characters"
            disabled={state === 'scanning'}
          />

          {state === 'error' && (
            <p style={{ color: 'var(--color-danger)', fontSize: 13, textAlign: 'center' }}>{errorMessage}</p>
          )}

          <button className="btn btn-success btn-block" type="submit" disabled={state === 'scanning' || !code.trim()}>
            <Zap size={16} />
            {state === 'scanning' ? 'Verifying…' : 'Confirm Delivery'}
          </button>
        </form>
      )}
    </div>
  );
}
