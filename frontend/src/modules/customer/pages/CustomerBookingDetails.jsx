import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, CheckCircle2, MessageSquare, Phone,
  FileText, ShieldCheck, ChevronLeft, ArrowRight, Share2, AlertCircle
} from 'lucide-react';
import { mockBookings } from '../../../services/mockData';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/common/Modal';
import { useApp } from '../../../context/AppContext';

export default function CustomerBookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useApp();

  const [booking, setBooking] = useState(
    mockBookings.find((b) => b.id === bookingId) || mockBookings[0]
  );
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState('2025-11-26');
  const [newTime, setNewTime] = useState('14:00');

  const handleRescheduleSubmit = () => {
    setBooking((prev) => ({
      ...prev,
      date: newDate,
      startTime: newTime,
      status: 'Rescheduled',
    }));
    setIsRescheduleOpen(false);
    addToast('Booking successfully rescheduled! Stylist notified.', 'success');
  };

  const handleDownloadInvoice = () => {
    addToast('Simulating PDF invoice generation and download for Booking #' + booking.id, 'info');
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Back button */}
      <div style={{ marginBottom: '16px' }}>
        <Link
          to="/customer/bookings"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.85rem', textDecoration: 'none' }}
        >
          <ChevronLeft size={16} /> Back to My Bookings
        </Link>
      </div>

      {/* Title & Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
            Booking Details
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
            Your styling session information, meeting point, and live status.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Badge variant={booking.status === 'Confirmed' ? 'confirmed' : 'pending'} size="md">
            {booking.status}
          </Badge>
          <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
            Booking ID: <strong>{booking.id}</strong>
          </span>
        </div>
      </div>

      {/* Top Banner Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1.2fr 1fr', gap: '20px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '140px', background: '#F5F0FF' }}>
          <ImageWithFallback
            src={booking.designerAvatar}
            alt={booking.service}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            fallbackType="bridal"
          />
        </div>

        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 8px 0' }}>
            {booking.service}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#4B5563' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="#7C3AED" /> {booking.date} • {booking.startTime} ({booking.duration} hours)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#7C3AED" /> {booking.location?.mallName || 'Shopping Mall'}
            </span>
            <span>Occasion: <strong>{booking.occasion}</strong> • Category: <strong>{booking.serviceCategory}</strong></span>
          </div>
        </div>

        <div style={{ background: '#FAF5FF', border: '1px solid #DDD6FE', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Amount Paid</span>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#7C3AED', margin: '2px 0' }}>
              ₹{booking.amount}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} /> Payment Successful via UPI
            </span>
          </div>

          <button
            className="zorevi-btn zorevi-btn--outline zorevi-btn--sm"
            style={{ marginTop: '10px' }}
            onClick={handleDownloadInvoice}
          >
            <FileText size={13} /> View Invoice
          </button>
        </div>
      </div>

      {/* Booking Timeline Tracker */}
      <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #F3F4F6', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '20px' }}>
          Booking Progress Tracker
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', textAlign: 'center', position: 'relative' }}>
          {[
            { label: 'Booked', date: '18 Nov, 10:24 AM', done: true },
            { label: 'Confirmed', date: '18 Nov, 10:36 AM', done: true },
            { label: 'Upcoming', date: '22 Nov, 4:00 PM', active: true },
            { label: 'In Session', date: 'Day of Session', pending: true },
            { label: 'Completed', date: 'After Session', pending: true },
          ].map((step, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step.done ? '#10B981' : step.active ? '#7C3AED' : '#F3F4F6',
                  color: step.done || step.active ? '#FFFFFF' : '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  boxShadow: step.active ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none',
                }}
              >
                {step.done ? <CheckCircle2 size={16} /> : idx + 1}
              </div>
              <strong style={{ fontSize: '0.82rem', color: step.active ? '#7C3AED' : '#1E1B4B' }}>{step.label}</strong>
              <small style={{ fontSize: '0.7rem', color: '#6B7280' }}>{step.date}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column details: Designer on Left, Venue details on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Confirmed Designer */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #F3F4F6', padding: '20px' }}>
          <h4 style={{ fontSize: '0.9rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '14px' }}>
            Confirmed Designer
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img src={booking.designerAvatar} alt={booking.designerName} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong style={{ fontSize: '1rem', color: '#1E1B4B' }}>{booking.designerName}</strong>
                <CheckCircle2 size={16} color="#10B981" />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6B7280', margin: '2px 0 6px' }}>Fashion Stylist • ★ 4.9 (2.1k reviews)</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to={`/customer/designers/${booking.designerId}`} className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                  View Profile
                </Link>
                <Link to={`/customer/bookings/${booking.id}/messages`} className="zorevi-btn zorevi-btn--primary zorevi-btn--sm">
                  <MessageSquare size={13} /> Chat
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Venue Details */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #F3F4F6', padding: '20px' }}>
          <h4 style={{ fontSize: '0.9rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '14px' }}>
            Venue Details
          </h4>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F5F0FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={22} />
            </div>
            <div>
              <strong style={{ fontSize: '1rem', color: '#1E1B4B' }}>{booking.location?.mallName || 'Lakeside Fashion Mall'}</strong>
              <p style={{ fontSize: '0.8rem', color: '#4B5563', margin: '4px 0 6px' }}>
                {booking.location?.meetingPoint || 'Ground Floor – Main Atrium near Central Fountain'}
              </p>
              <Link to={`/customer/malls/${booking.location?.mallId || 'mall-001'}`} style={{ fontSize: '0.8rem', color: '#7C3AED', fontWeight: '600', textDecoration: 'none' }}>
                View Mall Details & Stores →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar matching screenshot */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', background: '#FFFFFF', padding: '20px', borderRadius: '20px', border: '1px solid #F3F4F6' }}>
        <Link to={`/customer/bookings/${booking.id}/messages`} className="zorevi-btn zorevi-btn--primary">
          <MessageSquare size={16} /> Join Conversation
        </Link>

        <button className="zorevi-btn zorevi-btn--outline" onClick={() => setIsRescheduleOpen(true)}>
          <Calendar size={16} /> Reschedule Session
        </button>

        <button
          className="zorevi-btn zorevi-btn--ghost"
          style={{ color: '#EF4444' }}
          onClick={() => {
            setBooking((prev) => ({ ...prev, status: 'Cancelled' }));
            addToast('Booking cancelled. Full refund will be processed.', 'info');
          }}
        >
          Cancel Booking
        </button>

        <button
          className="zorevi-btn zorevi-btn--ghost"
          style={{ marginLeft: 'auto' }}
          onClick={() => addToast('Event added to Google Calendar & Apple iCal', 'success')}
        >
          Add to Calendar
        </button>
      </div>

      {/* Reschedule Modal */}
      {isRescheduleOpen && (
        <Modal
          isOpen={isRescheduleOpen}
          onClose={() => setIsRescheduleOpen(false)}
          title="Reschedule Styling Session"
          maxWidth="480px"
        >
          <p style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: '16px' }}>
            Choose a new date and time slot for your styling session with {booking.designerName}.
          </p>

          <div className="zorevi-form-group">
            <label className="zorevi-form-label">New Date</label>
            <input
              type="date"
              className="zorevi-input"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>

          <div className="zorevi-form-group" style={{ marginTop: '14px' }}>
            <label className="zorevi-form-label">New Time Slot</label>
            <select
              className="zorevi-input"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            >
              <option value="11:00">11:00 AM</option>
              <option value="14:00">02:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="18:00">06:00 PM</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
            <button className="zorevi-btn zorevi-btn--outline" onClick={() => setIsRescheduleOpen(false)}>
              Back
            </button>
            <button className="zorevi-btn zorevi-btn--primary" onClick={handleRescheduleSubmit}>
              Confirm Reschedule
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

