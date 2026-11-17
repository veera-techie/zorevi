import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Coins,
  Star,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/formatCurrency';

const KpiMetricsRow = () => {
  const { profile } = useApp();

  const metrics = [
    {
      id: 'total-bookings',
      label: 'Total Bookings',
      value: '128',
      growth: '+12.8%',
      icon: Calendar,
      trendUp: true,
    },
    {
      id: 'upcoming-bookings',
      label: 'Upcoming Bookings',
      value: '08',
      growth: null,
      icon: Clock,
      subText: 'Scheduled',
    },
    {
      id: 'completed-bookings',
      label: 'Completed Bookings',
      value: '112',
      growth: '+8.2%',
      icon: CheckCircle2,
      trendUp: true,
    },
    {
      id: 'total-earnings',
      label: 'Total Earnings',
      value: formatCurrency(84650),
      growth: '+18.4%',
      icon: Coins,
      trendUp: true,
    },
    {
      id: 'average-rating',
      label: 'Average Rating',
      value: '4.9/5',
      stars: 5,
      icon: Star,
      isRating: true,
    },
    {
      id: 'profile-views',
      label: 'Profile Views',
      value: '2,340',
      growth: '+24.6%',
      icon: Eye,
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {metrics.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="zorevi-card p-4 flex flex-col justify-between hover:border-[#6B35D9]/30 transition-all group"
          >
            {/* Top row: Icon + optional Growth pill */}
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#F3EEFF] text-[#6B35D9] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>
              {item.growth && (
                <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#10B981] text-[11px] font-bold">
                  <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                  <span>{item.growth}</span>
                </div>
              )}
            </div>

            {/* Label */}
            <span className="text-[11px] font-medium text-[#6B7280] tracking-tight block">
              {item.label}
            </span>

            {/* Metric Value */}
            <div className="mt-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E] tracking-tight">
                {item.value}
              </h3>

              {/* Gold stars for rating */}
              {item.isRating && (
                <div className="flex items-center gap-0.5 mt-1 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]"
                    />
                  ))}
                </div>
              )}

              {/* Subtext for upcoming */}
              {item.subText && (
                <span className="text-[10px] text-[#9CA3AF] font-medium block mt-0.5">
                  This month
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KpiMetricsRow;
