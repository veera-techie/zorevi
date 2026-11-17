import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

const CustomerReviews = () => {
  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">My Given Reviews</h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">Reviews and feedback for completed designer sessions</p>
      </div>

      <div className="zorevi-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-[#1E1B2E]">Stylist: Aarohi Mehta</h3>
          <div className="flex items-center gap-1 text-[#F59E0B]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
            ))}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          "Aarohi helped me curate a breathtaking bridal trousseau in Hyderabad. 5/5 stars!"
        </p>
      </div>
    </div>
  );
};

export default CustomerReviews;
