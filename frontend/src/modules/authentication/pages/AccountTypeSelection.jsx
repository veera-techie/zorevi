import { Link } from 'react-router-dom';
import { ArrowRight, Palette, Sparkles } from 'lucide-react';
import { AuthShell } from '../AuthShell';

export default function AccountTypeSelection() {
  return (
    <AuthShell>
      <p className="zorevi-auth-progress">Get started · choose your path</p>
      <header className="zorevi-auth-form-header">
        <h2 className="zorevi-auth-form-title">Join Zorevi</h2>
        <p className="zorevi-auth-form-sub">Choose how you’d like to be part of a more personal fashion experience.</p>
      </header>

      <div className="zorevi-auth-role-grid" aria-label="Choose an account type">
        <Link to="/customer/register" className="zorevi-auth-role-card">
          <span className="zorevi-auth-role-icon"><Sparkles size={21} aria-hidden="true" /></span>
          <span className="zorevi-auth-role-kicker">For customers</span>
          <h3>Find your style</h3>
          <p>Discover designers, get inspired, and create looks for every occasion.</p>
          <span className="zorevi-auth-role-action">Create a customer account <ArrowRight size={16} aria-hidden="true" /></span>
        </Link>

        <Link to="/designer/apply" className="zorevi-auth-role-card">
          <span className="zorevi-auth-role-icon"><Palette size={21} aria-hidden="true" /></span>
          <span className="zorevi-auth-role-kicker">For designers</span>
          <h3>Share your craft</h3>
          <p>Apply to join Zorevi, showcase your work, and connect with clients.</p>
          <span className="zorevi-auth-role-action">Apply as a designer <ArrowRight size={16} aria-hidden="true" /></span>
        </Link>
      </div>

      <p className="zorevi-auth-note zorevi-auth-role-review">
        Designer applications are reviewed before booking access is enabled.
      </p>
      <div className="zorevi-auth-role-signin">
        <span>Already have an account?</span>
        <Link to="/customer/login" className="zorevi-auth-link">Customer sign in</Link>
        <span aria-hidden="true">·</span>
        <Link to="/designer/login" className="zorevi-auth-link">Designer studio sign in</Link>
      </div>
    </AuthShell>
  );
}
