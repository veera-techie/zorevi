import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import ToastContainer from './ToastContainer';

export default function PublicLayout() {
  return (
    <div className="zorevi-layout">
      <PublicNavbar />
<<<<<<< HEAD
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
=======
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
>>>>>>> origin/sai
      <PublicFooter />
      <ToastContainer />
    </div>
  );
}

