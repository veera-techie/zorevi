import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import AdminSidebar from './AdminSidebar';
import ToastContainer from './ToastContainer';
import './Layout.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="zorevi-layout">
      <DashboardHeader
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        role="admin"
      />
      <div className="zorevi-layout__body">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="zorevi-layout__main">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

