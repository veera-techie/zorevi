# Zorevi – Fashion for Everyone

**Zorevi** is a modern, responsive fashion marketplace connecting customers with verified professional fashion designers, stylists, and premier shopping malls. Customers can discover designers, explore mall styling hubs, book personalized 2-hour styling sessions (starting at **₹499**), and communicate securely through booking-scoped live chats.

---

## 🎨 Design System & Visual Identity

The frontend faithfully replicates the Zorevi design specifications:
- **Brand Identity**: Signature Zorevi butterfly brand mark and "Fashion for Everyone" typography.
- **Color Palette**:
  - Soft Lavender & Bright White surfaces (`#FAF7FD`, `#F5F0FF`, `#FFFFFF`)
  - Primary Action Gradients: Rich Violet to Purple (`#7C3AED` → `#A855F7`)
  - Accent Tones: Soft Pink (`#F472B6`), Emerald Green (`#10B981`), Amber Gold (`#F59E0B`)
  - Text & Headings: Deep Indigo (`#1E1B4B`) for maximum contrast and readability.
- **Component Styling**: 16px–24px rounded cards, soft elevation shadows (`0 8px 30px rgba(124, 58, 237, 0.06)`), 44px+ touch targets, and accessible focus outlines.
- **Photography & Avatars**: Diverse representation across Men's, Women's, Kids', Couple, Family, and Bridal styling, with automatic graceful fallback handling (`ImageWithFallback`).

---

## 🚀 Quick Start & Development

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or pnpm

### Installation
```bash
cd frontend
npm install
```

### Run Local Development Server
```bash
npm run dev
```

The application runs strictly on port `5173`:
```
http://localhost:5173
```
> **Port Strictness**: Vite is configured with `strictPort: true`. If port `5173` is occupied, Vite will report an error instead of automatically jumping to another port, guaranteeing a consistent developer experience.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Project Architecture

The codebase is organized cleanly by roles and shared features:

```text
frontend/
├── public/
│   ├── images/              # Local images and placeholders
│   └── zorevi-icon.svg      # Zorevi butterfly brand mark
├── src/
│   ├── assets/              # Static styling assets and icons
│   ├── components/
│   │   ├── common/          # Role layouts (Public, Customer, Designer, Admin), Sidebars, Navbars, Badges, Modals
│   │   └── cards/           # DesignerCard, MallCard, BookingCard, BookingModal
│   ├── constants/           # Global design tokens, Indian cities, specializations, pricing rules
│   ├── context/
│   │   ├── AuthContext.jsx  # Mock authentication context supporting Customer, Designer, Admin roles
│   │   └── AppContext.jsx   # Global application state (Toasts, Wishlists, Notifications, City filters)
│   ├── modules/
│   │   ├── authentication/  # Role-specific login, registration, designer application & verification status
│   │   ├── customer/        # Customer discovery, bookings, checkout, reviews, and profile
│   │   ├── designer/        # Designer studio dashboard, portfolio, pricing, availability & requests
│   │   ├── admin/           # Super Admin console, verification queue, operations, malls & moderation
│   │   └── shared/          # In-app BookingChat, NotificationCenter, 404 & 403 error pages
│   ├── services/
│   │   ├── mockData.js      # Comprehensive realistic mock data for all roles and workflows
│   │   └── apiClient.js     # Decoupled mock API client (ready for backend substitution)
│   ├── utils/               # Currency formatting (₹ INR), date/time parsers, countdown timers
│   ├── App.jsx              # Unified React Router route tree
│   ├── main.jsx             # React entry point with providers
│   └── index.css            # Global CSS variables and design tokens
├── package.json
├── vite.config.js
└── .env.example
```

---

## 🧭 Comprehensive Route Directory

### 1. Public Discovery & Information
- `/` — Landing page with discovery hero, ₹499 package banner, categories, nearby designers, and mall preview
- `/explore/designers` — Searchable designer directory with city, occasion, and rating filters
- `/explore/designers/:designerId` — Detailed designer profile with services, portfolio, reviews, and booking modal
- `/explore/malls` — Mall discovery with fashion store counts and map preview
- `/explore/malls/:mallId` — Mall details, tenant store directories, and opening hours
- `/categories` — Comprehensive fashion category catalog (Men, Women, Kids, Couple, Family, Bridal)
- `/how-it-works` — Step-by-step customer and designer process guide
- `/help` — FAQ search and customer care contact options

### 2. Authentication & Onboarding
- `/customer/login` — Dedicated customer sign-in with email, OTP, or Google mock authentication
- `/customer/register` — Quick customer registration with personal styling preference questionnaire
- `/customer/verify` — OTP verification simulation
- `/customer/forgot-password` — Password reset flow
- `/designer/login` — Designer studio login
- `/designer/apply` — 5-step designer application (Profile, Skills & Services, Experience, Portfolio, Verification Docs)
- `/designer/application-status` — Application tracking page (Pending, Under Review, Approved)
- `/designer/forgot-password` — Designer account recovery
- `/admin/login` — Secure administrator access portal

