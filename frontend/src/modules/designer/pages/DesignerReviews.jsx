import { useState } from 'react';
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { mockReviews } from '../../../services/mockData';
import { useApp } from '../../../context/AppContext';

export default function DesignerReviews() {
  const [reviews, setReviews] = useState(mockReviews);
  const [replyText, setReplyText] = useState({});
  const { addToast } = useApp();

  const handleSendReply = (reviewId) => {
    const text = replyText[reviewId];
    if (!text || !text.trim()) return;

    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, designerResponse: text.trim() } : r))
    );
    setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
    addToast('Response published to client review!', 'success');
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', width: '100%', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
          Customer Reviews & Testimonials
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
          Read customer reviews from your styling sessions and reply directly to maintain client relationships.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {reviews.map((rev) => (
          <div
            key={rev.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #F3F4F6',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={rev.customerAvatar} alt={rev.customerName} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#1E1B4B' }}>{rev.customerName}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Booking #{rev.bookingId} • {rev.date}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.5', margin: '12px 0', fontStyle: 'italic' }}>
              "{rev.comment}"
            </p>

            {rev.designerResponse ? (
              <div style={{ marginTop: '16px', padding: '14px', borderRadius: '14px', background: '#FAF5FF', borderLeft: '4px solid #7C3AED' }}>
                <strong style={{ fontSize: '0.82rem', color: '#7C3AED', display: 'block', marginBottom: '4px' }}>
                  Your Response:
                </strong>
                <p style={{ fontSize: '0.82rem', color: '#4B5563', margin: 0 }}>
                  {rev.designerResponse}
                </p>
              </div>
            ) : (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>
                  Reply to {rev.customerName}
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    className="zorevi-input"
                    placeholder="Thank the client or share a styling tip..."
                    value={replyText[rev.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                  />
                  <button
                    className="zorevi-btn zorevi-btn--primary"
                    onClick={() => handleSendReply(rev.id)}
                  >
                    Reply <Send size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

