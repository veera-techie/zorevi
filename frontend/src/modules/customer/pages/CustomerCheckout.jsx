import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck, Check, Sparkles, CreditCard, ArrowRight,
  MapPin, Calendar, Clock, User, Info, AlertTriangle
} from 'lucide-react';
import { mockDesigners, mockServices, mockMalls } from '../../../services/mockData';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import { useApp } from '../../../context/AppContext';

export default function CustomerCheckout() {
  const navigate = useNavigate();
  const { addToast } = useApp();

  // Retrieve draft or fallback
  const savedDraftStr = sessionStorage.getItem('zorevi_checkout_draft');
  const draft = savedDraftStr ? JSON.parse(savedDraftStr) : {
    designer: mockDesigners[1],
    service: mockServices[1],
    occasion: 'Wedding – Bride',
    date: '2025-11-25',
    time: '17:00',
    duration: 3,
    mall: mockMalls[0],
    subtotal: 2896,
    gst: 521,
    total: 3417,
  };

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [upiId, setUpiId] = useState('praveen@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    addToast('Initiating simulated checkout payment...', 'info');

    setTimeout(() => {
      setIsProcessing(false);
      if (simulateFailure) {
        navigate('/customer/payment/failed');
      } else {
        navigate('/customer/payment/success');
      }
    }, 1200);
  };

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Progress Steps Header matching screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', margin: '20px 0 32px' }}>
        {[
          { label: 'Select Service', done: true },
          { label: 'Booking Details', done: true },
          { label: 'Quote Review', active: true },
          { label: 'Payment', next: true },
        ].map((s, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: s.done ? '#10B981' : s.active ? '#7C3AED' : '#F3F4F6',
                color: s.done || s.active ? '#FFFFFF' : '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '700',
              }}
            >
              {s.done ? <Check size={14} /> : idx + 1}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: s.active ? '700' : '500', color: s.active ? '#7C3AED' : '#4B5563' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
          Review Your Booking & Quote
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: 0 }}>
          Confirm your details, review the transparent pricing, and complete your simulated checkout.
        </p>
      </div>

      {/* Grid: Booking details Left, Itemized Quote Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
        {/* Left Column */}
        <div>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
            <div style={{ height: '200px', borderRadius: '16px', overflow: 'hidden', background: '#F5F0FF', marginBottom: '20px' }}>
              <ImageWithFallback
                src={draft.designer?.coverImage || draft.designer?.avatar}
                alt="Selected Style"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                fallbackType="bridal"
              />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '14px' }}>
              {draft.service?.name || 'Bridal Styling'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#4B5563' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#7C3AED" />
                <span>Occasion: <strong>{draft.occasion}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#7C3AED" />
                <span>Date & Time: <strong>{draft.date} • {draft.time}</strong> ({draft.duration} hours)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#7C3AED" />
                <span>Location: <strong>{draft.mall?.name || 'Lakeside Fashion Mall'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} color="#7C3AED" />
                <span>Stylist: <strong>{draft.designer?.name || 'Sneha Kapoor'}</strong></span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '16px' }}>
              Select Payment Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'upi', label: 'UPI / QR (Google Pay, PhonePe, Paytm)', icon: '📱' },
                { id: 'card', label: 'Credit / Debit Card (Visa, Mastercard, RuPay)', icon: '💳' },
                { id: 'netbanking', label: 'Net Banking (HDFC, ICICI, SBI, Axis)', icon: '🏦' },
              ].map((m) => (
                <label
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '12px',
                    border: paymentMethod === m.id ? '2px solid #7C3AED' : '1px solid #E5E7EB',
                    background: paymentMethod === m.id ? '#FAF5FF' : '#FFFFFF',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    color: '#1E1B4B',
                  }}
                >
                  <input
                    type="radio"
                    name="paymethod"
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                  />
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </label>
              ))}
            </div>

            {paymentMethod === 'upi' && (
              <div style={{ marginTop: '14px' }}>
                <label className="zorevi-form-label">Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  className="zorevi-input"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okhdfcbank"
                />
              </div>
            )}

            {/* Test Toggle for Simulation */}
            <div style={{ marginTop: '16px', padding: '12px', background: '#F9FAFB', borderRadius: '12px', border: '1px dashed #DDD6FE' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#4B5563', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                />
                <span>Simulate payment failure scenario (for testing error recovery)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Quote Breakdown matching screenshot */}
        <div>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '16px' }}>
              Quote Review
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Styling Service (Base Service)</span>
                <strong>₹{draft.subtotal ? Math.round(draft.subtotal * 0.6) : 1499}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Makeup & Hair Coordination</span>
                <strong>₹599</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Outfit Consultation</span>
                <strong>₹299</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Trial Session (Optional)</span>
                <strong>₹499</strong>
              </div>

              <div style={{ height: '1px', background: '#E5E7EB', margin: '8px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Subtotal</span>
                <strong>₹{draft.subtotal || 2896}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Taxes (GST 18%)</span>
                <strong>₹{draft.gst || 521}</strong>
              </div>

              <div style={{ height: '1px', background: '#E5E7EB', margin: '8px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '800', color: '#1E1B4B' }}>
                <span>Total Payable</span>
                <span style={{ color: '#7C3AED' }}>₹{draft.total || 3417}</span>
              </div>
            </div>

            {/* Transparent Pricing Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '10px 14px', borderRadius: '12px', marginTop: '18px' }}>
              <ShieldCheck size={18} color="#10B981" />
              <div style={{ fontSize: '0.78rem', color: '#065F46', lineHeight: '1.4' }}>
                <strong>Transparent Pricing</strong>: Zero hidden convenience charges. Free cancellation up to 24 hrs.
              </div>
            </div>

            <button
              className="zorevi-btn zorevi-btn--primary zorevi-btn--full zorevi-btn--lg"
              style={{ marginTop: '20px' }}
              onClick={handlePay}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Payment...' : `Pay ₹${draft.total || 3417}`} <ArrowRight size={16} />
            </button>

            {/* Guarantee Trust Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F3F4F6', fontSize: '0.72rem', color: '#6B7280' }}>
              <div>✓ 100% Encrypted Checkout</div>
              <div>✓ Verified Stylist Guarantee</div>
              <div>✓ Instant Booking Confirmation</div>
              <div>✓ 24/7 Concierge Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

