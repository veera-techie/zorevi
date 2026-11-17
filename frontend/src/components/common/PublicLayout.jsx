import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import ToastContainer from './ToastContainer';

export default function PublicLayout() {
  return (
    <div className="zorevi-layout">
      <PublicNavbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <PublicFooter />
      <ToastContainer />
    </div>
  );
}

