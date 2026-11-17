import React from 'react';
import HeroBanner from '../components/HeroBanner';
import KpiMetricsRow from '../components/KpiMetricsRow';
import DesignerProfileCard from '../components/DesignerProfileCard';
import MonthlyEarningsChart from '../components/MonthlyEarningsChart';
import PromoPackageCard from '../components/PromoPackageCard';
import PortfolioHighlightsCard from '../components/PortfolioHighlightsCard';
import RecentBookingsTable from '../components/RecentBookingsTable';
import TrustBadgesRow from '../components/TrustBadgesRow';

const Dashboard = () => {
  return (
    <div className="space-y-5 sm:space-y-6 pb-6 animate-in fade-in duration-300">
      {/* 1. Hero Welcome Banner */}
      <section aria-label="Welcome Banner">
        <HeroBanner />
      </section>

      {/* 2. 6-Column KPI Metrics Row */}
      <section aria-label="KPI Performance Metrics">
        <KpiMetricsRow />
      </section>

      {/* 3. Middle 3-Column Bento Grid */}
      <section aria-label="Designer Studio Overview">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Left Card: Designer Profile Summary (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col">
            <DesignerProfileCard />
          </div>

          {/* Center Card: Monthly Earnings Area Chart (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col">
            <MonthlyEarningsChart />
          </div>

          {/* Right Stack: Promo Card + Portfolio Highlights (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col gap-4 justify-between">
            <PromoPackageCard />
            <PortfolioHighlightsCard />
          </div>
        </div>
      </section>

      {/* 4. Bottom Section: Recent Booking Activity Table */}
      <section aria-label="Recent Booking Activity">
        <RecentBookingsTable />
      </section>

      {/* 5. Bottom Trust & Next Booking Strip (4-column row) */}
      <section aria-label="Platform Trust & Next Appointment">
        <TrustBadgesRow />
      </section>
    </div>
  );
};

export default Dashboard;
