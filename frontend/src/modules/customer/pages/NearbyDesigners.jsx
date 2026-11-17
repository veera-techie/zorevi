import React from 'react';
import DesignerCard from '../../../components/cards/DesignerCard';
import { DESIGNER_PROFILE } from '../../../constants';
import { useNavigate } from 'react-router-dom';

const NearbyDesigners = () => {
  const navigate = useNavigate();

  const stylists = [
    DESIGNER_PROFILE,
    {
      id: 'des_002',
      name: 'Vikramaditya Roy',
      title: 'Royal Menswear & Sherwani Specialist',
      location: 'Banjara Hills, Hyderabad',
      experience: '8 years experience',
      rating: 4.8,
      reviewCount: 64,
      verified: true,
      startingPrice: 799,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      specializations: ['Groom Styling', 'Indo-Western', 'Bandhgala'],
    },
    {
      id: 'des_003',
      name: 'Meera Nambiar',
      title: 'Traditional Handloom & Kanjeevaram Curator',
      location: 'Gachibowli, Hyderabad',
      experience: '5 years experience',
      rating: 4.9,
      reviewCount: 42,
      verified: true,
      startingPrice: 599,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      portrait: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      specializations: ['South Indian Bridal', 'Handlooms', 'Temple Jewelry'],
    },
    {
      id: 'des_004',
      name: 'Tanvi Khanna',
      title: 'Contemporary Western & Capsule Wardrobe Stylist',
      location: 'Madhapur, Hyderabad',
      experience: '4 years experience',
      rating: 4.7,
      reviewCount: 38,
      verified: true,
      startingPrice: 499,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      specializations: ['Corporate Styling', 'Casual Chic', 'Minimalist'],
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">Nearby Fashion Designers & Stylists</h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Available couturiers within your 15 km Hyderabad radius
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stylists.map((d) => (
          <DesignerCard
            key={d.id}
            designer={d}
            onSelect={() => navigate('/customer/designer-details')}
          />
        ))}
      </div>
    </div>
  );
};

export default NearbyDesigners;
