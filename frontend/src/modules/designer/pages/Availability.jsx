import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Check, Plus, AlertCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const Availability = () => {
  const { isOnline, toggleOnlineStatus, profile, updateProfileData, showToast } = useApp();
  const [radius, setRadius] = useState(15);

  const [days, setDays] = useState([
    { day: 'Monday', enabled: true, start: '10:00 AM', end: '07:00 PM' },
    { day: 'Tuesday', enabled: true, start: '10:00 AM', end: '07:00 PM' },
    { day: 'Wednesday', enabled: true, start: '10:00 AM', end: '07:00 PM' },
    { day: 'Thursday', enabled: true, start: '10:00 AM', end: '07:00 PM' },
    { day: 'Friday', enabled: true, start: '10:00 AM', end: '08:00 PM' },
    { day: 'Saturday', enabled: true, start: '09:00 AM', end: '09:00 PM' },
    { day: 'Sunday', enabled: false, start: '11:00 AM', end: '05:00 PM' },
  ]);

  const toggleDay = (idx) => {
    const next = [...days];
    next[idx].enabled = !next[idx].enabled;
    setDays(next);
  };

  const handleSaveRadius = () => {
    updateProfileData({ serviceRadius: `${radius} km service radius` });
    showToast(`Service radius updated to ${radius} km around Hyderabad!`);
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">
          Studio Availability & Radius
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Control your booking calendar, working hours, and physical travel radius
        </p>
      </div>

      {/* Top Banner Status */}
      <div className="zorevi-card p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
            Realtime Studio State
          </span>
          <div className="flex items-center gap-3">
            <span
              className={`w-3.5 h-3.5 rounded-full ${
                isOnline ? 'bg-[#10B981] animate-pulse' : 'bg-gray-400'
              }`}
            />
            <h3 className="text-lg font-bold text-[#1E1B2E]">
              {isOnline ? 'Online — Accepting instant booking requests' : 'Offline — Studio is paused'}
            </h3>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            When online, your profile is surfaced in Hyderabad explore search for clients.
          </p>
        </div>

        <button
          onClick={toggleOnlineStatus}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm ${
            isOnline
              ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
              : 'bg-[#10B981] text-white hover:bg-[#059669]'
          }`}
        >
          {isOnline ? 'Go Offline' : 'Go Online Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Hours (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="zorevi-card p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#1E1B2E] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6B35D9]" />
                Weekly Working Hours
              </h3>
              <span className="text-xs text-[#6B7280]">Timezone: IST (GMT+5:30)</span>
            </div>

            <div className="space-y-3">
              {days.map((d, idx) => (
                <div
                  key={d.day}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8FE] border border-[#EAE4F5]"
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={d.enabled}
                      onChange={() => toggleDay(idx)}
                      className="rounded text-[#6B35D9] focus:ring-[#6B35D9] w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-[#1E1B2E]">{d.day}</span>
                  </label>

                  {d.enabled ? (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-3 py-1 bg-white border border-[#EAE4F5] rounded-lg font-medium text-[#1E1B2E]">
                        {d.start}
                      </span>
                      <span className="text-[#6B7280]">to</span>
                      <span className="px-3 py-1 bg-white border border-[#EAE4F5] rounded-lg font-medium text-[#1E1B2E]">
                        {d.end}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-[#9CA3AF]">Day Off</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Travel Radius Settings (1 col) */}
        <div className="space-y-6">
          <div className="zorevi-card p-6 bg-white space-y-4">
            <h3 className="font-bold text-base text-[#1E1B2E] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#6B35D9]" />
              Service Radius
            </h3>
            <p className="text-xs text-[#6B7280]">
              Max distance from your studio in Jubilee Hills for in-person bridal consultations.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#6B7280]">Radius Limit</span>
                <span className="text-[#6B35D9] text-sm">{radius} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-[#6B35D9]"
              />
              <div className="flex justify-between text-[10px] text-[#9CA3AF]">
                <span>5 km</span>
                <span>25 km</span>
                <span>50 km</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F3EEFF] border border-[#E9DFFC] text-xs text-[#4C1D95]">
              Covers Banjara Hills, Jubilee Hills, Madhapur, Hitech City, Kondapur, Gachibowli.
            </div>

            <button
              onClick={handleSaveRadius}
              className="w-full py-2.5 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-white text-xs font-bold shadow-purple-glow transition"
            >
              Update Radius
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
