# Zorevi – Fashion for Everyone

**Zorevi** is a responsive fashion marketplace prototype connecting customers with sample designer profiles and public mall information. Discovery, account, application, booking, and support interactions in this frontend are demonstrations; they do not create real accounts, bookings, payments, or support requests.

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
- **Photography & Avatars**: Locally stored Pexels stock photography for public discovery, with an asset and source guide at `public/assets/images/README.md`. Stock subjects are illustrative and do not represent or endorse named sample designers.

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
│   ├── assets/images/       # Local public discovery stock imagery and asset guide
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
- `/` — Customer-focused landing page with searchable, filterable sample designers and mall previews
- `/explore/designers` — Searchable, filterable and sortable sample designer directory with load more
- `/designers/:id` and `/explore/designers/:designerId` — Guest designer preview; full sample profile screens are gated behind customer sign-in
- `/explore/malls` — Searchable mall directory with illustrative photos and load more
- `/malls/:id` and `/explore/malls/:mallId` — Mall details with official-site and map links; photos are illustrative
- `/categories` — Styling categories for men, women, kids, couples, families, bridal, traditional and western styles
- `/how-it-works` — Separate customer and designer prototype journeys
- `/for-designers` — Designer information with separate application and sign-in actions
- `/help` — Prototype FAQs and a feedback form that does not send a support request
- `/terms` and `/privacy` — Prototype-only policy information; production policies require legal review

Designer profiles, photographs, verification states, ratings, reviews, distances, prices and availability are illustrative demo data. Mall names link to official venue websites; no unverified venue facts or designer-on-site claims are shown.

### 2. Authentication & Onboarding
- `/register` — Shared account entry where visitors choose customer registration or designer application
- `/customer/login` — Customer sign-in preview with email/mobile validation and clearly labeled demo authentication
- `/customer/register` — Customer registration with optional styling interests and required policy consent
- `/customer/verify` — Six-digit, browser-only verification demo with resend, invalid-code, and expiry states
- `/customer/forgot-password` — Customer password-recovery demo; no email or SMS is sent
- `/designer/login` — Designer studio sign-in preview and application links
- `/designer/apply` — Four-step designer application preview (Profile, Skills & Experience, Qualifications, Review)
- `/designer/application-status` — Local demo states for Submitted, Under Review, Approved, and Revision Needed
- `/designer/forgot-password` — Designer password-recovery demo
- `/admin/login` — Invitation-only Admin Console sign-in; there is no public admin registration
- `/admin/forgot-password` — Admin password-recovery demo

Authentication and onboarding interactions are frontend demos only. Verification codes, application status changes, and submissions are stored in the current browser session and are not sent to Zorevi services.

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
- **Mock Authentication**: Role-based access checks and login simulations are frontend-only. Public profile gating is a prototype UX, not a security boundary; a production backend must enforce authentication, customer/designer/admin roles, and access to protected profile, favorite, review, booking, and message data on every relevant API.
- **Payment Sandbox**: Checkout interactions simulate payment transactions via local state; no real credit card or UPI charges are made.

