import { useState } from 'react';
import {
  HelpCircle, ChevronDown, ChevronUp, Mail, Phone,
  MessageSquare, ShieldCheck, Send, CheckCircle2
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Booking Question');
  const [message, setMessage] = useState('');
  const { addToast } = useApp();

  const faqs = [
    {
      q: 'How does the starting ₹499 / 2 hours package work?',
      a: 'The ₹499 package covers a 2-hour dedicated styling session with a verified fashion designer or stylist. It includes initial outfit discovery, body type & color analysis, and personal shopping guidance inside an agreed shopping mall or via an online video session.',
    },
    {
      q: 'Where do I meet my designer at the shopping mall?',
      a: 'Once your booking is confirmed, your in-app chat will display the designated meeting point inside the mall (typically the Ground Floor Main Atrium or Fashion Lounge). Both you and the designer can share your real-time arrival status directly in the chat.',
    },
    {
      q: 'What is the cancellation and refund policy?',
      a: 'You can cancel any booking free of charge up to 24 hours prior to the scheduled start time for a 100% refund. Cancellations within 24 hours may incur a small cancellation fee to compensate the stylist for their reserved time.',
    },
    {
      q: 'When does the booking conversation chat close?',
      a: 'To safeguard client and designer privacy, each in-app conversation automatically closes once the scheduled session ends (start time plus confirmed duration). The chat remains permanently viewable in read-only mode.',
    },
    {
      q: 'How do designers get verified on Zorevi?',
      a: 'Every designer undergoes a rigorous 5-step onboarding verification by our concierge team: government ID validation, business/studio verification, portfolio review, and customer service compliance check.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast('Please fill out all required fields', 'error');
      return;
    }
    addToast('Support ticket created. Our team will contact you within 2 hours.', 'success');
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
          Have questions about booking a stylist, meeting at the mall, or designer verification? We are here to help.
        </p>
      </div>

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
                    <div style={{ padding: '0 20px 20px', background: '#FAF5FF', fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.6' }}>
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
              Contact Concierge Support
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '24px' }}>
              Need urgent help regarding a live booking, meeting point, or refund?
            </p>

            <form onSubmit={handleSubmit}>
              <div className="zorevi-auth-field">
                <label>Your Name *</label>
                <input
                  type="text"
                  className="zorevi-input"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="zorevi-auth-field">
                <label>Email Address *</label>
                <input
                  type="email"
                  className="zorevi-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="zorevi-auth-field">
                <label>Topic / Issue Type</label>
                <select
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
                <label>Message *</label>
                <textarea
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

