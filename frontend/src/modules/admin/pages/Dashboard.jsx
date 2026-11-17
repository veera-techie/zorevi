import React from 'react';
import { Users, ShieldCheck, DollarSign, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatCurrency';

const AdminDashboard = () => {
  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">
          Zorevi Admin Operations
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Platform health, stylist KYC verification, and escrow settlement monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Verified Stylists', value: '428', icon: Users, change: '+14% this mo' },
          { label: 'KYC Pending Review', value: '18', icon: ShieldCheck, change: 'Needs action' },
          { label: 'Gross Volume (Nov)', value: formatCurrency(3420000), icon: DollarSign, change: '+22.4%' },
          { label: 'Partner Malls', value: '34', icon: ShoppingBag, change: 'Across 6 cities' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="zorevi-card p-5 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#F3EEFF] text-[#6B35D9] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-[#10B981]">{item.change}</span>
              </div>
              <span className="text-xs text-[#6B7280]">{item.label}</span>
              <h3 className="text-2xl font-extrabold text-[#1E1B2E] mt-1">{item.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="zorevi-card p-6 bg-white space-y-3">
        <h3 className="font-bold text-base text-[#1E1B2E]">Stylist Onboarding Queue</h3>
        <p className="text-xs text-[#6B7280]">
          18 fashion designers awaiting NIFT certificate & portfolio verification in Hyderabad and Bengaluru.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
