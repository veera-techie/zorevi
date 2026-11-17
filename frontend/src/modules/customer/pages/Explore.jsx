import React, { useState } from 'react';
import { Search, MapPin, Star, Filter, ArrowRight } from 'lucide-react';
import DesignerCard from '../../../components/cards/DesignerCard';
import MallCard from '../../../components/cards/MallCard';
import { DESIGNER_PROFILE } from '../../../constants';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

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
      portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=90',
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
      portrait: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=90',
      specializations: ['South Indian Bridal', 'Handlooms', 'Temple Jewelry'],
    },
  ];

  const malls = [
    {
      id: 1,
      name: 'Sarath City Capital Mall',
      location: 'Gachibowli, Hyderabad',
      designersCount: 18,
      storesCount: '120+',
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 2,
      name: 'Inorbit Mall Cyberabad',
      location: 'Madhapur, Hyderabad',
      designersCount: 14,
      storesCount: '90+',
      image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=500&q=80',
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Banner */}
      <div className="zorevi-card p-6 sm:p-8 bg-gradient-to-r from-[#EDE6FC] to-[#F5EEFD] border border-[#E4D9F5]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B2E]">
          Find Personal Stylists & Malls in Hyderabad
        </h1>
        <p className="text-sm text-[#6B7280] mt-1 max-w-xl">
          Book verified bridal consultants, wedding trousseau designers, and personal shoppers starting at just ₹499 for 2 hours.
        </p>
      </div>

      {/* Stylists Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1E1B2E]">Top Rated Stylists Near You</h2>
            <p className="text-xs text-[#6B7280]">Verified couturiers ready for in-person consultations</p>
          </div>
          <button
            onClick={() => navigate('/customer/nearby-designers')}
            className="text-xs font-bold text-[#6B35D9] hover:underline flex items-center gap-1"
          >
            <span>See all stylists</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
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

      {/* Malls Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1E1B2E]">Explore Fashion Hubs & Malls</h2>
            <p className="text-xs text-[#6B7280]">Meet your stylist directly at partner malls</p>
          </div>
          <button
            onClick={() => navigate('/customer/nearby-malls')}
            className="text-xs font-bold text-[#6B35D9] hover:underline flex items-center gap-1"
          >
            <span>See all malls</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {malls.map((m) => (
            <MallCard key={m.id} mall={m} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
