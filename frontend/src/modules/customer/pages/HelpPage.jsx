import { useState } from 'react';
import {
  ChevronDown, ChevronUp, Send,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { discoveryDemoNotice } from '../../../services/publicDiscoveryData';

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Booking & Scheduling');
  const [message, setMessage] = useState('');
  const { addToast } = useApp();

  const faqs = [
    {
      q: 'Is the ₹499 / 2 hours price a live offer?',
      a: 'No. It is an illustrative standard starting-package price shown in this prototype. Custom services may cost more; no service can be purchased here.',
    },
    {
      q: 'Are the designer profiles and reviews real?',
      a: 'No. Designer names, stock photos, specialties, verification states, ratings, reviews, prices and availability are illustrative sample data.',
    },
    {
      q: 'Does signing in or registering create an account?',
      a: 'No. Customer and designer authentication flows are local frontend demonstrations and do not create or authenticate a server account.',
    },
    {
      q: 'Can I book or pay for a styling session?',
      a: 'No real booking or payment is created. The screens are for demonstrating the intended customer journey only.',
    },
    {
      q: 'Are mall details and photos exact?',
      a: 'Mall names link to official venue websites. The listing photos are illustrative, not photos of the named malls. Check the official sites for current venue information.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast('Please fill out all required fields', 'error');
      return;
    }
    addToast('Demo only: your feedback was not sent to a support team.', 'info');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#1E1B4B', marginBottom: '8px' }}>
          Help & Support Center
        </h1>
        <p style={{ fontSize: '1rem', color: '#6B7280' }}>
          Find answers about the sample discovery experience and its demo-only account and booking flows.
        </p>
      </div>
      <p className="discovery-demo-notice" role="note">{discoveryDemoNotice} This page does not connect to a live support team.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
        {/* FAQs */}
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1E1B4B', marginBottom: '16px' }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isOpen ? '#FAF5FF' : '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      color: isOpen ? '#7C3AED' : '#1E1B4B',
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div id={`faq-answer-${idx}`} style={{ padding: '0 20px 20px', background: '#FAF5FF', fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.6' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1E1B4B', marginBottom: '6px' }}>
              Send prototype feedback
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '24px' }}>
              This form demonstrates the support experience. Submissions are not sent or stored on a support service.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="zorevi-auth-field">
                <label htmlFor="support-name">Your Name *</label>
                <input
                  id="support-name"
                  type="text"
                  className="zorevi-input"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="zorevi-auth-field">
                <label htmlFor="support-email">Email Address *</label>
                <input
                  id="support-email"
                  type="email"
                  className="zorevi-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="zorevi-auth-field">
                <label htmlFor="support-topic">Topic / Issue Type</label>
                <select
                  id="support-topic"
                  className="zorevi-input"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option>Booking & Scheduling</option>
                  <option>Mall Meeting Point Issue</option>
                  <option>Payment & Refund</option>
                  <option>Designer Verification</option>
                  <option>General Feedback</option>
                </select>
              </div>

              <div className="zorevi-auth-field">
                <label htmlFor="support-message">Message *</label>
                <textarea
                  id="support-message"
                  className="zorevi-textarea"
                  rows="4"
                  placeholder="Describe your issue or question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="zorevi-btn zorevi-btn--primary zorevi-btn--full">
                Submit Support Request <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

