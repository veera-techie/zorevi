import React from 'react';
import {
  MapPin,
  Briefcase,
  Star,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const DesignerProfileCard = () => {
  const { profile, setIsEditProfileOpen } = useApp();

  return (
    <div className="zorevi-card p-5 flex flex-col justify-between h-full bg-white relative overflow-hidden">
      <div>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Portrait Photo of Aarohi Mehta - Full vertical photo */}
          <div className="relative flex-shrink-0 w-32 sm:w-[135px] h-44 sm:h-[192px] rounded-2xl overflow-hidden border border-[#EAE4F5] shadow-zorevi-sm bg-[#EDE8F8]">
            <img
              src="/images/aarohi-portrait.png"
              alt={profile.name}
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
            />
            {profile.verified && (
              <div
                className="absolute bottom-2 left-2 bg-[#3B82F6] text-white p-1 rounded-full shadow-md"
                title="Verified Stylist"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-lg font-bold text-[#1E1B2E] tracking-tight">
                {profile.name}
              </h2>
              {profile.verified && (
                <div
                  className="w-4 h-4 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-[10px]"
                  title="Verified"
                >
                  ✓
                </div>
              )}
            </div>

            <p className="text-xs font-medium text-[#6B7280] mt-0.5">
              {profile.title}
            </p>

            <div className="mt-2 space-y-1 text-xs text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#6B35D9] flex-shrink-0" />
                <span>{profile.location} · {profile.serviceRadius}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#6B35D9] flex-shrink-0" />
                <span>{profile.experience}</span>
              </div>
            </div>

            {/* Specialization Tags */}
            <div className="mt-2.5">
              <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider block mb-1">
                Specializations
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.specializations.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F3EEFF] text-[#6B35D9] border border-[#E9DFFC]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-2.5 flex items-center gap-1.5 text-xs">
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <span className="font-bold text-[#1E1B2E]">{profile.rating}</span>
              <span className="text-[#6B7280]">({profile.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-4 pt-3 border-t border-[#F3EEFB]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#1E1B2E]">Profile Completion</span>
            <span className="font-bold text-[#6B35D9]">{profile.profileCompletion}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#EDE8F8] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6B35D9] to-[#8B5CF6] transition-all duration-500"
              style={{ width: `${profile.profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <button
        onClick={() => setIsEditProfileOpen(true)}
        className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-white text-xs sm:text-sm font-semibold shadow-purple-glow flex items-center justify-center gap-2 transition transform active:scale-95"
      >
        <span>Edit Profile</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DesignerProfileCard;
