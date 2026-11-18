import { Link } from 'react-router-dom';
import { LockKeyhole, ArrowRight } from 'lucide-react';
import Modal from './Modal';
import { designerDestination, withReturnTo } from '../../utils/authNavigation';

export default function CustomerAccessDialog({ designer, intent = 'details', isOpen, onClose }) {
  const returnTo = designerDestination(designer.id, intent);
  const actionText = intent === 'booking'
    ? 'Sign in to continue to a booking with this designer.'
    : intent === 'favorite'
      ? 'Sign in to save this designer to your favorites.'
      : 'Sign in to see this designer’s full profile, portfolio, services and reviews.';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Continue with a customer account" maxWidth="480px">
      <div className="zorevi-access-dialog">
        <div className="zorevi-access-dialog__icon" aria-hidden="true"><LockKeyhole size={21} /></div>
        <p>{actionText}</p>
        <p className="zorevi-access-dialog__note">
          You’ll return to {designer.name} after sign-in or demo registration. Authentication in this prototype is not real.
        </p>
        <div className="zorevi-access-dialog__actions">
          <Link className="zorevi-btn zorevi-btn--primary zorevi-btn--full" to={withReturnTo('/customer/register', returnTo)}>
            Create customer account <ArrowRight size={16} />
          </Link>
          <Link className="zorevi-btn zorevi-btn--outline zorevi-btn--full" to={withReturnTo('/customer/login', returnTo)}>
            Sign in
          </Link>
          <button type="button" className="zorevi-btn zorevi-btn--quiet zorevi-btn--full" onClick={onClose}>
            Continue exploring
          </button>
        </div>
      </div>
    </Modal>
  );
}
