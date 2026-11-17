import { useState } from 'react';
import { Settings, Bell, Lock, CreditCard, Shield, Save } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export default function DesignerSettings() {
  const { addToast } = useApp();

  const [instantBooking, setInstantBooking] = useState(false);
  const [leadTime, setLeadTime] = useState('24 hours');
  const [bankAccount, setBankAccount] = useState('HDFC Bank •••• 4210');
  const [ifsc, setIfsc] = useState('HDFC0001234');

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Studio settings and payout preferences updated!', 'success');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
          Studio Settings
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
          Manage your booking rules, payout bank account, and notifications.
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Booking Rules Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '16px' }}>
            Booking Preferences & Lead Time
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6', marginBottom: '16px' }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: '#1E1B4B' }}>Instant Booking Acceptance</strong>
              <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '2px 0 0' }}>
                Automatically confirm bookings if the slot is open on your calendar
              </p>
            </div>
            <input
              type="checkbox"
              checked={instantBooking}
              onChange={() => setInstantBooking(!instantBooking)}
              style={{ width: '18px', height: '18px', accentColor: '#7C3AED', cursor: 'pointer' }}
            />
          </div>

          <div className="zorevi-auth-field">
            <label>Minimum Booking Notice / Lead Time</label>
            <select
              className="zorevi-input"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
            >
              <option value="6 hours">6 hours notice</option>
              <option value="12 hours">12 hours notice</option>
              <option value="24 hours">24 hours notice (Recommended)</option>
              <option value="48 hours">48 hours notice</option>
            </select>
          </div>
        </div>

        {/* Bank & Payouts Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CreditCard size={18} color="#7C3AED" /> Bank Account for Payouts
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="zorevi-auth-field">
              <label>Bank Account Number</label>
              <input
                type="text"
                className="zorevi-input"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
              />
            </div>

            <div className="zorevi-auth-field">
              <label>IFSC Code</label>
              <input
                type="text"
                className="zorevi-input"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="zorevi-btn zorevi-btn--primary zorevi-btn--lg">
          <Save size={16} /> Save Studio Settings
        </button>
      </form>
    </div>
  );
}

