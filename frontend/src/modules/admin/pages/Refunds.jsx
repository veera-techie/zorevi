import React from 'react';
import { RefreshCw } from 'lucide-react';

const Refunds = () => {
  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">Dispute & Refund Resolutions</h1>
      <div className="zorevi-card p-6 bg-white">
        <p className="text-xs text-[#6B7280]">0 active disputes. Razorpay escrow auto-refund rules active.</p>
      </div>
    </div>
  );
};

export default Refunds;
