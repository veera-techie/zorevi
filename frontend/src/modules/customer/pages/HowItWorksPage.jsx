import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Search, ShieldCheck, UserRoundPlus } from 'lucide-react';
import { discoveryDemoNotice } from '../../../services/publicDiscoveryData';
import './PublicDiscovery.css';

const customerSteps = [
  { icon: Search, title: 'Explore previews', text: 'Search sample designer profiles, compare specialties and browse public mall information.' },
  { icon: UserRoundPlus, title: 'Choose your customer path', text: 'Create a customer account or sign in to access the prototype’s full profile and booking screens.' },
  { icon: CalendarDays, title: 'Plan a styling session', text: 'Review the sample services and move through the demo booking flow. No real appointment or payment is created.' },
];

const designerSteps = [
  { icon: UserRoundPlus, title: 'Apply separately', text: 'Use the designer application, not customer registration, to share profile, skills and portfolio details.' },
  { icon: ShieldCheck, title: 'Wait for review', text: 'Applications are intended to be reviewed before booking access is enabled. The prototype does not perform a real review.' },
  { icon: CalendarDays, title: 'Use the studio preview', text: 'Designer sign-in opens the sample studio flow; it does not grant production access or receive real bookings.' },
];

function StepGroup({ title, steps, action, to }) {
  return (
    <section className="public-steps-panel">
      <div className="public-section-heading">
        <div><p className="discovery-eyebrow">A separate journey</p><h2>{title}</h2></div>
        <Link to={to} className="zorevi-btn zorevi-btn--outline">{action} <ArrowRight size={15} /></Link>
      </div>
      <ol className="public-step-grid">
        {steps.map(({ icon: Icon, title: stepTitle, text }, index) => (
          <li key={stepTitle} className="public-info-card">
            <span className="public-step-number">0{index + 1}</span>
            <span className="public-info-card__icon"><Icon size={20} /></span>
            <h3>{stepTitle}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="discovery-page public-info-page">
      <header className="public-info-hero">
        <p className="discovery-eyebrow">Fashion for everyone</p>
        <h1>One place to explore. Two clear ways to join.</h1>
        <p>Customers discover styling options. Designers have a separate application and studio sign-in. This page describes the intended experience in the Zorevi prototype.</p>
      </header>
      <p className="discovery-demo-notice" role="note">{discoveryDemoNotice} All account, booking and application interactions shown here are frontend demos.</p>
      <div className="public-steps-stack">
        <StepGroup title="For customers" steps={customerSteps} action="Explore designers" to="/explore/designers" />
        <StepGroup title="For designers" steps={designerSteps} action="For Designers" to="/for-designers" />
      </div>
    </main>
  );
}
