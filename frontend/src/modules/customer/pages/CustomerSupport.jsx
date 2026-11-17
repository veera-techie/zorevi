import { useState } from 'react';
import { HelpCircle, Send, MessageSquare, Phone, ShieldCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export default function CustomerSupport() {
  const [topic, setTopic] = useState('Booking Reschedule / Timing');
  const [bookingRef, setBookingRef] = useState('ZV-8402');
  const [message, setMessage] = useState('');
  const { addToast } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      addToast('Please enter your query details', 'error');
      return;
    }
    addToast('Support ticket created. Our team will get back to you shortly.', 'success');
    setMessage('');
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', width: '100%', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
          Customer Support
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
          Get help with your bookings, meeting points, stylist disputes, or refunds.
        </p>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
        <form onSubmit={handleSubmit}>
          <div className="zorevi-auth-field">
            <label>Issue Category</label>
            <select
              className="zorevi-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option>Booking Reschedule / Timing</option>
              <option>Mall Meeting Point Assistance</option>
              <option>Stylist Late / Did not show</option>
              <option>Billing, Invoice & GST Query</option>
              <option>Refund Request</option>
              <option>Re-open Closed Booking Chat</option>
            </select>
          </div>

          <div className="zorevi-auth-field">
            <label>Related Booking ID (Optional)</label>
            <input
              type="text"
              className="zorevi-input"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              placeholder="e.g. ZV-8402"
            />
          </div>

          <div className="zorevi-auth-field">
            <label>Describe Your Query or Situation *</label>
            <textarea
              className="zorevi-textarea"
              rows="5"
              placeholder="Please provide full details so our concierge team can resolve it immediately..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="zorevi-btn zorevi-btn--primary zorevi-btn--lg">
            Submit Support Request <Send size={15} />
          </button>
        </form>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #F3F4F6', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.82rem', color: '#6B7280' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Phone size={18} color="#7C3AED" />
            <span>Support Helpline: 1800-ZOREVI-STYLE (Mon–Sun 9am–9pm)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={18} color="#10B981" />
            <span>Escalation Guarantee: 15-minute response on active bookings</span>
          </div>
        </div>
      </div>
    </div>
  );
}

