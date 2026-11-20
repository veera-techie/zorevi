import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Heart, MapPin, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import CustomerAccessDialog from '../common/CustomerAccessDialog';

export default function PublicDesignerCard({ designer, onBook }) {
  const { isCustomer } = useAuth();
  const { isInWishlist, toggleWishlist, addToast } = useApp();
  const [dialogIntent, setDialogIntent] = useState('details');
  const [dialogOpen, setDialogOpen] = useState(false);
  const isSaved = isCustomer && isInWishlist('designer', designer.id);
  const profileUrl = `/designers/${designer.id}`;

  const requestAccess = (intent) => {
    setDialogIntent(intent);
    setDialogOpen(true);
  };

  const handleFavorite = () => {
    if (!isCustomer) {
      requestAccess('favorite');
      return;
    }
    toggleWishlist('designer', designer.id);
    addToast(isSaved ? `Removed ${designer.name} from favorites` : `Saved ${designer.name} to favorites`, 'info');
  };

  const handleBook = () => {
    if (!isCustomer) {
      requestAccess('booking');
      return;
    }
    onBook?.(designer);
  };

  return (
    <>
      <article className="public-designer-card">
        <div className="public-designer-card__image-wrap">
          <Link to={profileUrl} aria-label={`Preview ${designer.name}'s profile`}>
            <img className="public-designer-card__image" src={designer.image} alt={`Illustrative stock portrait for demo profile ${designer.name}`} loading="lazy" />
          </Link>
          <span className="public-designer-card__verified"><CheckCircle2 size={13} /> Demo verified</span>
          <button
            type="button"
            className={`public-designer-card__favorite ${isSaved ? 'is-saved' : ''}`}
            onClick={handleFavorite}
            aria-label={isSaved ? `Remove ${designer.name} from favorites` : `Save ${designer.name} to favorites`}
            aria-pressed={isSaved}
          >
            <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="public-designer-card__content">
          <div className="public-designer-card__title-row">
            <h3><Link to={profileUrl}>{designer.name}</Link></h3>
            <span className="public-designer-card__rating" title="Illustrative demo rating">
              <Star size={14} fill="currentColor" /> {designer.rating.toFixed(1)}
            </span>
          </div>
          <p className="public-designer-card__role">{designer.title}</p>
          <div className="public-designer-card__meta">
            <span><MapPin size={14} /> {designer.area}, {designer.location}</span>
            <span>{designer.experience}</span>
          </div>
          <div className="public-designer-card__tags" aria-label="Specializations">
            {designer.specializations.slice(0, 2).map((specialization) => (
              <span key={specialization}>{specialization}</span>
            ))}
          </div>
          <div className="public-designer-card__price">
            <span>Sample starting price</span>
            <strong>₹{designer.startingPrice} <small>/ 2 hours</small></strong>
          </div>
          <div className="public-designer-card__actions">
            <Link to={profileUrl} className="zorevi-btn zorevi-btn--outline">View details</Link>
            <button type="button" className="zorevi-btn zorevi-btn--primary public-book-button" onClick={handleBook}>Book now</button>
          </div>
        </div>
      </article>
      <CustomerAccessDialog
        designer={designer}
        intent={dialogIntent}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
