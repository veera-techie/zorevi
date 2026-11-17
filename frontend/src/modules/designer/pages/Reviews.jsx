import React, { useState } from 'react';
import { Star, MessageSquare, ShieldCheck, ThumbsUp, Send } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const Reviews = () => {
  const { profile, showToast } = useApp();
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      customerName: 'Pooja Reddy',
      customerAvatar: '/images/customer-mira.png',
      rating: 5,
      date: '2 days ago',
      serviceUsed: 'Bridal Styling Consultation',
      comment:
        'Aarohi is an absolute gem! She helped me choose my sangeet and reception lehengas in Jubilee Hills boutiques. Her eye for color matching with Indian skin tones is unmatched. Everyone complimented my outfit!',
      verified: true,
      helpfulCount: 14,
      reply: 'Thank you so much Pooja! You looked like royalty in that emerald green lehenga.',
    },
    {
      id: 2,
      customerName: 'Sanjay & Sunita Rao',
      customerAvatar: '/images/customer-rohan.png',
      rating: 5,
      date: '1 week ago',
      serviceUsed: 'Family Festive Ensemble',
      comment:
        'We booked Aarohi for family styling for our daughter’s wedding. She coordinated outfits for all 6 of us without feeling identical. Seamless experience!',
      verified: true,
      helpfulCount: 9,
      reply: null,
    },
    {
      id: 3,
      customerName: 'Rohan Shah',
      customerAvatar: '/images/customer-rohan.png',
      rating: 5,
      date: '2 weeks ago',
      serviceUsed: 'Wardrobe Consultation',
      comment:
        'Outstanding guidance on modern Indo-Western silhouettes. Aarohi helped me clear out 40% of useless suits and pick high-quality statement pieces.',
      verified: true,
      helpfulCount: 6,
      reply: 'Honored to assist your wardrobe transition Rohan! Glad the curated pieces suit you so well.',
    },
    {
      id: 4,
      customerName: 'Dr. Kavita Verma',
      customerAvatar: '/images/customer-iyer.png',
      rating: 4,
      date: '3 weeks ago',
      serviceUsed: 'Saree Draping & Trousseau',
      comment:
        'Great advice on traditional Kanjeevaram weaves. Very punctual and attentive to what I wanted.',
      verified: true,
      helpfulCount: 4,
      reply: null,
    },
  ]);

  const handleSendReply = (reviewId) => {
    if (!replyText.trim()) return;
    setReviewsList((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, reply: replyText } : r))
    );
    setReplyingTo(null);
    setReplyText('');
    showToast('Reply published to client review!');
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">
          Customer Reviews & Ratings
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Real feedback from styling sessions conducted across Hyderabad
        </p>
      </div>

      {/* Rating Overview Card */}
      <div className="zorevi-card p-6 bg-white grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="text-center md:text-left md:border-r border-[#EAE4F5] md:pr-6">
          <span className="text-4xl sm:text-5xl font-extrabold text-[#1E1B2E]">
            {profile.rating}
          </span>
          <span className="text-sm text-[#6B7280] block mt-1">out of 5 stars</span>
          <div className="flex items-center justify-center md:justify-start gap-1 my-2 text-[#F59E0B]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
            ))}
          </div>
          <span className="text-xs font-semibold text-[#6B35D9]">
            Based on {profile.reviewCount} verified reviews
          </span>
        </div>

        {/* Breakdown bars */}
        <div className="md:col-span-2 space-y-2">
          {[
            { stars: '5 Stars', pct: 92, count: 79 },
            { stars: '4 Stars', pct: 8, count: 7 },
            { stars: '3 Stars', pct: 0, count: 0 },
            { stars: '2 Stars', pct: 0, count: 0 },
            { stars: '1 Star', pct: 0, count: 0 },
          ].map((b) => (
            <div key={b.stars} className="flex items-center gap-3 text-xs">
              <span className="w-16 font-medium text-[#6B7280] text-right">{b.stars}</span>
              <div className="flex-1 h-2 rounded-full bg-[#EDE8F8] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#F59E0B]"
                  style={{ width: `${b.pct}%` }}
                />
              </div>
              <span className="w-8 font-bold text-[#1E1B2E] text-right">{b.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewsList.map((rev) => (
          <div key={rev.id} className="zorevi-card p-5 bg-white space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={rev.customerAvatar}
                  alt={rev.customerName}
                  className="w-10 h-10 rounded-full object-cover border border-[#EAE4F5]"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80';
                  }}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-[#1E1B2E]">{rev.customerName}</h4>
                    {rev.verified && (
                      <span className="text-[10px] bg-[#ECFDF5] text-[#065F46] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified Client
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#6B7280]">{rev.serviceUsed} · {rev.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#F59E0B] bg-[#FEF3C7] px-2.5 py-1 rounded-full text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                <span>{rev.rating}.0</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              "{rev.comment}"
            </p>

            {/* Designer Reply if present */}
            {rev.reply && (
              <div className="mt-3 p-3.5 rounded-2xl bg-[#F6F3FB] border border-[#EAE4F5] text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#6B35D9] mb-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Response from Aarohi Mehta (Designer):</span>
                </div>
                <p className="text-[#4B5563]">{rev.reply}</p>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between text-xs text-[#6B7280]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Marked as helpful')}
                  className="flex items-center gap-1 hover:text-[#6B35D9] transition"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
              </div>

              {!rev.reply && replyingTo !== rev.id && (
                <button
                  onClick={() => setReplyingTo(rev.id)}
                  className="font-semibold text-[#6B35D9] hover:underline"
                >
                  Reply to Customer
                </button>
              )}
            </div>

            {/* Inline reply editor */}
            {replyingTo === rev.id && (
              <div className="mt-3 pt-3 border-t border-[#F3EEFB] flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your public response..."
                  className="flex-1 text-xs bg-white border border-[#EAE4F5] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B35D9]/20"
                />
                <button
                  onClick={() => handleSendReply(rev.id)}
                  className="px-3.5 py-2 rounded-xl bg-[#6B35D9] text-white text-xs font-bold hover:bg-[#5B29C5] flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="px-3 py-2 rounded-xl text-xs text-[#6B7280] hover:bg-[#F3EEFB]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
