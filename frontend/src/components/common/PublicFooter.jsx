import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import './PublicFooter.css';

export default function PublicFooter({ role }) {
  const isCustomer = role === 'customer';
  const designersLink = isCustomer ? '/customer/designers' : '/explore/designers';
  const fashionHubsLink = isCustomer ? '/customer/fashion-hubs' : '/explore/fashion-hubs';
  const bookingsLink = isCustomer ? '/customer/bookings' : '/how-it-works';

  return (
    <footer className="zorevi-footer">
      <div className="zorevi-footer__inner container">
        <div className="zorevi-footer__grid">
          <div className="zorevi-footer__brand-col">
            <Link to={isCustomer ? '/customer' : '/'} className="zorevi-footer__logo" aria-label="Zorevi Homepage">
              <img
                src="/images/zorevi-logo.png"
                alt="Zorevi – Shopping | Happy | Stylish"
                className="zorevi-footer__logo-img"
              />
            </Link>
            <p className="zorevi-footer__desc">
              Discover top fashion designers and fashion hubs, book personalized styling sessions, and elevate your personal wardrobe for any occasion.
            </p>
            <div className="zorevi-footer__badge">
              <Sparkles size={14} /> Standard package from ₹499 / 2 hours · custom services may cost more
            </div>
          </div>

          <div className="zorevi-footer__col">
            <h4 className="zorevi-footer__title">Discover</h4>
            <ul className="zorevi-footer__links">
              <li><Link to={designersLink}>Explore Designers</Link></li>
              <li><Link to={fashionHubsLink}>Fashion Hubs</Link></li>
              <li><Link to="/categories">Fashion Categories</Link></li>
              <li><Link to={bookingsLink}>{isCustomer ? 'My Bookings' : 'How It Works'}</Link></li>
              <li><Link to="/for-designers">For Designers</Link></li>
            </ul>
          </div>

          <div className="zorevi-footer__col">
            <h4 className="zorevi-footer__title">For Designers</h4>
            <ul className="zorevi-footer__links">
              <li><Link to="/designer/apply">Apply as Designer</Link></li>
              <li><Link to="/designer/login">Designer Portal</Link></li>
              <li><Link to="/designer/application-status">Check Application Status</Link></li>
            </ul>
          </div>

          <div className="zorevi-footer__col">
            <h4 className="zorevi-footer__title">Support & Trust</h4>
            <ul className="zorevi-footer__links">
              <li><Link to="/help">Help Center</Link></li>
              {isCustomer ? (
                <>
                  <li><Link to="/customer/profile">My Profile</Link></li>
                  <li><Link to="/customer/settings">Settings</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/customer/login">Customer Sign In</Link></li>
                  <li><Link to="/customer/register">Create Account</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="zorevi-footer__bottom">
          <p>© {new Date().getFullYear()} Zorevi Technologies Pvt Ltd. All rights reserved.</p>
          <div className="zorevi-footer__legal">
            <Link to="/terms">Terms & Conditions</Link>
            <span>•</span>
            <Link to="/privacy">Privacy Policy</Link>
            <span>•</span>
            <span className="zorevi-footer__credit">
              Fashion for Everyone <Heart size={12} fill="#EC4899" color="#EC4899" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

