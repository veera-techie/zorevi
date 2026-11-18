import { useState } from 'react';
import {
  Inbox, Check, X, Clock, MapPin, Calendar, Sparkles,
  DollarSign, MessageSquare, ArrowRight
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import { useApp } from '../../../context/AppContext';

export default function DesignerBookingRequests() {
  const { addToast } = useApp();

  const [requests, setRequests] = useState([
    {
      id: 'req-101',
      customer: 'Priya Nair',
      service: 'Bridal Styling',
      date: '25 Nov 2025',
      time: '10:00 AM',
      duration: '3 hours',
      location: 'Lakeside Fashion Mall, Hyderabad',
      notes: 'Need full bridal look coordination for reception and sangeet.',
      amount: 4500,
      avatar: '/images/customer-neha.jpg',
    },
    {
      id: 'req-102',
      customer: 'Aditya Rao',
      service: 'Wardrobe Consultation',
      date: '23 Nov 2025',
      time: '02:00 PM',
      duration: '2 hours',
      location: 'Nexus Central Mall, Hyderabad',
      notes: 'Looking for sharp business casuals and ethnic party kurtas.',
      amount: 1200,
      avatar: '/images/customer-karan.jpg',
    },
    {
      id: 'req-103',
      customer: 'The Mehta Family',
      service: 'Family Styling',
      date: '24 Nov 2025',
      time: '11:00 AM',
      duration: '4 hours',
      location: 'Forum Square Mall, Hyderabad',
      notes: 'Family of 4 needing coordinated festive looks for anniversary.',
      amount: 3800,
      avatar: '/images/customer-pooja.jpg',
    },
  ]);

  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [counterTime, setCounterTime] = useState('04:00 PM');
  const [counterPrice, setCounterPrice] = useState('');
  const [counterNote, setCounterNote] = useState('');

  const handleAccept = (req) => {
    setRequests(requests.filter((r) => r.id !== req.id));
    addToast(`Accepted booking request from ${req.customer}! Added to your schedule.`, 'success');
  };

  const handleDecline = (req) => {
    setRequests(requests.filter((r) => r.id !== req.id));
    addToast(`Declined booking request from ${req.customer}`, 'info');
  };

  const handleOpenCounter = (req) => {
    setSelectedReq(req);
    setCounterPrice(String(req.amount));
    setCounterModalOpen(true);
  };

  const handleSendCounter = (e) => {
    e.preventDefault();
    if (!selectedReq) return;
    setRequests(requests.filter((r) => r.id !== selectedReq.id));
    setCounterModalOpen(false);
    addToast(`Counteroffer sent to ${selectedReq.customer} (${counterTime}, ₹${counterPrice})`, 'success');
  };

  return (
    <div style={{ width: '100%', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
          Booking Requests
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
          Review incoming styling inquiries, accept requests, or propose counteroffers.
        </p>
      </div>

      {requests.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {requests.map((req) => (
            <div
              key={req.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #F3F4F6',
                padding: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '24px',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <img src={req.avatar} alt={req.customer} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1E1B4B', margin: 0 }}>
                      {req.customer}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#7C3AED', fontWeight: '600' }}>{req.service}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: '#4B5563', margin: '12px 0' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={14} color="#7C3AED" /> {req.date} at {req.time}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} color="#7C3AED" /> Duration: {req.duration}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} color="#7C3AED" /> {req.location}
                  </span>
                </div>

                <div style={{ background: '#FAF5FF', border: '1px solid #DDD6FE', borderRadius: '12px', padding: '10px 14px', fontSize: '0.82rem', color: '#374151' }}>
                  <strong>Client Note:</strong> "{req.notes}"
                </div>
              </div>

              {/* Actions & Price */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', minWidth: '180px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase' }}>Client Budget / Quote</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#7C3AED' }}>₹{req.amount}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button
                    className="zorevi-btn zorevi-btn--primary zorevi-btn--sm"
                    style={{ flex: 1 }}
                    onClick={() => handleAccept(req)}
                  >
                    <Check size={14} /> Accept
                  </button>
                  <button
                    className="zorevi-btn zorevi-btn--outline zorevi-btn--sm"
                    style={{ flex: 1 }}
                    onClick={() => handleDecline(req)}
                  >
                    <X size={14} /> Decline
                  </button>
                </div>

                <button
                  className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm zorevi-btn--full"
                  onClick={() => handleOpenCounter(req)}
                >
                  Propose Counteroffer
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '20px', border: '1px dashed #DDD6FE' }}>
          <Inbox size={40} color="#7C3AED" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#1E1B4B', marginBottom: '6px' }}>All caught up!</h3>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            No pending booking requests at this time. New inquiries will appear here automatically.
          </p>
        </div>
      )}

      {/* Counteroffer Modal */}
      {counterModalOpen && (
        <Modal
          isOpen={counterModalOpen}
          onClose={() => setCounterModalOpen(false)}
          title={`Propose Counteroffer to ${selectedReq?.customer}`}
          maxWidth="500px"
        >
          <form onSubmit={handleSendCounter}>
            <p style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: '16px' }}>
              Suggest an alternate time slot, adjusted duration, or custom quotation price.
            </p>

            <div className="zorevi-auth-field">
              <label>Alternate Time Slot</label>
              <input
                type="text"
                className="zorevi-input"
                value={counterTime}
                onChange={(e) => setCounterTime(e.target.value)}
                placeholder="e.g. 04:00 PM (25 Nov)"
                required
              />
            </div>

            <div className="zorevi-auth-field">
              <label>Proposed Fee (₹)</label>
              <input
                type="number"
                className="zorevi-input"
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
                required
              />
            </div>

            <div className="zorevi-auth-field">
              <label>Note to Customer</label>
              <textarea
                className="zorevi-textarea"
                rows="3"
                placeholder="Explain the time shift or custom quote scope..."
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
              <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={() => setCounterModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="zorevi-btn zorevi-btn--primary">
                Send Counteroffer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

