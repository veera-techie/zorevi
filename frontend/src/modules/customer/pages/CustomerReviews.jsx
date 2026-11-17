import { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { mockReviews, mockBookings } from '../../../services/mockData';
import { useApp } from '../../../context/AppContext';

export default function CustomerReviews() {
  const [reviewsList, setReviewsList] = useState(mockReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState('ZV-8399');
  const { addToast } = useApp();

  const handlePostReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast('Please write a short review before submitting', 'error');
      return;
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      bookingId: selectedBookingId,
      customerId: 'cust-001',
      designerId: 'des-004',
      customerName: 'Praveen Kumar',
      designerName: 'Diya Sharma',
      customerAvatar: '/images/customer-praveen.png',
      rating,
      comment: comment.trim(),
      date: 'Just now',
    };

    setReviewsList([newRev, ...reviewsList]);
    setComment('');
    addToast('Thank you! Your verified styling review has been published.', 'success');
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
          My Reviews & Ratings
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
          Manage your feedback on styling sessions and share experiences with the Zorevi community.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
        {/* Left Column: Eligible Review Form */}
        <div>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '6px' }}>
              Write a Review for an Eligible Session
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: '20px' }}>
              Only verified completed sessions are eligible for public ratings.
            </p>

            <form onSubmit={handlePostReview}>
              <div className="zorevi-auth-field">
                <label>Completed Session</label>
                <select
                  className="zorevi-input"
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                >
                  <option value="ZV-8399">#ZV-8399 • Styling Session with Diya Sharma (Completed 15 Nov)</option>
                  <option value="ZV-8398">#ZV-8398 • Bridal Styling with Sneha Kapoor (Completed 08 Nov)</option>
                </select>
              </div>

              <div className="zorevi-auth-field">
                <label>Overall Rating</label>
                <div style={{ display: 'flex', gap: '8px', padding: '8px 0' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transform: rating >= star ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      <Star
                        size={28}
                        fill={rating >= star ? '#F59E0B' : 'none'}
                        color={rating >= star ? '#F59E0B' : '#D1D5DB'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="zorevi-auth-field">
                <label>Your Review & Feedback</label>
                <textarea
                  className="zorevi-textarea"
                  rows="4"
                  placeholder="How was your styling consultation? Did you find great outfits at the mall? Share specifics..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="zorevi-btn zorevi-btn--primary zorevi-btn--full">
                Publish Verified Review <Send size={15} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Previous Reviews */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '16px' }}>
            Previous Reviews ({reviewsList.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #F3F4F6',
                  padding: '20px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#1E1B4B' }}>{rev.designerName}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Booking #{rev.bookingId} • {rev.date}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5', margin: '8px 0 0', fontStyle: 'italic' }}>
                  "{rev.comment}"
                </p>

                {rev.designerResponse && (
                  <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '12px', background: '#FAF5FF', borderLeft: '3px solid #7C3AED' }}>
                    <strong style={{ fontSize: '0.78rem', color: '#7C3AED', display: 'block', marginBottom: '2px' }}>
                      Response from Stylist:
                    </strong>
                    <p style={{ fontSize: '0.8rem', color: '#4B5563', margin: 0 }}>
                      {rev.designerResponse}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

