import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import DesignerCard from '../../../components/cards/DesignerCard';
import { DESIGNER_PROFILE } from '../../../constants';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">Saved Stylists & Moodboards</h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">Your bookmarked fashion designers and couture outfits</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <DesignerCard
          designer={DESIGNER_PROFILE}
          onSelect={() => navigate('/customer/designer-details')}
        />
      </div>
    </div>
  );
};

export default Wishlist;
