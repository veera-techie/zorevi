import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px',
        backgroundColor: '#faf7fd'
      }}
    >
      <Link to="/" style={{ marginBottom: '28px', display: 'inline-block' }} aria-label="Zorevi Homepage">
        <img
          src="/images/zorevi-logo.png"
          alt="Zorevi – Shopping | Happy | Stylish"
          style={{ height: '46px', width: 'auto', objectFit: 'contain' }}
        />
      </Link>

      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#f5f3ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          color: '#7c3aed'
        }}
      >
        <Compass size={40} />
      </div>

      <h1
        style={{
          fontSize: '4.5rem',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 10px 0',
          lineHeight: 1
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: '1.8rem',
          fontWeight: 700,
          color: '#1e1b4b',
          margin: '0 0 12px 0'
        }}
      >
        This Style is Off the Runway
      </h2>

      <p
        style={{
          fontSize: '1rem',
          color: '#6b7280',
          maxWidth: '460px',
          margin: '0 0 30px 0',
          lineHeight: 1.6
        }}
      >
        We couldn't find the page or styling collection you are looking for. It may have been relocated, rescheduled, or discontinued.
      </p>

      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to="/"
          className="zorevi-btn zorevi-btn--primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
        >
          <Home size={18} /> Return to Home
        </Link>
        <Link
          to="/explore/designers"
          className="zorevi-btn zorevi-btn--outline"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
        >
          <Compass size={18} /> Explore Designers
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

