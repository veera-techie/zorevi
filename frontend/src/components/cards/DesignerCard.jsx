import React from 'react';
import { Star, MapPin, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const DesignerCard = ({ designer, onSelect }) => {
  return (
    <div className="zorevi-card overflow-hidden group hover:-translate-y-1 transition-all duration-200">
      <div className="relative h-44 bg-gradient-to-tr from-[#EAE4F5] to-[#F6F3FB] overflow-hidden">
        <img
          src={designer.portrait || designer.avatar}
          alt={designer.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
          }}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-[#1E1B2E] flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          <span>{designer.rating}</span>
          <span className="text-[#6B7280] font-normal">({designer.reviewCount})</span>
        </div>
        {designer.verified && (
          <div className="absolute bottom-3 left-3 bg-[#6B35D9] text-white px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-purple-glow">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Stylist</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-base text-[#1E1B2E]">{designer.name}</h3>
        <p className="text-xs text-[#6B7280] mt-0.5">{designer.title}</p>

        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#6B7280]">
          <MapPin className="w-3.5 h-3.5 text-[#6B35D9]" />
          <span>{designer.location}</span>
          <span>·</span>
          <span>{designer.experience}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {designer.specializations?.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F3EEFF] text-[#6B35D9]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-[#F3EEFB] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#6B7280] block">Starting from</span>
            <span className="text-sm font-bold text-[#1E1B2E]">
              {formatCurrency(designer.startingPrice || 499)}
            </span>
          </div>
          <button
            onClick={() => onSelect && onSelect(designer)}
            className="py-1.5 px-3 rounded-xl bg-[#6B35D9] text-white text-xs font-semibold hover:bg-[#5B29C5] transition flex items-center gap-1"
          >
            <span>Book Stylist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignerCard;
