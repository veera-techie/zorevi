import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import DesignerSidebar from './DesignerSidebar';
import DesignerMobileNav from './DesignerMobileNav';
import ToastContainer from './ToastContainer';
import './Layout.css';

export default function DesignerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="zorevi-layout">
      <DashboardHeader
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        role="designer"
      />
      <div className="zorevi-layout__body">
        <DesignerSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="zorevi-layout__main">
          <Outlet />
        </main>
      </div>
      <DesignerMobileNav />
      <ToastContainer />
    </div>
  );
}

