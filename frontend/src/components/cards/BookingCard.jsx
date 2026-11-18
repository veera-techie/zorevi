import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, MessageSquare } from 'lucide-react';
import Badge from '../common/Badge';
import ImageWithFallback from '../common/ImageWithFallback';
import './Cards.css';

export default function BookingCard({
  booking,
  role = 'customer',
  onCancel,
  onReschedule,
}) {
  const isCustomer = role === 'customer';
  const personName = isCustomer ? booking.designerName : booking.customerName;
  const personAvatar = isCustomer ? booking.designerAvatar : booking.customerAvatar;
  const detailsUrl = isCustomer
    ? `/customer/bookings/${booking.id}`
    : `/designer/bookings/${booking.id}`;
  const chatUrl = isCustomer
    ? `/customer/bookings/${booking.id}/messages`
    : `/designer/bookings/${booking.id}/messages`;

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Confirmed': return 'confirmed';
      case 'Pending': return 'pending';
      case 'Upcoming': return 'upcoming';
      case 'Completed': return 'completed';
      case 'Cancelled': return 'cancelled';
      default: return 'default';
    }
  };

  return (
    <div className="zorevi-booking-card">
      <div className="zorevi-booking-card__left">
        <ImageWithFallback
          src={personAvatar}
          alt={personName}
          className="zorevi-booking-card__avatar"
          fallbackType={isCustomer ? 'designer' : 'avatar'}
        />
        <div className="zorevi-booking-card__info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h4>{booking.service}</h4>
            <Badge variant={getBadgeVariant(booking.status)} size="sm">
              {booking.status}
            </Badge>
          </div>

          <div className="zorevi-booking-card__meta">
            <span>
              <strong>{isCustomer ? 'Designer:' : 'Customer:'}</strong> {personName}
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} /> {booking.date}
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} /> {booking.startTime}
            </span>
            {booking.location?.mallName && (
              <>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} /> {booking.location.mallName}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="zorevi-booking-card__actions">
        {booking.status === 'Confirmed' && (
          <Link to={chatUrl} className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
            <MessageSquare size={14} /> Chat
          </Link>
        )}

        <Link to={detailsUrl} className="zorevi-btn zorevi-btn--primary zorevi-btn--sm">
          View Details
        </Link>

        {booking.status === 'Pending' && onCancel && (
          <button
            className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm"
            onClick={() => onCancel(booking.id)}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

