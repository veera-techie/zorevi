import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, User, Globe, Shield, Save } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import InputField from '../../../components/forms/InputField';

const Settings = () => {
  const { profile, showToast } = useApp();

  const [notificationPrefs, setNotificationPrefs] = useState({
    smsAlerts: true,
    whatsappAlerts: true,
    emailBookingSummary: true,
    instantPaymentNotification: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Studio settings saved successfully!');
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">
          Studio Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Manage your account preferences, alerts, and platform security
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Preferences */}
        <div className="zorevi-card p-6 bg-white space-y-4">
          <h3 className="font-bold text-base text-[#1E1B2E] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#6B35D9]" />
            Instant Notification Channels
          </h3>
          <p className="text-xs text-[#6B7280]">
            Choose how you want to receive new client appointment requests and booking confirmations.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { key: 'whatsappAlerts', label: 'WhatsApp Instant Booking Alerts', desc: 'Get booking pings on +91 98490 23145 with client details' },
              { key: 'smsAlerts', label: 'SMS Security & OTP Verification', desc: 'Required for bank payout authorizations' },
              { key: 'instantPaymentNotification', label: 'Razorpay Payment Credit Alerts', desc: 'Receive instant push alert when client funds are deposited' },
              { key: 'emailBookingSummary', label: 'Daily Morning Calendar Digest', desc: 'Summary of scheduled consultations for the day' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-start justify-between p-3 rounded-xl bg-[#FAF8FE] border border-[#EAE4F5] cursor-pointer hover:border-[#6B35D9]/40 transition"
              >
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-[#1E1B2E] block">
                    {item.label}
                  </span>
                  <span className="text-xs text-[#6B7280] mt-0.5 block">{item.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPrefs[item.key]}
                  onChange={() =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      [item.key]: !notificationPrefs[item.key],
                    })
                  }
                  className="rounded text-[#6B35D9] focus:ring-[#6B35D9] w-4 h-4 mt-1"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Studio Security & Verification */}
        <div className="zorevi-card p-6 bg-white space-y-4">
          <h3 className="font-bold text-base text-[#1E1B2E] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#6B35D9]" />
            Security & Identity Verification
          </h3>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs">
            <div>
              <span className="font-bold text-[#065F46] block text-sm">
                Aadhaar & PAN KYC Verified
              </span>
              <p className="text-[#047857] mt-0.5">
                Eligible for premium Hyderabad bridal consultations and verified blue badge.
              </p>
            </div>
            <span className="px-3 py-1 bg-[#10B981] text-white rounded-lg font-bold">Active</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-white text-sm font-bold shadow-purple-glow transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
