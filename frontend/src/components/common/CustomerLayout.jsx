import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import CustomerSidebar from './CustomerSidebar';
import CustomerMobileNav from './CustomerMobileNav';
import ToastContainer from './ToastContainer';
import './Layout.css';

export default function CustomerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="zorevi-layout">
      <DashboardHeader
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        role="customer"
      />
      <div className="zorevi-layout__body">
        <CustomerSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="zorevi-layout__main">
          <Outlet />
        </main>
      </div>
      <CustomerMobileNav />
      <ToastContainer />
    </div>
  );
}

