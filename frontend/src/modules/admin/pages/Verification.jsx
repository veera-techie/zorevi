import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const Verification = () => {
  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">Designer Verification Portal</h1>
      <div className="zorevi-card p-6 bg-white space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="font-bold text-base text-[#1E1B2E]">Aadhaar / PAN & Degree Auditing</h3>
        </div>
        <p className="text-xs text-[#6B7280]">
          KYC compliance engine for verifying stylist credentials before public listing on Zorevi.
        </p>
      </div>
    </div>
  );
};

export default Verification;