### 3. Customer Dashboard & Experience
- `/customer` — Personalized customer dashboard with upcoming styling sessions, recommendations, and recent activity
- `/customer/designers` — Filterable designer marketplace
- `/customer/designers/:designerId` — Designer profile with instant 8-step booking flow
- `/customer/malls` — Shopping mall hub locator
- `/customer/malls/:mallId` — Detailed mall view
- `/customer/bookings` — Booking management tabbed by Upcoming, Pending, Completed, and Cancelled
- `/customer/bookings/:bookingId` — Comprehensive booking details with timeline, location card, and price breakdown
- `/customer/checkout` — Itemized checkout (Base session, Tax GST 18%, Convenience fee)
- `/customer/payment/success` — Simulated Razorpay payment success page
- `/customer/payment/failed` — Simulated payment failure with retry options
- `/customer/wishlist` — Saved designers, malls, and favorite styling looks
- `/customer/reviews` — Customer review history and submission modal
- `/customer/messages` — In-app booking chat list
- `/customer/bookings/:bookingId/messages` — Real-time booking conversation with active session countdown, location card, and arrival ping
- `/customer/notifications` — Notification center with unread tabs
- `/customer/profile` — Profile settings, preferred sizing, and measurements
- `/customer/settings` — Account preferences, payment methods, and notification toggles
- `/customer/support` — Customer dispute and support submission form

### 4. Designer Studio Portal
- `/designer` — Studio analytics, monthly earnings (₹84,650), upcoming sessions, and booking requests
- `/designer/profile` — Public profile and studio credentials editor
- `/designer/skills` — Skills and styling specializations manager
- `/designer/experience` — Work history, certifications, and portfolio achievements
- `/designer/portfolio` — Project image gallery and lookbook uploader
- `/designer/services` — Service catalog management and package editor
- `/designer/pricing` — Standard package configuration (₹499 starting baseline) and custom quotation editor
- `/designer/availability` — Interactive weekly calendar, time slot management, and vacation mode
- `/designer/booking-requests` — Inbound requests with Accept, Decline, and Counteroffer actions
- `/designer/bookings` — Booking history and active styling clients
- `/designer/bookings/:bookingId` — Client consultation details
- `/designer/bookings/:bookingId/messages` — In-app client chat with location card sharing
- `/designer/messages` — Client conversation list
- `/designer/earnings` — Financial ledger, commission deductions (12%), and payout status
- `/designer/reviews` — Client feedback and public response publisher
- `/designer/notifications` — Designer studio alerts and booking updates
- `/designer/settings` — Studio operating radius and bank account details

### 5. Super Admin Console
- `/admin` — High-level marketplace performance, registered metrics (24.6k customers, 1.2k designers), GMV revenue, and verification queue
- `/admin/verification` — Multi-document designer verification queue (Aadhaar, Studio proof, Portfolio review)
- `/admin/customers` — Customer database management, booking histories, and account status
- `/admin/designers` — Designer directory, commission overrides, and verification badges
- `/admin/bookings` — Global bookings ledger with manual status overrides
- `/admin/payments` — Transaction log with platform fee calculations and Razorpay sync
- `/admin/refunds` — Customer refund claims and dispute approvals
- `/admin/malls` — Partner mall directory and tenant store manager
- `/admin/services` — Platform service packages and categories manager
- `/admin/pricing` — Base package pricing rules (₹499 / 2 hours) and GST configuration
- `/admin/commissions` — Revenue share rates (12% standard, 10% VIP tier)
- `/admin/reviews` — Review moderation queue (approve/flag content)
- `/admin/support` — Customer support tickets and resolution SLA tracker
- `/admin/reports` — One-click CSV reports for bookings, revenue, and payouts
- `/admin/settings` — System health monitor and SOC-2 audit logs

---

## 💬 In-App Booking Chat Features

The confirmed booking chat (`BookingChat.jsx`) delivers the complete interactive experience shown in the reference designs:
1. **Header Details**: Displays the designer/customer name, service title, scheduled date, and duration.
2. **Active Session Countdown**: A live countdown timer (e.g. `01:57:26 remaining`) that updates continuously.
3. **Meeting Point Card**: Shows the designated mall, floor/atrium meeting point, and map view button.
4. **Arrival Ping**: One-tap action for users to notify the counterparty: *"I'm at the meeting point"*.
5. **Session Expiration & Read-Only State**: When a session ends or is marked completed, the chat automatically locks into a read-only state with a message stating *"This conversation is now read-only (The styling session has ended)"*.
6. **Support & Disputes**: Direct link to report an issue or file a dispute if an appointment is disrupted.

---

## 🔒 Security & Backend Boundary Disclaimers

- **Frontend Only**: This project contains client-side UI and state logic only. No backend server, database, payment secret keys, or real SMS gateways are initialized.
- **Mock Authentication**: Role-based access control and login simulations are managed through React Context (`AuthContext.jsx`) and browser memory. Real production security should be implemented via secure JWT/OAuth backend services.
- **Payment Sandbox**: Checkout interactions simulate payment transactions via local state; no real credit card or UPI charges are made.

