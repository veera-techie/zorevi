import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './components/common/PublicLayout';
import CustomerLayout from './components/common/CustomerLayout';
import DesignerLayout from './components/common/DesignerLayout';
import AdminLayout from './components/common/AdminLayout';

// Authentication Pages
import CustomerLogin from './modules/authentication/pages/CustomerLogin';
import CustomerRegister from './modules/authentication/pages/CustomerRegister';
import CustomerVerify from './modules/authentication/pages/CustomerVerify';
import CustomerForgotPassword from './modules/authentication/pages/CustomerForgotPassword';
import DesignerLogin from './modules/authentication/pages/DesignerLogin';
import DesignerApply from './modules/authentication/pages/DesignerApply';
import DesignerApplicationStatus from './modules/authentication/pages/DesignerApplicationStatus';
import DesignerForgotPassword from './modules/authentication/pages/DesignerForgotPassword';
import AdminLogin from './modules/authentication/pages/AdminLogin';
<<<<<<< HEAD
import AdminForgotPassword from './modules/authentication/pages/AdminForgotPassword';
import AccountTypeSelection from './modules/authentication/pages/AccountTypeSelection';
=======
>>>>>>> origin/sai

// Public & Customer Pages
import LandingPage from './modules/customer/pages/LandingPage';
import PublicDesigners from './modules/customer/pages/PublicDesigners';
import PublicDesignerProfile from './modules/customer/pages/PublicDesignerProfile';
import PublicMalls from './modules/customer/pages/PublicMalls';
import PublicMallDetails from './modules/customer/pages/PublicMallDetails';
<<<<<<< HEAD
import PublicDesignerDirectory from './modules/customer/pages/PublicDesignerDirectory';
import PublicDesignerDetail from './modules/customer/pages/PublicDesignerDetail';
import PublicMallDirectory from './modules/customer/pages/PublicMallDirectory';
import PublicMallDetail from './modules/customer/pages/PublicMallDetail';
import ForDesignersPage from './modules/customer/pages/ForDesignersPage';
import LegalPage from './modules/customer/pages/LegalPage';
=======
>>>>>>> origin/sai
import CategoriesPage from './modules/customer/pages/CategoriesPage';
import HowItWorksPage from './modules/customer/pages/HowItWorksPage';
import HelpPage from './modules/customer/pages/HelpPage';
import CustomerHome from './modules/customer/pages/CustomerHome';
import CustomerBookings from './modules/customer/pages/CustomerBookings';
import CustomerBookingDetails from './modules/customer/pages/CustomerBookingDetails';
import CustomerCheckout from './modules/customer/pages/CustomerCheckout';
import CustomerPaymentSuccess from './modules/customer/pages/CustomerPaymentSuccess';
import CustomerPaymentFailed from './modules/customer/pages/CustomerPaymentFailed';
import CustomerWishlist from './modules/customer/pages/CustomerWishlist';
import CustomerReviews from './modules/customer/pages/CustomerReviews';
import CustomerProfile from './modules/customer/pages/CustomerProfile';
import CustomerSettings from './modules/customer/pages/CustomerSettings';
import CustomerSupport from './modules/customer/pages/CustomerSupport';

// Designer Pages
import DesignerDashboard from './modules/designer/pages/DesignerDashboard';
import DesignerProfile from './modules/designer/pages/DesignerProfile';
import DesignerPortfolio from './modules/designer/pages/DesignerPortfolio';
import DesignerServices from './modules/designer/pages/DesignerServices';
import DesignerAvailability from './modules/designer/pages/DesignerAvailability';
import DesignerBookingRequests from './modules/designer/pages/DesignerBookingRequests';
import DesignerBookings from './modules/designer/pages/DesignerBookings';
import DesignerEarnings from './modules/designer/pages/DesignerEarnings';
import DesignerReviews from './modules/designer/pages/DesignerReviews';
import DesignerSettings from './modules/designer/pages/DesignerSettings';

// Admin Pages
import AdminDashboard from './modules/admin/pages/AdminDashboard';
import AdminVerification from './modules/admin/pages/AdminVerification';
import AdminOperations from './modules/admin/pages/AdminOperations';
import AdminMalls from './modules/admin/pages/AdminMalls';
import AdminServices from './modules/admin/pages/AdminServices';
import AdminSupportReviews from './modules/admin/pages/AdminSupportReviews';

// Shared Components
import BookingChat from './modules/shared/BookingChat';
import NotificationCenter from './modules/shared/NotificationCenter';
import NotFoundPage from './modules/shared/NotFoundPage';
import ForbiddenPage from './modules/shared/ForbiddenPage';

