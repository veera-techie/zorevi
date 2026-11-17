import React from 'react';
import { MapPin, ShoppingBag, ArrowRight } from 'lucide-react';

const MallCard = ({ mall }) => {
  return (
    <div className="zorevi-card overflow-hidden hover:-translate-y-1 transition duration-200">
      <div className="h-36 bg-[#EAE4F5] relative overflow-hidden">
        <img
          src={mall.image || 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=500&q=80'}
          alt={mall.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#6B35D9]">
          {mall.designersCount || 12} Stylists Available
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-[#1E1B2E] text-sm">{mall.name}</h4>
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mt-1">
          <MapPin className="w-3.5 h-3.5 text-[#6B35D9]" />
          <span>{mall.location}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#F3EEFB]">
          <span className="text-[#6B7280] flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{mall.storesCount || '80+'} Fashion Boutiques</span>
          </span>
          <button className="text-[#6B35D9] font-semibold flex items-center gap-1 hover:underline">
            Explore <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MallCard;
