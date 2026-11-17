import React from 'react';
import { Sparkles } from 'lucide-react';

const Loader = ({ label = 'Loading your studio...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-[#EDE8F8] border-t-[#6B35D9] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#8B5CF6] animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-medium text-[#6B7280]">{label}</p>
    </div>
  );
};

export default Loader;
