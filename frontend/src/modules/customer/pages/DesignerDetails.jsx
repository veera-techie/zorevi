import React from 'react';
import {
  Star,
  MapPin,
  Briefcase,
  ShieldCheck,
  Check,
  Clock,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';

const DesignerDetails = () => {
  const { profile } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-10">
      {/* Hero Card */}
      <div className="zorevi-card p-6 sm:p-8 bg-white flex flex-col md:flex-row gap-6 items-start">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border border-[#EAE4F5] flex-shrink-0 shadow-zorevi-sm">
          <img
            src={profile.portrait}
            alt={profile.name}
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#1E1B2E]">{profile.name}</h1>
            <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />
            <span className="text-xs bg-[#ECFDF5] text-[#065F46] font-bold px-2 py-0.5 rounded-full">
              ● Online / Accepting Bookings
            </span>
          </div>

          <p className="text-sm text-[#6B7280] mt-1">{profile.title}</p>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#6B7280]">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#6B35D9]" /> {profile.location} · {profile.serviceRadius}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-[#6B35D9]" /> {profile.experience}
            </span>
            <span className="flex items-center gap-1 text-[#F59E0B] font-bold">
              <Star className="w-4 h-4 fill-[#F59E0B]" /> {profile.rating} ({profile.reviewCount} reviews)
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {profile.specializations.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F3EEFF] text-[#6B35D9]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full md:w-auto p-5 rounded-2xl bg-[#FAF8FE] border border-[#EAE4F5] text-center md:min-w-[200px]">
          <span className="text-xs text-[#6B7280] block">Consultations starting at</span>
          <span className="text-3xl font-extrabold text-[#1E1B2E] block my-1">
            {formatCurrency(profile.startingPrice)}
          </span>
          <span className="text-xs text-[#6B7280] block mb-3">for 2 Hours</span>
          <button
            onClick={() => navigate('/customer/booking')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-white text-xs font-bold shadow-purple-glow transition"
          >
            Book Appointment
          </button>
        </div>
      </div>

      {/* Bio & Portfolio Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="zorevi-card p-6 bg-white space-y-3">
          <h3 className="font-bold text-base text-[#1E1B2E]">Designer Bio</h3>
          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
            {profile.bio}
          </p>
          <div className="pt-3 border-t border-[#F3EEFB]">
            <h4 className="font-bold text-xs text-[#1E1B2E] mb-2">Packages Available:</h4>
            <ul className="space-y-1.5 text-xs text-[#4B5563]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#10B981]" /> Standard 2-hour Personal Consultation (₹499)
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#10B981]" /> Bridal Grand Couture & Trousseau (₹4,500)
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#10B981]" /> Coordinated Family Festive Ensemble (₹3,800)
              </li>
            </ul>
          </div>
        </div>

        <div className="zorevi-card p-6 bg-white space-y-3">
          <h3 className="font-bold text-base text-[#1E1B2E]">Recent Highlights</h3>
          <div className="grid grid-cols-3 gap-2">
            {['/images/portfolio-bridal.png', '/images/portfolio-classics.png', '/images/portfolio-family.png'].map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Highlight"
                className="aspect-square rounded-xl object-cover border border-[#EAE4F5]"
              />
            ))}
          </div>
          <div className="pt-2 text-center">
            <span className="text-xs text-[#6B7280]">
              Verified by Zorevi Stylist Council · 100% Satisfaction Guarantee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerDetails;
