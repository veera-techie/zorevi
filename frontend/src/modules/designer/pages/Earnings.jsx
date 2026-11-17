import React from 'react';
import {
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Download,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { formatCurrency, formatINR } from '../../../utils/formatCurrency';
import { useApp } from '../../../context/AppContext';
import MonthlyEarningsChart from '../components/MonthlyEarningsChart';

const Earnings = () => {
  const { showToast } = useApp();

  const transactions = [
    {
      id: 'RZP-PAY-8821',
      date: 'Nov 16, 2025',
      client: 'Mira Kapoor (Deposit)',
      service: 'Bridal styling',
      amount: 4500,
      fee: 225,
      net: 4275,
      status: 'Escrow Held',
    },
    {
      id: 'RZP-PAY-8819',
      date: 'Nov 14, 2025',
      client: 'Rohan Shah',
      service: 'Wardrobe consultation',
      amount: 1200,
      fee: 60,
      net: 1140,
      status: 'Settled to Bank',
    },
    {
      id: 'RZP-PAY-8815',
      date: 'Nov 11, 2025',
      client: 'Pooja Reddy',
      service: 'Evening Wear Curation',
      amount: 2500,
      fee: 125,
      net: 2375,
      status: 'Settled to Bank',
    },
    {
      id: 'RZP-PAY-8809',
      date: 'Nov 08, 2025',
      client: 'Ananya Sharma',
      service: 'Wedding Trousseau Consult',
      amount: 6000,
      fee: 300,
      net: 5700,
      status: 'Settled to Bank',
    },
  ];

  const handleInstantPayout = () => {
    showToast('Instant payout of ₹32,450 initiated to HDFC Bank A/C ending in 4102 via Razorpay Route!');
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">
            Earnings & Payments
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Razorpay Escrow payouts, service earnings, and tax invoices
          </p>
        </div>

        <button
          onClick={() => showToast('Downloading Nov 2025 GST statement (PDF)...')}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#EAE4F5] hover:border-[#6B35D9] text-xs sm:text-sm font-semibold text-[#1E1B2E] transition flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <Download className="w-4 h-4 text-[#6B35D9]" />
          <span>Export Statement</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="zorevi-card p-5 bg-white">
          <span className="text-xs font-semibold text-[#6B7280]">Total Gross Earnings (Nov)</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#1E1B2E]">
              {formatCurrency(84650)}
            </span>
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#10B981] text-xs font-bold">
              <TrendingUp className="w-3 h-3" /> +18.4%
            </span>
          </div>
          <span className="text-[11px] text-[#9CA3AF] mt-1 block">128 bookings fulfilled</span>
        </div>

        <div className="zorevi-card p-5 bg-white">
          <span className="text-xs font-semibold text-[#6B7280]">Ready for Bank Payout</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#6B35D9]">
              {formatCurrency(32450)}
            </span>
            <button
              onClick={handleInstantPayout}
              className="px-3 py-1 rounded-lg bg-[#6B35D9] text-white text-xs font-bold hover:bg-[#5B29C5] transition shadow-purple-glow"
            >
              Withdraw
            </button>
          </div>
          <span className="text-[11px] text-[#9CA3AF] mt-1 block">To HDFC Bank •••• 4102</span>
        </div>

        <div className="zorevi-card p-5 bg-white">
          <span className="text-xs font-semibold text-[#6B7280]">In Razorpay Escrow</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#F59E0B]">
              {formatCurrency(9500)}
            </span>
            <span className="text-xs text-[#9CA3AF] font-medium">3 active sessions</span>
          </div>
          <span className="text-[11px] text-[#9CA3AF] mt-1 block">Released upon booking completion</span>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <MonthlyEarningsChart />
        </div>

        <div className="lg:col-span-4 zorevi-card p-5 bg-white flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#1E1B2E] mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#6B35D9]" />
              Payout Destination
            </h3>
            <div className="p-4 rounded-2xl bg-[#FAF8FE] border border-[#EAE4F5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1E1B2E]">HDFC Bank Ltd.</span>
                <span className="text-[10px] bg-[#ECFDF5] text-[#065F46] font-bold px-2 py-0.5 rounded-full">
                  Primary
                </span>
              </div>
              <p className="text-xs font-mono text-[#6B7280]">A/C: •••••••••••• 4102</p>
              <p className="text-xs text-[#6B7280]">IFSC: HDFC0001824 · Jubilee Hills</p>
              <p className="text-xs text-[#6B7280]">Holder: Aarohi Mehta</p>
            </div>
            <div className="mt-3 text-xs text-[#6B7280] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Razorpay Instant Payout enabled</span>
            </div>
          </div>

          <button
            onClick={() => showToast('Bank account details settings opened')}
            className="mt-4 w-full py-2 rounded-xl border border-[#EAE4F5] text-xs font-semibold text-[#1E1B2E] hover:bg-[#FAF8FE]"
          >
            Manage Payout Accounts
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="zorevi-card p-5 bg-white">
        <h3 className="font-bold text-base text-[#1E1B2E] mb-3">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F3EEFB] text-[11px] font-bold text-[#9CA3AF] uppercase">
                <th className="py-2.5">TRANSACTION ID</th>
                <th className="py-2.5">DATE</th>
                <th className="py-2.5">CLIENT & SERVICE</th>
                <th className="py-2.5">GROSS</th>
                <th className="py-2.5">PLATFORM (5%)</th>
                <th className="py-2.5">NET PAYOUT</th>
                <th className="py-2.5">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3EEFB]">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FAF8FE]">
                  <td className="py-3 font-mono font-bold text-[#6B35D9]">{tx.id}</td>
                  <td className="py-3 text-[#6B7280]">{tx.date}</td>
                  <td className="py-3">
                    <span className="font-bold text-[#1E1B2E] block">{tx.client}</span>
                    <span className="text-[11px] text-[#6B7280]">{tx.service}</span>
                  </td>
                  <td className="py-3 font-bold text-[#1E1B2E]">{formatCurrency(tx.amount)}</td>
                  <td className="py-3 text-[#EF4444]">-{formatCurrency(tx.fee)}</td>
                  <td className="py-3 font-bold text-[#10B981]">{formatCurrency(tx.net)}</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        tx.status.includes('Escrow')
                          ? 'bg-[#FEF3C7] text-[#D97706]'
                          : 'bg-[#ECFDF5] text-[#059669]'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
