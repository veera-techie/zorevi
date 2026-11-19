import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import CustomerSidebar from './CustomerSidebar';
import CustomerMobileNav from './CustomerMobileNav';
import PublicFooter from './PublicFooter';
import ToastContainer from './ToastContainer';
import './Layout.css';

export default function CustomerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeDrawer = useCallback(() => {
    setSidebarOpen(false);
    window.requestAnimationFrame(() => document.getElementById('customer-profile-trigger')?.focus());
  }, []);
  const toggleDrawer = useCallback(() => {
    setSidebarOpen((open) => !open);
  }, []);

  return (
    <div className="zorevi-layout zorevi-layout--customer">
      <DashboardHeader
        onToggleSidebar={toggleDrawer}
        profileDrawerOpen={sidebarOpen}
        role="customer"
      />
      <div className="zorevi-layout__body">
        <CustomerSidebar
          isOpen={sidebarOpen}
          onClose={closeDrawer}
        />
        <main className="zorevi-layout__main">
          <Outlet />
        </main>
      </div>
      <PublicFooter role="customer" />
      <CustomerMobileNav />
      <ToastContainer />
    </div>
  );
}

