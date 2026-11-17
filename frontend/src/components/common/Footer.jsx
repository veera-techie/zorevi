import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-12 py-6 border-t border-[#EAE4F5] text-center text-xs text-[#6B7280]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 font-medium">
          <span>© {new Date().getFullYear()} Zorevi Technologies Pvt. Ltd.</span>
          <span>·</span>
          <span>Fashion for Everyone</span>
        </div>
        <div className="flex items-center gap-4 text-[#6B7280]">
          <a href="#terms" className="hover:text-[#6B35D9] transition">Terms of Service</a>
          <a href="#privacy" className="hover:text-[#6B35D9] transition">Designer Policy</a>
          <a href="#support" className="hover:text-[#6B35D9] transition">Studio Support</a>
          <span className="flex items-center gap-1 text-[#6B35D9] font-medium">
            Handcrafted with <Heart className="w-3.5 h-3.5 fill-[#EF4444] text-[#EF4444]" /> for Indian Couturiers
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
