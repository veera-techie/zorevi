import { useState } from 'react';
import { Bell, Lock, Shield, Smartphone, Mail, Globe, Save } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export default function CustomerSettings() {
  const { addToast } = useApp();

  const [notifications, setNotifications] = useState({
    bookingAlertsInApp: true,
    bookingAlertsEmail: true,
    bookingAlertsSms: false,
    chatMessagesInApp: true,
    chatMessagesEmail: false,
    promotionsEmail: true,
  });

  const [language, setLanguage] = useState('English (India)');
  const [currency, setCurrency] = useState('INR (₹)');

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Account preferences saved (Demo settings updated)', 'success');
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', width: '100%', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
          Account Settings
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
          Manage your notification channels, security, and regional preferences.
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Notification Preferences */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Bell size={18} color="#7C3AED" /> Notification Channels
            </h3>
            <span style={{ fontSize: '0.72rem', background: '#F5F0FF', color: '#7C3AED', padding: '3px 8px', borderRadius: '9999px', fontWeight: '600' }}>
              Demo Settings
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: '20px' }}>
            Choose how you receive booking updates, arrival pings, and chat messages. (Simulated in local state).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#1E1B4B' }}>In-App Push Alerts</strong>
                <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '2px 0 0' }}>Instant status notifications for confirmed bookings and messages</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.bookingAlertsInApp}
                onChange={() => toggleNotification('bookingAlertsInApp')}
                style={{ width: '18px', height: '18px', accentColor: '#7C3AED', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#1E1B4B' }}>Email Notifications</strong>
                <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '2px 0 0' }}>Invoices, quote breakdowns, and session confirmations</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.bookingAlertsEmail}
                onChange={() => toggleNotification('bookingAlertsEmail')}
                style={{ width: '18px', height: '18px', accentColor: '#7C3AED', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#1E1B4B' }}>SMS Updates</strong>
                <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '2px 0 0' }}>Urgent arrival alerts and OTP security verifications</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.bookingAlertsSms}
                onChange={() => toggleNotification('bookingAlertsSms')}
                style={{ width: '18px', height: '18px', accentColor: '#7C3AED', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Security & Password */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Lock size={18} color="#7C3AED" /> Security & Passwords
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: '20px' }}>
            Ensure your account is protected with strong credentials.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="zorevi-auth-field">
              <label>Current Password</label>
              <input type="password" placeholder="••••••••" className="zorevi-input" />
            </div>

            <div className="zorevi-auth-field">
              <label>New Password</label>
              <input type="password" placeholder="••••••••" className="zorevi-input" />
            </div>
          </div>
        </div>

        <button type="submit" className="zorevi-btn zorevi-btn--primary zorevi-btn--lg">
          <Save size={16} /> Save Settings
        </button>
      </form>
    </div>
  );
}

