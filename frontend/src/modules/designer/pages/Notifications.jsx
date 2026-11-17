import React from 'react';
import { Bell, Calendar, Wallet, Star, ShieldCheck, CheckCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const Notifications = () => {
  const { showToast } = useApp();

  const notifications = [
    {
      id: 1,
      type: 'booking',
      title: 'New Bridal Booking Request',
      message: 'Mira Kapoor has requested a 3-hour consultation for Nov 18, 10:00 AM.',
      time: '12 minutes ago',
      unread: true,
      icon: Calendar,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Credited ₹4,500',
      message: 'Razorpay Escrow settlement for completed booking #BK-1075 is now eligible for withdrawal.',
      time: '1 hour ago',
      unread: true,
      icon: Wallet,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 3,
      type: 'review',
      title: 'New 5-Star Review Received',
      message: 'Pooja Reddy left a 5-star review: "Aarohi helped me pick the dream saree!"',
      time: 'Yesterday',
      unread: false,
      icon: Star,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      id: 4,
      type: 'system',
      title: 'Wedding Season Surge Active',
      message: 'Inquiries in Jubilee Hills and Banjara Hills increased by 42%. Consider keeping your status online.',
      time: '2 days ago',
      unread: false,
      icon: ShieldCheck,
      color: 'bg-blue-100 text-blue-700',
    },
  ];

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">
            Studio Notifications
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Realtime updates about client requests, payouts, and reviews
          </p>
        </div>
        <button
          onClick={() => showToast('All notifications marked as read')}
          className="px-4 py-2 rounded-xl bg-white border border-[#EAE4F5] text-xs font-semibold text-[#6B7280] hover:text-[#6B35D9] transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-[#6B35D9]" />
          <span>Mark all read</span>
        </button>
      </div>

      <div className="zorevi-card bg-white divide-y divide-[#F3EEFB] overflow-hidden">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className={`p-4 sm:p-5 flex items-start gap-4 transition hover:bg-[#FAF8FE] ${
                n.unread ? 'bg-[#FDFCFF]' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-[#1E1B2E] flex items-center gap-2">
                    {n.title}
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#6B35D9] inline-block" />
                    )}
                  </h4>
                  <span className="text-[11px] text-[#9CA3AF] whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
