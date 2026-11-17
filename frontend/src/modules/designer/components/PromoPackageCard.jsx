import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const PromoPackageCard = () => {
  const { setIsAddServiceOpen } = useApp();

  const features = [
    'Designer Consultation',
    'Styling Assistance',
    'Personalized Suggestions',
    'Standard package',
  ];

  return (
    <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#6B35D9] via-[#783BE8] to-[#8B5CF6] text-white p-5 shadow-purple-glow">
      {/* Subtle sparkle background effects */}
      <div className="absolute top-2 right-1/3 text-white/20 select-none pointer-events-none">
        <Sparkles className="w-10 h-10" />
      </div>

      <div className="relative z-10 flex items-center justify-between gap-2">
        {/* Left Information */}
        <div className="max-w-[62%]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-200">
            <span>Starting at Just</span>
            <span className="text-yellow-300">✨</span>
          </div>

          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              ₹499
            </span>
          </div>
          <span className="text-xs text-purple-200 font-medium block -mt-0.5">
            for 2 Hours
          </span>

          {/* Checklist */}
          <ul className="mt-2.5 space-y-1.5">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-purple-100">
                <div className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="truncate">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Cutout Model - Full Model Figure */}
        <div className="relative flex-shrink-0 self-end -mb-5 -mr-2">
          <img
            src="/images/promo-model.png"
            alt="Designer lehenga bridal consultation"
            className="h-36 sm:h-40 md:h-[165px] object-contain object-bottom drop-shadow-md select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PromoPackageCard;
