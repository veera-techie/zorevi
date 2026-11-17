import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Send, MapPin, Clock, Phone, Video, MoreVertical,
  CheckCircle2, Navigation, AlertCircle, HelpCircle, Lock,
  ChevronLeft
} from 'lucide-react';
import { mockBookings, mockMessages } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import './BookingChat.css';

export default function BookingChat({ role = 'customer' }) {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const { addToast } = useApp();

  // Find active booking
  const currentBooking = mockBookings.find((b) => b.id === (bookingId || 'ZV-8402')) || mockBookings[0];
  const isCustomer = role === 'customer';
  const partnerName = isCustomer ? currentBooking.designerName : currentBooking.customerName;
  const partnerAvatar = isCustomer ? currentBooking.designerAvatar : currentBooking.customerAvatar;

  // Messages state
  const initialMsgs = mockMessages[currentBooking.id] || mockMessages['ZV-8402'] || [];
  const [messages, setMessages] = useState(initialMsgs);
  const [inputText, setInputText] = useState('');
  const [hasArrived, setHasArrived] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Session duration and countdown calculation
  // Let's create an active simulated countdown
  const isSessionClosed = currentBooking.status === 'Completed' || currentBooking.status === 'Cancelled';
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 48, seconds: 26 });

  useEffect(() => {
    if (isSessionClosed) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSessionClosed]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isSessionClosed) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || (isCustomer ? 'cust-001' : 'des-001'),
      senderName: user?.name || (isCustomer ? 'Praveen Kumar' : 'Sneha Kapoor'),
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate partner reply after 2 seconds
    setTimeout(() => {
      const replyMsg = {
        id: `msg-${Date.now() + 1}`,
        senderId: isCustomer ? 'des-002' : 'cust-001',
        senderName: partnerName,
        text: isCustomer
          ? "Got it! Looking forward to meeting you at the store."
          : "Thank you for the update! See you soon.",
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 2000);
  };

  const handleShareMeetingPoint = () => {
    if (isSessionClosed) return;
    const locMsg = {
      id: `msg-loc-${Date.now()}`,
      senderId: user?.id || 'user',
      senderName: user?.name || 'User',
      type: 'location',
      location: {
        name: currentBooking.location?.mallName || 'Lakeside Fashion Mall',
        detail: `Meeting Point: ${currentBooking.location?.meetingPoint || 'Ground Floor – Main Atrium'}`,
        address: currentBooking.location?.address || 'Hyderabad',
      },
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, locMsg]);
    addToast('Meeting location shared in chat', 'success');
  };

  const handleMarkArrival = () => {
    if (isSessionClosed) return;
    setHasArrived(true);
    const arrivalMsg = {
      id: `msg-arr-${Date.now()}`,
      senderId: user?.id || 'user',
      senderName: user?.name || 'User',
      type: 'arrival_confirmed',
      text: `You've arrived at ${currentBooking.location?.mallName || 'the mall'}!\nMarked yourself as present at the meeting point.`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, arrivalMsg]);
    addToast('Marked as arrived at venue', 'success');
  };

  const formatCountdown = () => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`;
  };

  return (
    <div className="zorevi-chat-container">
      {/* Sidebar for Desktop: Conversations list */}
      <div className="zorevi-chat-sidebar">
        <div className="zorevi-chat-sidebar__header">
          <h3 className="zorevi-chat-sidebar__title">Booking Conversations</h3>
          <span className="zorevi-chat-sidebar__badge">Active Sessions</span>
        </div>

        <div className="zorevi-chat-convos-list">
          {mockBookings.map((b) => {
            const isSelected = b.id === currentBooking.id;
            const otherName = isCustomer ? b.designerName : b.customerName;
            const otherAvatar = isCustomer ? b.designerAvatar : b.customerAvatar;
            const closed = b.status === 'Completed' || b.status === 'Cancelled';

            return (
              <Link
                key={b.id}
                to={`/${role}/bookings/${b.id}/messages`}
                className={`zorevi-chat-convo-item ${isSelected ? 'active' : ''}`}
              >
                <ImageWithFallback
                  src={otherAvatar}
                  alt={otherName}
                  className="zorevi-chat-convo-avatar"
                  fallbackType={isCustomer ? 'designer' : 'avatar'}
                />
                <div className="zorevi-chat-convo-info">
                  <div className="zorevi-chat-convo-top">
                    <strong>{otherName}</strong>
                    <span className={`zorevi-chat-status-pill ${closed ? 'closed' : 'active'}`}>
                      {closed ? 'Closed' : 'Active'}
                    </span>
                  </div>
                  <span className="zorevi-chat-convo-service">{b.service}</span>
                  <small className="zorevi-chat-convo-date">{b.date} • {b.startTime}</small>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="zorevi-chat-main">
        {/* Chat Header */}
        <div className="zorevi-chat-header">
          <div className="zorevi-chat-header__partner">
            <Link to={`/${role}/bookings`} className="zorevi-chat-back-btn" title="Back to Bookings">
              <ChevronLeft size={20} />
            </Link>
            <div className="zorevi-chat-header__avatar-wrap">
              <ImageWithFallback
                src={partnerAvatar}
                alt={partnerName}
                className="zorevi-chat-header__avatar"
                fallbackType={isCustomer ? 'designer' : 'avatar'}
              />
              <span className="zorevi-chat-online-dot"></span>
            </div>
            <div>
              <div className="zorevi-chat-header__name-row">
                <h4>{partnerName}</h4>
                <CheckCircle2 size={16} color="#10B981" />
              </div>
              <span className="zorevi-chat-header__role">
                {isCustomer ? 'Your Fashion Stylist' : 'Customer'} • Online
              </span>
            </div>
          </div>

          <div className="zorevi-chat-header__actions">
            <button
              className="zorevi-chat-action-btn"
              title="Voice Call (Mock)"
              onClick={() => addToast('Voice calling feature is simulated in demo', 'info')}
            >
              <Phone size={18} />
            </button>
            <button
              className="zorevi-chat-action-btn"
              title="Video Session (Mock)"
              onClick={() => addToast('Secure video session is simulated in demo', 'info')}
            >
              <Video size={18} />
            </button>
            <button
              className="zorevi-chat-action-btn"
              title="Contact Support"
              onClick={() => setIsSupportModalOpen(true)}
            >
              <HelpCircle size={18} />
            </button>
          </div>
        </div>

        {/* Booking Summary Strip */}
        <div className="zorevi-chat-summary-strip">
          <div className="zorevi-chat-summary-pill">
            <CheckCircle2 size={15} color="#10B981" />
            <span>
              Booking #{currentBooking.id} • {currentBooking.service} • {currentBooking.date} at {currentBooking.startTime}
            </span>
          </div>

          {!isSessionClosed ? (
            <div className="zorevi-chat-countdown-pill">
              <Clock size={15} />
              <span>Session ends in: <strong>{formatCountdown()}</strong></span>
            </div>
          ) : (
            <div className="zorevi-chat-closed-pill">
              <Lock size={15} />
              <span>Session Closed (Read-Only)</span>
            </div>
          )}
        </div>

        {/* Location Meeting Bar */}
        {currentBooking.location?.mallName && !isSessionClosed && (
          <div className="zorevi-chat-location-quickbar">
            <div className="zorevi-chat-location-quickbar__info">
              <MapPin size={16} color="#7C3AED" />
              <span>
                Meeting Point: <strong>{currentBooking.location.mallName}</strong> – {currentBooking.location.meetingPoint || 'Ground Floor Main Atrium'}
              </span>
            </div>
            <div className="zorevi-chat-location-quickbar__actions">
              <button
                type="button"
                className="zorevi-chat-pill-btn"
                onClick={handleShareMeetingPoint}
              >
                Share Meeting Point
              </button>
              {!hasArrived && (
                <button
                  type="button"
                  className="zorevi-chat-pill-btn zorevi-chat-pill-btn--primary"
                  onClick={handleMarkArrival}
                >
                  I have Arrived
                </button>
              )}
            </div>
          </div>
        )}

        {/* Messages Stream */}
        <div className="zorevi-chat-stream">
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.id || (isCustomer && msg.senderId === 'cust-001') || (!isCustomer && msg.senderId === 'des-001');

            if (msg.type === 'system') {
              return (
                <div key={msg.id} className="zorevi-chat-system-msg">
                  <Lock size={14} />
                  <span>{msg.text}</span>
                </div>
              );
            }

            if (msg.type === 'location') {
              return (
                <div
                  key={msg.id}
                  className={`zorevi-chat-msg-row ${isMe ? 'zorevi-chat-msg-row--me' : 'zorevi-chat-msg-row--partner'}`}
                >
                  <div className="zorevi-chat-location-card">
                    <div className="zorevi-chat-location-card__header">
                      <MapPin size={18} color="#7C3AED" />
                      <div>
                        <strong>{msg.location.name}</strong>
                        <p>{msg.location.detail}</p>
                        <small>{msg.location.address}</small>
                      </div>
                    </div>
                    <div className="zorevi-chat-location-card__footer">
                      <span className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                        <Navigation size={13} /> View on Map
                      </span>
                      <span className="zorevi-btn zorevi-btn--primary zorevi-btn--sm">
                        Get Directions
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.type === 'arrival_confirmed') {
              return (
                <div key={msg.id} className="zorevi-chat-arrival-alert">
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>{msg.text}</span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`zorevi-chat-msg-row ${isMe ? 'zorevi-chat-msg-row--me' : 'zorevi-chat-msg-row--partner'}`}
              >
                <div className="zorevi-chat-bubble">
                  <p>{msg.text}</p>
                  <span className="zorevi-chat-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Closed chat notice or active composer */}
        {isSessionClosed ? (
          <div className="zorevi-chat-closed-footer">
            <Lock size={18} />
            <div>
              <strong>This styling session has ended</strong>
              <p>This conversation is now read-only. Need help with anything? <button className="inline-link" onClick={() => setIsSupportModalOpen(true)}>Contact Support</button></p>
            </div>
          </div>
        ) : (
          <form className="zorevi-chat-composer" onSubmit={handleSend}>
            <button
              type="button"
              className="zorevi-chat-tool-btn"
              title="Share Location"
              onClick={handleShareMeetingPoint}
            >
              <MapPin size={20} />
            </button>
            <input
              type="text"
              className="zorevi-chat-input"
              placeholder={`Type a message to ${partnerName}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="submit"
              className="zorevi-chat-send-btn"
              disabled={!inputText.trim()}
              title="Send Message"
            >
              <Send size={18} />
            </button>
          </form>
        )}
      </div>

      {/* Support Modal for Chat Disputes */}
      {isSupportModalOpen && (
        <div className="zorevi-modal-overlay" onClick={() => setIsSupportModalOpen(false)}>
          <div className="zorevi-modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="zorevi-modal-header">
              <h3>Contact Booking Support</h3>
              <button className="zorevi-modal-close" onClick={() => setIsSupportModalOpen(false)}>✕</button>
            </div>
            <div className="zorevi-modal-body">
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '16px' }}>
                Having an issue with meeting at the mall, delayed arrival, or dispute for Booking #{currentBooking.id}?
              </p>
              <div className="zorevi-form-group">
                <label className="zorevi-form-label">Issue Category</label>
                <select className="zorevi-input">
                  <option>Designer Late / No Show</option>
                  <option>Meeting Point Discrepancy</option>
                  <option>Request Session Extension</option>
                  <option>Re-open Closed Conversation</option>
                  <option>Billing / Payment Question</option>
                </select>
              </div>
              <div className="zorevi-form-group" style={{ marginTop: '12px' }}>
                <label className="zorevi-form-label">Message Support</label>
                <textarea className="zorevi-textarea" rows="3" placeholder="Describe the situation..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '18px' }}>
                <button className="zorevi-btn zorevi-btn--outline" onClick={() => setIsSupportModalOpen(false)}>
                  Cancel
                </button>
                <button
                  className="zorevi-btn zorevi-btn--primary"
                  onClick={() => {
                    setIsSupportModalOpen(false);
                    addToast('Support ticket submitted. Our concierge team will assist you within 15 minutes.', 'success');
                  }}
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

