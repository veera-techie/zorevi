import { Link } from 'react-router-dom';
import {
  Search, Calendar, MessageSquare, Sparkles, UserCheck, Scissors,
  DollarSign, ShieldCheck, ArrowRight, CheckCircle2
} from 'lucide-react';

export default function HowItWorksPage() {
  const customerSteps = [
    {
      num: '01',
      title: 'Discover Stylists & Designers',
      desc: 'Browse hundreds of verified fashion designers, personal stylists, and top shopping malls in your city. Filter by occasion, aesthetic, and transparent pricing starting at ₹499/2 hours.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Book a Session with Clear Pricing',
      desc: 'Select your preferred service, date, duration, and shopping mall or online video session. Review an itemized breakdown with zero hidden fees and free cancellation up to 24 hours.',
      icon: Calendar,
    },
    {
      num: '03',
      title: 'Coordinate in Real-Time Chat',
      desc: 'Once confirmed, join the private booking chat to share your fashion preferences, confirm mall meeting spots, and receive arrival updates.',
      icon: MessageSquare,
    },
    {
      num: '04',
      title: 'Shop & Style with Confidence',
      desc: 'Meet your dedicated designer at the agreed mall lounge. Enjoy expert outfit curations, try on curated pieces, and walk away looking your absolute best.',
      icon: Sparkles,
    },
  ];

  const designerSteps = [
    {
      num: '01',
      title: 'Apply & Verify Credentials',
      desc: 'Submit your portfolio, experience, and ID proofs. Our concierge team reviews applications within 24 to 48 hours to grant your Verified badge.',
      icon: UserCheck,
    },
    {
      num: '02',
      title: 'Publish Packages & Availability',
      desc: 'Set standard rates (starting at ₹499 for 2 hours) or craft bespoke packages for weddings, red carpets, and bridal trousseaus.',
      icon: Scissors,
    },
    {
      num: '03',
      title: 'Accept Requests & Meet Clients',
      desc: 'Manage booking requests, chat with confirmed clients, propose meeting spots in top shopping malls, and deliver world-class styling.',
      icon: Calendar,
    },
    {
      num: '04',
      title: 'Receive Fast, Secure Payouts',
      desc: 'Earnings are transferred directly to your bank account upon session completion, with transparent 12% platform commission and instant invoice records.',
      icon: DollarSign,
    },
  ];

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          THE ZOREVI EXPERIENCE
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1E1B4B', margin: '8px 0 12px' }}>
          How Zorevi Works
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#4B5563', lineHeight: '1.5' }}>
          Connecting fashion lovers with verified designers and shopping malls for seamless styling sessions.
        </p>
      </div>

      {/* For Customers */}
      <div style={{ background: '#FFFFFF', borderRadius: '28px', border: '1px solid #F3F4F6', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7C3AED', textTransform: 'uppercase' }}>FOR CUSTOMERS</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1E1B4B', margin: '4px 0 0' }}>How to Book a Stylist</h2>
          </div>
          <Link to="/explore/designers" className="zorevi-btn zorevi-btn--primary">
            Explore Designers <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {customerSteps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.num} style={{ background: '#FAFAFC', padding: '24px', borderRadius: '18px', border: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#DDD6FE', display: 'block', marginBottom: '8px' }}>{s.num}</span>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F5F0FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: '1.5', margin: 0 }}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* For Designers */}
      <div style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)', borderRadius: '28px', border: '1px solid #E9D5FF', padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7C3AED', textTransform: 'uppercase' }}>FOR DESIGNERS & STYLISTS</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1E1B4B', margin: '4px 0 0' }}>Grow Your Styling Business</h2>
          </div>
          <Link to="/designer/apply" className="zorevi-btn zorevi-btn--primary">
            Apply as Designer <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {designerSteps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.num} style={{ background: '#FFFFFF', padding: '24px', borderRadius: '18px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#C4B5FD', display: 'block', marginBottom: '8px' }}>{s.num}</span>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F5F0FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#4B5563', lineHeight: '1.5', margin: 0 }}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

