import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { formatDate, formatDateTime } from '../../utils';
import './BookingModal.css';

export default function BookingConfirmationModal() {
  const navigate = useNavigate();
  const { bookingConfirmation, clearBookingConfirmation } = useApp();

  if (!bookingConfirmation) return null;

  const handleGoToBookings = () => {
    clearBookingConfirmation();
    navigate('/customer/bookings');
  };

  return (
    <Modal
      isOpen={Boolean(bookingConfirmation)}
      onClose={clearBookingConfirmation}
      title="Booking Request Submitted"
      maxWidth="540px"
    >
      <div className="zorevi-step-pane zorevi-step-status-pane zorevi-confirm-pane">
        <div className="zorevi-status-icon-wrap confirmed zorevi-confirm-icon-animate" aria-hidden="true">
          <CheckCircle2 size={42} color="#059669" strokeWidth={2.2} />
        </div>

        <h3 className="zorevi-status-title">Your Booking Request Has Been Submitted!</h3>

        <span className="zorevi-status-badge pending">
          Current Status: Pending Designer Approval
        </span>

        <p className="zorevi-status-lead">
          Your request has been successfully sent to the designer. Please wait while the designer reviews and accepts your request. You will receive an update through notifications.
        </p>

        <div className="zorevi-status-info-card">
          <div className="status-row">
            <span>Booking Reference:</span>
            <strong>#{bookingConfirmation.id}</strong>
          </div>
          <div className="status-row">
            <span>Designer:</span>
            <strong>{bookingConfirmation.designerName}</strong>
          </div>
          <div className="status-row">
            <span>Occasion &amp; Services:</span>
            <span>
              <Sparkles size={13} style={{ display: 'inline', marginRight: 4, color: '#7C3AED' }} />
              {bookingConfirmation.occasion} ({bookingConfirmation.services?.length || 1})
            </span>
          </div>
          <div className="status-row">
            <span>Requested Session:</span>
            <span>
              <Calendar size={13} style={{ display: 'inline', marginRight: 4, color: '#7C3AED' }} />
              {formatDate(bookingConfirmation.date, bookingConfirmation.date)} at{' '}
              <Clock size={13} style={{ display: 'inline', margin: '0 3px', color: '#7C3AED' }} />
              {bookingConfirmation.time || bookingConfirmation.startTime}
            </span>
          </div>
          <div className="status-row">
            <span>Meeting Venue:</span>
            <span>
              <MapPin size={13} style={{ display: 'inline', marginRight: 4, color: '#7C3AED' }} />
              {bookingConfirmation.meetingLocation || bookingConfirmation.mall?.name || 'Selected Venue'}
            </span>
          </div>
          <div className="status-row">
            <span>Submitted On:</span>
            <span>{formatDateTime(bookingConfirmation.createdAt || bookingConfirmation.submittedAt)}</span>
          </div>
        </div>

        <div className="zorevi-step-actions centered" style={{ width: '100%' }}>
          <button
            type="button"
            className="zorevi-btn zorevi-btn--outline"
            onClick={clearBookingConfirmation}
          >
            Done
          </button>
          <button
            type="button"
            className="zorevi-btn zorevi-btn--primary"
            onClick={handleGoToBookings}
          >
            <span>Go to My Bookings</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </Modal>
  );
}
