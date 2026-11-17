import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import EditProfileModal from '../../modules/designer/components/EditProfileModal';
import UploadProjectModal from '../../modules/designer/components/UploadProjectModal';
import BookingDetailModal from '../../modules/designer/components/BookingDetailModal';
import AddServiceModal from '../../modules/designer/components/AddServiceModal';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const DesignerLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { toastMessage } = useApp();

  return (
    <div className="min-h-screen bg-[#F6F3FB] text-[#1E1B2E] flex">
      {/* Streamlined Left Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        {/* Top Header Bar */}
        <Navbar onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* Interactive Global Modals */}
      <EditProfileModal />
      <UploadProjectModal />
      <BookingDetailModal />
      <AddServiceModal />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1E1B2E] text-white text-xs sm:text-sm font-semibold shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
          <span>{toastMessage.message}</span>
        </div>
      )}
    </div>
  );
};

export default DesignerLayout;
