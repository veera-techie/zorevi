import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, ShieldCheck, Shirt } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
  const { profile } = useApp();
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState({
    title: 'Bridal Grand Couture Consultation',
    price: 4500,
    duration: '3 Hours',
  });
  const [selectedDate, setSelectedDate] = useState('2025-11-20');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [address, setAddress] = useState('Road No. 36, Jubilee Hills, Hyderabad');

  const timeSlots = ['10:00 AM', '01:30 PM', '04:00 PM', '06:30 PM'];

  const handleProceed = () => {
    navigate('/customer/checkout', {
      state: {
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        address,
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">
          Book a Styling Appointment with {profile.name}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Select consultation type, preferred time slot, and location in Hyderabad
        </p>
      </div>

      <div className="zorevi-card p-6 bg-white space-y-5">
        <div>
          <label className="block text-xs font-bold text-[#1E1B2E] mb-2 uppercase tracking-wider">
            1. Select Styling Service
          </label>
          <div className="space-y-2">
            {[
              { title: 'Standard Personal Styling Consultation', price: 499, duration: '2 Hours' },
              { title: 'Bridal Grand Couture Consultation', price: 4500, duration: '3 Hours' },
              { title: 'Family Festive Ensemble Styling', price: 3800, duration: '4 Hours' },
            ].map((s) => (
              <label
                key={s.title}
                onClick={() => setSelectedService(s)}
                className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition ${
                  selectedService.title === s.title
                    ? 'border-[#6B35D9] bg-[#F3EEFF]/40'
                    : 'border-[#EAE4F5] hover:border-[#D9D2E9]'
                }`}
              >
                <div>
                  <span className="font-bold text-sm text-[#1E1B2E] block">{s.title}</span>
                  <span className="text-xs text-[#6B7280] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {s.duration}
                  </span>
                </div>
                <span className="text-base font-extrabold text-[#6B35D9]">
                  {formatCurrency(s.price)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1E1B2E] mb-2 uppercase tracking-wider">
              2. Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EAE4F5] text-sm text-[#1E1B2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E1B2E] mb-2 uppercase tracking-wider">
              3. Time Slot
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTime(t)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    selectedTime === t
                      ? 'bg-[#6B35D9] text-white border-[#6B35D9]'
                      : 'bg-white text-[#1E1B2E] border-[#EAE4F5] hover:bg-[#FAF8FE]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1E1B2E] mb-2 uppercase tracking-wider">
            4. In-Person Consultation Location
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#6B35D9] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your home address or mall location in Hyderabad"
              className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-[#EAE4F5] text-sm"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#F3EEFB] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7280] block">Total Amount</span>
            <span className="text-2xl font-extrabold text-[#1E1B2E]">
              {formatCurrency(selectedService.price)}
            </span>
          </div>

          <button
            onClick={handleProceed}
            className="px-6 py-2.5 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-white font-bold text-sm shadow-purple-glow flex items-center gap-2 transition"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
