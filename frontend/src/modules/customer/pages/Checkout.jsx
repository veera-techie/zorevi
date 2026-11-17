import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, ArrowRight, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useApp } from '../../../context/AppContext';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setBookings, showToast } = useApp();

  const bookingData = location.state || {
    service: { title: 'Bridal Grand Couture Consultation', price: 4500, duration: '3 Hours' },
    date: '2025-11-20',
    time: '10:00 AM',
    address: 'Road No. 36, Jubilee Hills, Hyderabad',
  };

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('user@oksbi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // add new booking to state
      const newBooking = {
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: {
          name: 'Priyanka Sen',
          avatar: '/images/customer-mira.png',
          phone: '+91 99887 11223',
          email: 'priyanka.sen@example.com',
          location: 'Jubilee Hills, Hyderabad',
        },
        service: bookingData.service.title,
        dateTime: `${bookingData.date} · ${bookingData.time}`,
        amount: bookingData.service.price,
        status: 'Pending',
        notes: `Appointment booked at ${bookingData.address}`,
      };

      setBookings((prev) => [newBooking, ...prev]);
      navigate('/customer/payment-status', { state: { booking: newBooking } });
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Powered by Razorpay Escrow Protection
        </p>
      </div>

      <div className="zorevi-card p-6 bg-white space-y-5">
        {/* Order Summary */}
        <div className="p-4 rounded-2xl bg-[#FAF8FE] border border-[#EAE4F5] space-y-2 text-xs">
          <div className="flex justify-between font-bold text-sm text-[#1E1B2E]">
            <span>{bookingData.service.title}</span>
            <span>{formatCurrency(bookingData.service.price)}</span>
          </div>
          <p className="text-[#6B7280]">
            Scheduled: {bookingData.date} at {bookingData.time}
          </p>
          <p className="text-[#6B7280]">
            Location: {bookingData.address}
          </p>
          <div className="pt-2 border-t border-[#EAE4F5] flex justify-between font-bold text-sm text-[#1E1B2E]">
            <span>Total Payable</span>
            <span className="text-[#6B35D9] text-base">{formatCurrency(bookingData.service.price)}</span>
          </div>
        </div>

        {/* Razorpay Escrow badge */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>100% Escrow Protection:</strong> Funds are kept safe by Razorpay until your designer styling session is successfully concluded.
          </span>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#1E1B2E] uppercase tracking-wider">
            Choose Payment Method
          </label>
          {['UPI (GPay / PhonePe / Paytm)', 'Credit / Debit Card', 'Net Banking'].map((m) => (
            <label
              key={m}
              onClick={() => setPaymentMethod(m)}
              className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition ${
                paymentMethod === m
                  ? 'border-[#6B35D9] bg-[#F3EEFF]/40'
                  : 'border-[#EAE4F5] hover:border-[#D9D2E9]'
              }`}
            >
              <span className="text-sm font-semibold text-[#1E1B2E]">{m}</span>
              <input
                type="radio"
                checked={paymentMethod === m}
                onChange={() => {}}
                className="text-[#6B35D9] focus:ring-[#6B35D9]"
              />
            </label>
          ))}
        </div>

        {paymentMethod.includes('UPI') && (
          <div>
            <label className="block text-xs font-bold text-[#1E1B2E] mb-1">Enter UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. mobile@upi"
              className="w-full p-2.5 rounded-xl border border-[#EAE4F5] text-sm"
            />
          </div>
        )}

        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className="w-full py-3 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-white text-sm font-bold shadow-purple-glow flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          {isProcessing ? (
            <span>Authorizing Payment via Razorpay...</span>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Pay {formatCurrency(bookingData.service.price)} Securely</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
