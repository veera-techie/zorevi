import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DesignerLayout from '../components/common/DesignerLayout';

// Designer Pages
import Dashboard from '../modules/designer/pages/Dashboard';
import ProfilePortfolio from '../modules/designer/pages/ProfilePortfolio';
import ServicesPricing from '../modules/designer/pages/ServicesPricing';
import Availability from '../modules/designer/pages/Availability';
import Bookings from '../modules/designer/pages/Bookings';
import Earnings from '../modules/designer/pages/Earnings';
import Reviews from '../modules/designer/pages/Reviews';
import Notifications from '../modules/designer/pages/Notifications';
import Settings from '../modules/designer/pages/Settings';

// Sub-routes / aliases
import Profile from '../modules/designer/pages/Profile';
import Portfolio from '../modules/designer/pages/Portfolio';
import Skills from '../modules/designer/pages/Skills';
import Services from '../modules/designer/pages/Services';
import Pricing from '../modules/designer/pages/Pricing';
import BookingRequests from '../modules/designer/pages/BookingRequests';

// Customer Pages
import CustomerDashboard from '../modules/customer/pages/Dashboard';
import Explore from '../modules/customer/pages/Explore';
import NearbyMalls from '../modules/customer/pages/NearbyMalls';
import NearbyDesigners from '../modules/customer/pages/NearbyDesigners';
import DesignerDetails from '../modules/customer/pages/DesignerDetails';
import Booking from '../modules/customer/pages/Booking';
import Checkout from '../modules/customer/pages/Checkout';
import PaymentStatus from '../modules/customer/pages/PaymentStatus';
import MyBookings from '../modules/customer/pages/MyBookings';
import CustomerReviews from '../modules/customer/pages/Reviews';
import Wishlist from '../modules/customer/pages/Wishlist';
import CustomerProfile from '../modules/customer/pages/Profile';

// Admin Pages
import AdminDashboard from '../modules/admin/pages/Dashboard';
import Customers from '../modules/admin/pages/Customers';
import Designers from '../modules/admin/pages/Designers';
import Verification from '../modules/admin/pages/Verification';
import Malls from '../modules/admin/pages/Malls';
import AdminBookings from '../modules/admin/pages/Bookings';
import AdminPayments from '../modules/admin/pages/Payments';
import Refunds from '../modules/admin/pages/Refunds';
import Reports from '../modules/admin/pages/Reports';

// Auth Pages
import Login from '../modules/authentication/Login';
import Logout from '../modules/authentication/Logout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect to Designer Dashboard */}
      <Route path="/" element={<Navigate to="/designer/dashboard" replace />} />

      {/* Designer Module Routes with Layout */}
      <Route path="/designer" element={<DesignerLayout />}>
        <Route index element={<Navigate to="/designer/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile-portfolio" element={<ProfilePortfolio />} />
        <Route path="services-pricing" element={<ServicesPricing />} />
        <Route path="availability" element={<Availability />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />

        {/* Legacy aliases mapping cleanly */}
        <Route path="profile" element={<Profile />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="skills" element={<Skills />} />
        <Route path="services" element={<Services />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="booking-requests" element={<BookingRequests />} />
        <Route path="my-bookings" element={<Bookings />} />
      </Route>

      {/* Customer Module Routes with Layout */}
      <Route path="/customer" element={<DesignerLayout />}>
        <Route index element={<Navigate to="/customer/explore" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="explore" element={<Explore />} />
        <Route path="nearby-malls" element={<NearbyMalls />} />
        <Route path="nearby-designers" element={<NearbyDesigners />} />
        <Route path="designer-details" element={<DesignerDetails />} />
        <Route path="booking" element={<Booking />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="payment-status" element={<PaymentStatus />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="reviews" element={<CustomerReviews />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Route>

      {/* Admin Module Routes with Layout */}
      <Route path="/admin" element={<DesignerLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="designers" element={<Designers />} />
        <Route path="verification" element={<Verification />} />
        <Route path="malls" element={<Malls />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="refunds" element={<Refunds />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/designer/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
