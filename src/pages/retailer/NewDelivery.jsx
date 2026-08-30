import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const initialForm = { customer: '', phone: '', address: '', item: '', notes: '', amount: '' };

export default function NewDelivery() {
  const { createDelivery } = useData();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.customer || !form.phone || !form.address || !form.item) {
      setError('Please fill in customer name, phone, address, and item description.');
      return;
    }
    const delivery = createDelivery(form);
    navigate(`/retailer/delivery/${delivery.id}`);
  }

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <div className="page-header__title">
        <h1>New Delivery</h1>
        <p>Submit a delivery request for the dispatcher to assign.</p>
      </div>

      <form className="card card-pad" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="field">
          <label>Customer Name</label>
          <input value={form.customer} onChange={(e) => update('customer', e.target.value)} placeholder="e.g. John Doe" />
        </div>
        <div className="field">
          <label>Phone Number</label>
          <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="07XXXXXXXX" />
        </div>
        <div className="field">
          <label>Delivery Address</label>
          <input value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Full delivery address" />
        </div>
        <div className="field">
          <label>Item Description</label>
          <input value={form.item} onChange={(e) => update('item', e.target.value)} placeholder="What's the item?" />
        </div>
        <div className="field">
          <label>Order Value (optional)</label>
          <input value={form.amount} onChange={(e) => update('amount', e.target.value)} placeholder="e.g. KSh 2,500" />
        </div>
        <div className="field">
          <label>Additional Notes (optional)</label>
          <textarea rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Any special instructions" />
        </div>

        {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}

        <button className="btn btn-primary btn-block" type="submit">
          Submit Delivery Request
        </button>
      </form>
    </div>
  );
}
