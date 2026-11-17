import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

const ReviewCard = ({ review }) => {
  return (
    <div className="zorevi-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={review.customerAvatar || '/images/customer-mira.png'}
            alt={review.customerName}
            className="w-10 h-10 rounded-full object-cover border border-[#EAE4F5]"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80';
            }}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-semibold text-sm text-[#1E1B2E]">{review.customerName}</h4>
              {review.verified && (
                <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6]" title="Verified Booking" />
              )}
            </div>
            <p className="text-xs text-[#6B7280]">{review.serviceUsed || 'Bridal Styling'}</p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 bg-[#FEF3C7] px-2 py-0.5 rounded-full">
          <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
          <span className="text-xs font-bold text-[#92400E]">{review.rating || 5}.0</span>
        </div>
      </div>

      <p className="text-xs text-[#4B5563] mt-3 leading-relaxed">
        "{review.comment}"
      </p>

      <div className="mt-3 pt-2.5 border-t border-[#F3EEFB] flex items-center justify-between text-[11px] text-[#9CA3AF]">
        <span>{review.date || '2 days ago'}</span>
        {review.tag && (
          <span className="bg-[#F3EEFF] text-[#6B35D9] px-2 py-0.5 rounded-full font-medium">
            {review.tag}
          </span>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
