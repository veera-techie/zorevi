import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, LogIn } from 'lucide-react';

const ForbiddenPage = () => {
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
          backgroundColor: '#fef2f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          color: '#ef4444'
        }}
      >
        <ShieldAlert size={40} />
      </div>

      <h1
        style={{
          fontSize: '4.5rem',
          fontWeight: 900,
          color: '#ef4444',
          margin: '0 0 10px 0',
          lineHeight: 1
        }}
      >
        403
      </h1>

      <h2
        style={{
          fontSize: '1.8rem',
          fontWeight: 700,
          color: '#1e1b4b',
          margin: '0 0 12px 0'
        }}
      >
        Access Restricted
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
        You do not have the required permissions or authentication level to view this Zorevi administrative console or portal.
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
          to="/customer/login"
          className="zorevi-btn zorevi-btn--outline"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
        >
          <LogIn size={18} /> Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForbiddenPage;

