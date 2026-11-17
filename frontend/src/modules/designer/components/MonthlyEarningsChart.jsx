import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, BarChart2, CheckCircle2 } from 'lucide-react';
import { MONTHLY_EARNINGS_DATA } from '../../../constants';
import { formatCurrency, formatINR } from '../../../utils/formatCurrency';
import { useApp } from '../../../context/AppContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1E1B2E] text-white p-2.5 rounded-xl text-xs shadow-xl border border-white/10">
        <p className="font-semibold text-purple-200">{label} 2025</p>
        <p className="font-bold text-sm text-white mt-0.5">
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">
          {payload[0].payload.bookings} bookings completed
        </p>
      </div>
    );
  }
  return null;
};

const MonthlyEarningsChart = () => {
  const { isOnline, toggleOnlineStatus } = useApp();

  return (
    <div className="zorevi-card p-5 flex flex-col justify-between h-full bg-white">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F3EEFF] text-[#6B35D9] flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1E1B2E]">Monthly earnings</h3>
          </div>
          <span className="text-[11px] font-semibold text-[#6B7280] bg-[#FAF8FE] px-2.5 py-1 rounded-full border border-[#EAE4F5]">
            2025 Financial
          </span>
        </div>

        {/* Big Metric + Trend */}
        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#1E1B2E] tracking-tight">
            ₹84,650
          </span>
          <span className="text-xs text-[#6B7280] font-medium">This month</span>
          <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#10B981] text-xs font-bold ml-1">
            <TrendingUp className="w-3 h-3 stroke-[2.5]" />
            <span>+18.4%</span>
          </span>
        </div>

        {/* Smooth Area Chart */}
        <div className="mt-4 h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={MONTHLY_EARNINGS_DATA}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="purpleEarningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stop-color="#8B5CF6" stop-opacity={0.35} />
                  <stop offset="95%" stop-color="#8B5CF6" stop-opacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                domain={[0, 100000]}
                ticks={[0, 20000, 40000, 60000, 80000, 100000]}
                tickFormatter={(value) => (value === 0 ? '0' : formatINR(value, false))}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#6B35D9"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#purpleEarningsGrad)"
                dot={{ r: 3, fill: '#6B35D9', strokeWidth: 2, stroke: '#FFFFFF' }}
                activeDot={{ r: 6, fill: '#6B35D9', stroke: '#EDE5FA', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Bar: Studio Status */}
      <div className="mt-4 pt-3 border-t border-[#F3EEFB] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isOnline ? 'bg-[#10B981] animate-pulse' : 'bg-[#9CA3AF]'
            }`}
          />
          <span className="text-xs font-medium text-[#1E1B2E]">Studio status</span>
        </div>

        <button
          onClick={toggleOnlineStatus}
          className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1"
        >
          <span>{isOnline ? 'Online / accepting bookings' : 'Offline / taking a break'}</span>
        </button>
      </div>
    </div>
  );
};

export default MonthlyEarningsChart;