function App() {
  return (
    <Routes>
      {/* ========================================================
          1. PUBLIC ROUTES
          ======================================================== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
<<<<<<< HEAD
        <Route path="/explore/designers" element={<PublicDesignerDirectory />} />
        <Route path="/explore/designers/:designerId" element={<PublicDesignerDetail />} />
        <Route path="/designers/:id" element={<PublicDesignerDetail />} />
        <Route path="/explore/malls" element={<PublicMallDirectory />} />
        <Route path="/explore/malls/:mallId" element={<PublicMallDetail />} />
        <Route path="/malls/:id" element={<PublicMallDetail />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/for-designers" element={<ForDesignersPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/terms" element={<LegalPage document="terms" />} />
        <Route path="/privacy" element={<LegalPage document="privacy" />} />

      </Route>

      {/* Authentication pages use a dedicated full-screen brand layout. */}
      <Route path="/register" element={<AccountTypeSelection />} />
      <Route path="/customer/login" element={<CustomerLogin />} />
      <Route path="/customer/register" element={<CustomerRegister />} />
      <Route path="/customer/verify" element={<CustomerVerify />} />
      <Route path="/customer/forgot-password" element={<CustomerForgotPassword />} />
      <Route path="/designer/login" element={<DesignerLogin />} />
      <Route path="/designer/apply" element={<DesignerApply />} />
      <Route path="/designer/application-status" element={<DesignerApplicationStatus />} />
      <Route path="/designer/forgot-password" element={<DesignerForgotPassword />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />

=======
        <Route path="/explore/designers" element={<PublicDesigners />} />
        <Route path="/explore/designers/:designerId" element={<PublicDesignerProfile />} />
        <Route path="/explore/malls" element={<PublicMalls />} />
        <Route path="/explore/malls/:mallId" element={<PublicMallDetails />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/help" element={<HelpPage />} />

        {/* Public authentication and registration */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/verify" element={<CustomerVerify />} />
        <Route path="/customer/forgot-password" element={<CustomerForgotPassword />} />

        <Route path="/designer/login" element={<DesignerLogin />} />
        <Route path="/designer/apply" element={<DesignerApply />} />
        <Route path="/designer/application-status" element={<DesignerApplicationStatus />} />
        <Route path="/designer/forgot-password" element={<DesignerForgotPassword />} />

        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

>>>>>>> origin/sai
      {/* ========================================================
          2. CUSTOMER AUTHENTICATED ROUTES
          ======================================================== */}
      <Route path="/customer" element={<CustomerLayout />}>
        <Route index element={<CustomerHome />} />
        <Route path="designers" element={<PublicDesigners isCustomerView={true} />} />
        <Route path="designers/:designerId" element={<PublicDesignerProfile isCustomerView={true} />} />
        <Route path="malls" element={<PublicMalls isCustomerView={true} />} />
        <Route path="malls/:mallId" element={<PublicMallDetails isCustomerView={true} />} />
        <Route path="bookings" element={<CustomerBookings />} />
        <Route path="bookings/:bookingId" element={<CustomerBookingDetails />} />
        <Route path="bookings/:bookingId/messages" element={<BookingChat />} />
        <Route path="checkout" element={<CustomerCheckout />} />
        <Route path="payment/success" element={<CustomerPaymentSuccess />} />
        <Route path="payment/failed" element={<CustomerPaymentFailed />} />
        <Route path="wishlist" element={<CustomerWishlist />} />
        <Route path="reviews" element={<CustomerReviews />} />
        <Route path="messages" element={<BookingChat />} />
        <Route path="notifications" element={<NotificationCenter role="customer" />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="settings" element={<CustomerSettings />} />
        <Route path="support" element={<CustomerSupport />} />
      </Route>

      {/* ========================================================
          3. DESIGNER AUTHENTICATED ROUTES
          ======================================================== */}
      <Route path="/designer" element={<DesignerLayout />}>
        <Route index element={<DesignerDashboard />} />
        <Route path="profile" element={<DesignerProfile initialTab="profile" />} />
        <Route path="skills" element={<DesignerProfile initialTab="skills" />} />
        <Route path="experience" element={<DesignerProfile initialTab="experience" />} />
        <Route path="portfolio" element={<DesignerPortfolio />} />
        <Route path="services" element={<DesignerServices initialTab="services" />} />
        <Route path="pricing" element={<DesignerServices initialTab="pricing" />} />
        <Route path="availability" element={<DesignerAvailability />} />
        <Route path="booking-requests" element={<DesignerBookingRequests />} />
        <Route path="bookings" element={<DesignerBookings />} />
        <Route path="bookings/:bookingId" element={<CustomerBookingDetails isDesigner={true} />} />
        <Route path="bookings/:bookingId/messages" element={<BookingChat isDesigner={true} />} />
        <Route path="messages" element={<BookingChat isDesigner={true} />} />
        <Route path="earnings" element={<DesignerEarnings />} />
        <Route path="reviews" element={<DesignerReviews />} />
        <Route path="notifications" element={<NotificationCenter role="designer" />} />
        <Route path="settings" element={<DesignerSettings />} />
        <Route path="application-status" element={<DesignerApplicationStatus />} />
      </Route>

      {/* ========================================================
          4. ADMIN CONSOLE ROUTES
          ======================================================== */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="verification" element={<AdminVerification />} />
        <Route path="customers" element={<AdminOperations initialTab="customers" />} />
        <Route path="designers" element={<AdminOperations initialTab="designers" />} />
        <Route path="bookings" element={<AdminOperations initialTab="bookings" />} />
        <Route path="payments" element={<AdminOperations initialTab="payments" />} />
        <Route path="refunds" element={<AdminOperations initialTab="refunds" />} />
        <Route path="malls" element={<AdminMalls />} />
        <Route path="services" element={<AdminServices initialTab="services" />} />
        <Route path="categories" element={<AdminServices initialTab="categories" />} />
        <Route path="pricing" element={<AdminServices initialTab="pricing" />} />
        <Route path="commissions" element={<AdminServices initialTab="commissions" />} />
        <Route path="reviews" element={<AdminSupportReviews initialTab="reviews" />} />
        <Route path="support" element={<AdminSupportReviews initialTab="support" />} />
        <Route path="reports" element={<AdminSupportReviews initialTab="reports" />} />
        <Route path="settings" element={<AdminSupportReviews initialTab="settings" />} />
        <Route path="notifications" element={<NotificationCenter role="admin" />} />
      </Route>

      {/* ========================================================
          5. ERROR & FALLBACK ROUTES
          ======================================================== */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

