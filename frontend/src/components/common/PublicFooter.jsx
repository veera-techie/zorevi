import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import './PublicFooter.css';

export default function PublicFooter() {
  return (
    <footer className="zorevi-footer">
      <div className="zorevi-footer__inner container">
        <div className="zorevi-footer__grid">
          <div className="zorevi-footer__brand-col">
            <Link to="/" className="zorevi-footer__logo">
              <svg viewBox="0 0 32 32" fill="none" width="30" height="30">
                <path d="M16 4C12 4 8 8 8 12c0 4 4 8 8 12 4-4 8-8 8-12 0-4-4-8-8-8z" fill="url(#footer-logo-g)"/>
                <path d="M8 12c-4 0-6 2-6 4s2 4 6 4c2 0 4-2 6-4-2-2-4-4-6-4z" fill="url(#footer-logo-g)" opacity="0.8"/>
                <path d="M24 12c4 0 6 2 6 4s-2 4-6 4c-2 0-4-2-6-4 2-2 4-4 6-4z" fill="url(#footer-logo-g)" opacity="0.8"/>
                <defs>
                  <linearGradient id="footer-logo-g" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#7C3AED"/>
                    <stop offset="1" stopColor="#A855F7"/>
                  </linearGradient>
                </defs>
              </svg>
              <div>
                <span className="zorevi-footer__brand-name">Zorevi</span>
                <span className="zorevi-footer__tagline">Fashion for Everyone</span>
              </div>
            </Link>
            <p className="zorevi-footer__desc">
              Discover top fashion designers and malls, book personalized styling sessions, and elevate your personal wardrobe for any occasion.
            </p>
            <div className="zorevi-footer__badge">
<<<<<<< HEAD
              <Sparkles size={14} /> Standard package from ₹499 / 2 hours · custom services may cost more
=======
              <Sparkles size={14} /> Packages starting at ₹499 / 2 hours
>>>>>>> origin/sai
            </div>
          </div>

          <div className="zorevi-footer__col">
            <h4 className="zorevi-footer__title">Discover</h4>
            <ul className="zorevi-footer__links">
              <li><Link to="/explore/designers">Explore Designers</Link></li>
              <li><Link to="/explore/malls">Nearby Malls</Link></li>
              <li><Link to="/categories">Fashion Categories</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
<<<<<<< HEAD
              <li><Link to="/for-designers">For Designers</Link></li>
=======
>>>>>>> origin/sai
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
              <li><Link to="/customer/login">Customer Sign In</Link></li>
              <li><Link to="/customer/register">Create Account</Link></li>
<<<<<<< HEAD
=======
              <li><Link to="/admin/login">Admin Console</Link></li>
>>>>>>> origin/sai
            </ul>
          </div>
        </div>

        <div className="zorevi-footer__bottom">
          <p>© {new Date().getFullYear()} Zorevi Technologies Pvt Ltd. All rights reserved.</p>
          <div className="zorevi-footer__legal">
<<<<<<< HEAD
            <Link to="/terms">Terms & Conditions</Link>
            <span>•</span>
            <Link to="/privacy">Privacy Policy</Link>
=======
            <Link to="/help">Terms & Conditions</Link>
            <span>•</span>
            <Link to="/help">Privacy Policy</Link>
>>>>>>> origin/sai
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

