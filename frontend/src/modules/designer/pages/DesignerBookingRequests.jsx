import { useState } from 'react';
import {
  Inbox, Check, X, Clock, MapPin, Calendar, Sparkles,
  DollarSign, MessageSquare, ArrowRight, Eye, ShieldCheck,
  User, Image as ImageIcon, CheckCircle2, AlertCircle
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import { useApp } from '../../../context/AppContext';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import { formatDate, formatDateTime, normalizeBookingStatusKey } from '../../../utils';

export default function DesignerBookingRequests() {
  const { bookings, acceptBookingRequest, rejectBookingRequest, proposeAlternativeSlot, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'all'
  const [selectedReqForDetails, setSelectedReqForDetails] = useState(null);
  const [selectedReqForCounter, setSelectedReqForCounter] = useState(null);
  const [selectedReqForReject, setSelectedReqForReject] = useState(null);

  // Counter proposal fields
  const [counterDate, setCounterDate] = useState('2025-11-26');
  const [counterTime, setCounterTime] = useState('02:00 PM');
  const [counterNote, setCounterNote] = useState('I am fully booked during your requested time, but this alternative slot is open for our session.');

  // Reject fields
  const [rejectReason, setRejectReason] = useState('Schedule fully booked during this time');

  // Bookings that are requests
  const pendingRequests = (bookings || []).filter((b) => {
    const key = normalizeBookingStatusKey(b.status);
    return key === 'pending' || key === 'alternative';
  });

  const allRequests = (bookings || []).filter((b) => {
    const key = normalizeBookingStatusKey(b.status);
    return key === 'pending' || key === 'alternative' || key === 'rejected' || key === 'accepted';
  });

  const displayRequests = activeTab === 'pending' ? pendingRequests : allRequests;

  const handleAccept = (req) => {
    acceptBookingRequest(req.id);
  };

  const handleOpenReject = (req) => {
    setSelectedReqForReject(req);
  };

  const handleConfirmReject = () => {
    if (!selectedReqForReject) return;
    rejectBookingRequest(selectedReqForReject.id, rejectReason);
    setSelectedReqForReject(null);
  };

  const handleOpenCounter = (req) => {
    setSelectedReqForCounter(req);
    setCounterDate(req.date || '2025-11-26');
  };

  const handleSendCounter = (e) => {
    e.preventDefault();
    if (!selectedReqForCounter) return;
    proposeAlternativeSlot(selectedReqForCounter.id, counterDate, counterTime, counterNote);
    setSelectedReqForCounter(null);
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '850', color: '#1E1B4B', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          Customer Booking Requests
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#6B7280', margin: 0 }}>
          Review incoming styling inquiries, validate your calendar availability, accept requests to unlock the 30% advance payment, or propose alternative slots.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '8px 18px',
            borderRadius: '9999px',
            border: activeTab === 'pending' ? '1px solid #7C3AED' : '1px solid #E5E7EB',
            background: activeTab === 'pending' ? '#7C3AED' : '#FFFFFF',
            color: activeTab === 'pending' ? '#FFFFFF' : '#4B5563',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: activeTab === 'pending' ? '0 4px 12px rgba(124, 58, 237, 0.22)' : 'none',
          }}
        >
          <span>Pending Inquiries</span>
          {pendingRequests.length > 0 && (
            <span style={{ background: activeTab === 'pending' ? 'rgba(255,255,255,0.25)' : '#FEF3C7', color: activeTab === 'pending' ? '#FFFFFF' : '#B45309', padding: '1px 7px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '700' }}>
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '8px 18px',
            borderRadius: '9999px',
            border: activeTab === 'all' ? '1px solid #7C3AED' : '1px solid #E5E7EB',
            background: activeTab === 'all' ? '#7C3AED' : '#FFFFFF',
            color: activeTab === 'all' ? '#FFFFFF' : '#4B5563',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>All Requests History</span>
          <span style={{ background: '#F3F4F6', color: '#6B7280', padding: '1px 7px', borderRadius: '9999px', fontSize: '0.72rem' }}>
            {allRequests.length}
          </span>
        </button>
      </div>

      {/* Requests List */}
      {displayRequests.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {displayRequests.map((req) => {
            const reqKey = normalizeBookingStatusKey(req.status);
            const isPending = reqKey === 'pending';
            const isAwaitingPay = reqKey === 'accepted';
            const fee = Number(req.designerFee || req.amount || 999);
            const advance = Math.round(fee * 0.3);

            return (
              <div
                key={req.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  border: isPending ? '1.5px solid #FDE68A' : '1px solid #EDE9FE',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                }}
              >
                {/* Header row: Customer identity & Status badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <ImageWithFallback
                      src={req.customerAvatar || '/images/customer-praveen.png'}
                      alt={req.customerName}
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #DDD6FE' }}
                      fallbackType="avatar"
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '1.15rem', color: '#1E1B4B' }}>{req.customerName || 'Praveen Kumar'}</strong>
                        <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>#{req.id}</span>
                      </div>
                      <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                        {req.customerEmail || 'customer@zorevi.com'} • {req.customerPhone || '+91 98765 43210'}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.76rem', color: '#9CA3AF', marginTop: '2px' }}>
                        Submitted: {formatDateTime(req.createdAt || req.submittedAt)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        background: isPending ? '#FEF3C7' : (isAwaitingPay ? '#ECFDF5' : '#F3F4F6'),
                        color: isPending ? '#B45309' : (isAwaitingPay ? '#047857' : '#4B5563'),
                        border: `1px solid ${isPending ? '#FDE68A' : (isAwaitingPay ? '#6EE7B7' : '#E5E7EB')}`,
                      }}
                    >
                      {req.status}
                    </span>
                    <strong style={{ fontSize: '1.25rem', color: '#7C3AED' }}>₹{fee}</strong>
                  </div>
                </div>

                {/* Request Requirements Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '14px',
                    padding: '16px',
                    background: '#F9FAFB',
                    borderRadius: '16px',
                    border: '1px solid #F3F4F6',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Occasion & Category
                    </span>
                    <strong style={{ color: '#1E1B4B' }}>{req.occasion || 'Wedding'}</strong>
                    <span style={{ color: '#6B7280' }}> ({req.category || 'Women'})</span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Requested Schedule
                    </span>
                    <strong style={{ color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} color="#7C3AED" /> {formatDate(req.date, req.date)} at {req.time || req.startTime}
                    </strong>
                    <span style={{ color: '#6B7280', fontSize: '0.78rem' }}>
                      {req.meetingLocation || req.location?.mallName || 'Lakeside Fashion Mall'}
                    </span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Customer Shopping Budget
                    </span>
                    <strong style={{ color: '#1E1B4B' }}>{req.shoppingBudget || 'Up to ₹20,000'}</strong>
                    <span style={{ color: '#6B7280', fontSize: '0.75rem', display: 'block' }}>Outfit purchase fund</span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      30% Advance Due on Acceptance
                    </span>
                    <strong style={{ color: '#059669', fontSize: '1.05rem' }}>₹{advance}</strong>
                    <span style={{ color: '#6B7280', fontSize: '0.75rem', display: 'block' }}>Unlocks immediately upon accept</span>
                  </div>
                </div>

                {/* Customer instructions / preferences excerpt */}
                <div style={{ fontSize: '0.85rem', color: '#4B5563', background: '#FAF5FF', padding: '12px 16px', borderRadius: '12px', border: '1px solid #EDE9FE' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#7C3AED', marginBottom: '4px', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <Sparkles size={13} /> Customer Requirements & Style Preferences
                  </div>
                  <div>
                    <strong>Aesthetic:</strong> {req.clothingPreference || 'Indo-Western / Contemporary'} • <strong>Colors:</strong> {req.preferredColors || 'Jewel Tones'}
                  </div>
                  {req.requirements || req.notes ? (
                    <p style={{ margin: '4px 0 0 0', color: '#4B5563', fontStyle: 'italic' }}>
                      "{req.requirements || req.notes}"
                    </p>
                  ) : null}
                </div>

                {/* Action Buttons Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #F3F4F6', flexWrap: 'wrap', gap: '10px' }}>
                  <button
                    type="button"
                    className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm"
                    onClick={() => setSelectedReqForDetails(req)}
                  >
                    <Eye size={14} /> View Full Details
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm"
                          style={{ color: '#DC2626' }}
                          onClick={() => handleOpenReject(req)}
                        >
                          <X size={14} /> Decline
                        </button>

                        <button
                          type="button"
                          className="zorevi-btn zorevi-btn--outline zorevi-btn--sm"
                          onClick={() => handleOpenCounter(req)}
                        >
                          <Clock size={14} /> Propose Alternative Slot
                        </button>

                        <button
                          type="button"
                          className="zorevi-btn zorevi-btn--primary zorevi-btn--sm"
                          style={{ background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
                          onClick={() => handleAccept(req)}
                        >
                          <Check size={14} strokeWidth={3} />
                          <span>Accept Request</span>
                        </button>
                      </>
                    ) : isAwaitingPay ? (
                      <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} /> Accepted • Customer notified to pay ₹{advance} advance
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                        Processed as {req.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px dashed #DDD6FE', padding: '60px 24px', textAlign: 'center' }}>
          <Inbox size={44} color="#7C3AED" style={{ marginBottom: '14px', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.25rem', color: '#1E1B4B', margin: '0 0 6px 0' }}>No pending booking requests</h3>
          <p style={{ fontSize: '0.88rem', color: '#6B7280', margin: 0 }}>
            You're all caught up! New customer inquiries will appear here automatically.
          </p>
        </div>
      )}

      {/* Propose Alternative Modal */}
      {selectedReqForCounter && (
        <Modal
          isOpen={Boolean(selectedReqForCounter)}
          onClose={() => setSelectedReqForCounter(null)}
          title={`Propose Alternative Slot for ${selectedReqForCounter.customerName}`}
          maxWidth="520px"
        >
          <form onSubmit={handleSendCounter} style={{ padding: '8px 4px 16px' }}>
            <p style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: '16px' }}>
              Suggest another date and time slot that fits your schedule. The customer will be prompted to accept this slot.
            </p>

            <div className="zorevi-form-group">
              <label className="zorevi-form-label">Alternative Date</label>
              <input
                type="date"
                className="zorevi-input"
                value={counterDate}
                onChange={(e) => setCounterDate(e.target.value)}
                required
              />
            </div>

            <div className="zorevi-form-group" style={{ marginTop: '14px' }}>
              <label className="zorevi-form-label">Alternative Time Slot</label>
              <select
                className="zorevi-input"
                value={counterTime}
                onChange={(e) => setCounterTime(e.target.value)}
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="06:00 PM">06:00 PM</option>
              </select>
            </div>

            <div className="zorevi-form-group" style={{ marginTop: '14px' }}>
              <label className="zorevi-form-label">Note to Customer</label>
              <textarea
                className="zorevi-textarea"
                rows={3}
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                placeholder="Explain why this alternative time is suggested..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
              <button type="button" className="zorevi-btn zorevi-btn--ghost" onClick={() => setSelectedReqForCounter(null)}>
                Cancel
              </button>
              <button type="submit" className="zorevi-btn zorevi-btn--primary">
                Send Alternative Slot
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reject Modal */}
      {selectedReqForReject && (
        <Modal
          isOpen={Boolean(selectedReqForReject)}
          onClose={() => setSelectedReqForReject(null)}
          title={`Decline Request #${selectedReqForReject.id}`}
          maxWidth="480px"
        >
          <div style={{ padding: '8px 4px 16px' }}>
            <p style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: '16px' }}>
              Are you sure you want to decline this request from {selectedReqForReject.customerName}?
            </p>

            <div className="zorevi-form-group">
              <label className="zorevi-form-label">Reason for Declining</label>
              <select
                className="zorevi-select"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              >
                <option value="Schedule fully booked during this time">Schedule fully booked during this time</option>
                <option value="Outside my styling specialty">Outside my styling specialty</option>
                <option value="Location out of service radius">Location out of service radius</option>
                <option value="Short notice / unable to accommodate">Short notice / unable to accommodate</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
              <button className="zorevi-btn zorevi-btn--ghost" onClick={() => setSelectedReqForReject(null)}>
                Keep
              </button>
              <button className="zorevi-btn zorevi-btn--primary" style={{ background: '#DC2626' }} onClick={handleConfirmReject}>
                Confirm Decline
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Full Details Modal */}
      {selectedReqForDetails && (
        <Modal
          isOpen={Boolean(selectedReqForDetails)}
          onClose={() => setSelectedReqForDetails(null)}
          title={`Request Details #${selectedReqForDetails.id}`}
          maxWidth="640px"
        >
          <div style={{ padding: '8px 4px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
              <ImageWithFallback
                src={selectedReqForDetails.customerAvatar || '/images/customer-praveen.png'}
                alt={selectedReqForDetails.customerName}
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                fallbackType="avatar"
              />
              <div>
                <strong style={{ fontSize: '1.2rem', color: '#1E1B4B' }}>{selectedReqForDetails.customerName}</strong>
                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                  {selectedReqForDetails.customerEmail} • {selectedReqForDetails.customerPhone}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.88rem', marginBottom: '18px' }}>
              <div>
                <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Occasion & Category</span>
                <strong style={{ color: '#1E1B4B' }}>{selectedReqForDetails.occasion} ({selectedReqForDetails.category})</strong>
              </div>
              <div>
                <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Requested Schedule</span>
                <strong style={{ color: '#1E1B4B' }}>{selectedReqForDetails.date} at {selectedReqForDetails.time || selectedReqForDetails.startTime}</strong>
              </div>
              <div>
                <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Customer Shopping Budget</span>
                <strong style={{ color: '#1E1B4B' }}>{selectedReqForDetails.shoppingBudget || 'Up to ₹20,000'}</strong>
              </div>
              <div>
                <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Your Designer Service Fee</span>
                <strong style={{ color: '#7C3AED' }}>₹{selectedReqForDetails.designerFee || 999}</strong>
              </div>
            </div>

            <div style={{ background: '#FAF5FF', padding: '14px', borderRadius: '14px', border: '1px solid #EDE9FE', marginBottom: '18px' }}>
              <strong style={{ fontSize: '0.85rem', color: '#7C3AED', display: 'block', marginBottom: 4 }}>
                Customer Requirements & Instructions:
              </strong>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.5 }}>
                {selectedReqForDetails.requirements || selectedReqForDetails.notes || 'Full personalized styling advice matching current seasonal aesthetics.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="zorevi-btn zorevi-btn--outline" onClick={() => setSelectedReqForDetails(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
