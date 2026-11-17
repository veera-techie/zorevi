import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 5, totalStars = 5, size = 'w-3.5 h-3.5' }) => {
  return (
    <div className="flex items-center gap-0.5 text-[#F59E0B]">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          className={`${size} ${
            i < Math.floor(rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
