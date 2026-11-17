import React from 'react';
import { User, MapPin, Mail, Phone } from 'lucide-react';

const CustomerProfile = () => {
  return (
    <div className="max-w-xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">Customer Profile</h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">Manage your personal fashion preferences and addresses</p>
      </div>

      <div className="zorevi-card p-6 bg-white space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#EDE8F8] text-[#6B35D9] flex items-center justify-center font-bold text-xl">
            PS
          </div>
          <div>
            <h3 className="font-bold text-base text-[#1E1B2E]">Priyanka Sen</h3>
            <p className="text-xs text-[#6B7280]">Member since 2024 · Hyderabad</p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#F3EEFB] space-y-2 text-xs text-[#4B5563]">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#6B35D9]" />
            <span>priyanka.sen@example.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#6B35D9]" />
            <span>+91 99887 11223</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#6B35D9]" />
            <span>Road No. 36, Jubilee Hills, Hyderabad</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
