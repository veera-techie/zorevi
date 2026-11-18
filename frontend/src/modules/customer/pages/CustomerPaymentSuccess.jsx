import { Link } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, MessageSquare, ArrowRight, Download } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export default function CustomerPaymentSuccess() {
  const { addToast } = useApp();

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto 60px', padding: '0 20px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '28px', border: '1px solid #F3F4F6', padding: '40px', boxShadow: '0 10px 30px rgba(124, 58, 237, 0.08)', textAlign: 'center' }}>
        {/* Animated Checkmark */}
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)' }}>
          <CheckCircle2 size={44} />
        </div>

        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          PAYMENT CONFIRMED
        </span>

        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1E1B4B', margin: '6px 0 10px' }}>
          Your Styling Session is Booked!
        </h1>

        <p style={{ fontSize: '0.95rem', color: '#6B7280', lineHeight: '1.5', marginBottom: '24px' }}>
          Thank you! Your simulated transaction has been processed successfully. Your personal stylist has been notified and confirmed your appointment.
        </p>

        {/* Reference details box */}
        <div style={{ background: '#FAF5FF', border: '1px solid #DDD6FE', borderRadius: '18px', padding: '20px', textAlign: 'left', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Booking Reference:</span>
            <strong style={{ fontSize: '0.9rem', color: '#7C3AED' }}>#ZV-8402</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Stylist:</span>
            <strong style={{ fontSize: '0.85rem', color: '#1E1B4B' }}>Sneha Kapoor (Verified)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Date & Time:</span>
            <strong style={{ fontSize: '0.85rem', color: '#1E1B4B' }}>Sat, 22 Nov • 04:00 PM</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Venue:</span>
            <strong style={{ fontSize: '0.85rem', color: '#1E1B4B' }}>Lakeside Fashion Mall, Hyderabad</strong>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/customer/bookings/ZV-8402/messages" className="zorevi-btn zorevi-btn--primary zorevi-btn--full zorevi-btn--lg">
            <MessageSquare size={16} /> Open Booking Chat
          </Link>

          <Link to="/customer/bookings/ZV-8402" className="zorevi-btn zorevi-btn--outline zorevi-btn--full">
            View Booking Details
          </Link>

          <button
            className="zorevi-btn zorevi-btn--ghost zorevi-btn--full"
            onClick={() => addToast('Simulating receipt download', 'info')}
          >
            <Download size={15} /> Download PDF Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

