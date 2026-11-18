import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, Banknote, Briefcase, CalendarDays, CheckCircle2,
  Clock3, Eye, Heart, LockKeyhole, MapPin, Pencil, ShieldCheck, Star,
  TrendingUp, Users,
} from 'lucide-react';
import { mockDesigners, mockBookings, mockMalls } from '../../../services/mockData';
import { useApp } from '../../../context/AppContext';
import { AAROHI_PROFILE_IMAGE, loadAarohiProfileImage } from '../../../utils/aarohiProfileImage';
import './DesignerPages.css';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const loadSavedProfile = () => {
  try { return JSON.parse(localStorage.getItem('zorevi-designer-profile') || '{}') || {}; }
  catch { return {}; }
};

const loadStoredJson = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; }
  catch { return fallback; }
};

export default function DesignerDashboard() {
  const { addToast } = useApp();
  const [savedProfile, setSavedProfile] = useState(loadSavedProfile);
  const [mallOverrides] = useState(() => loadStoredJson('zorevi-designer-mall-overrides', {}));
  const [customMalls] = useState(() => loadStoredJson('zorevi-designer-custom-malls', []));
  const [selectedMallIds, setSelectedMallIds] = useState(savedProfile.availableMallIds || []);
  const [draftMallIds, setDraftMallIds] = useState(savedProfile.availableMallIds || []);
  const [isEditingLocations, setIsEditingLocations] = useState(false);
  const designer = { ...mockDesigners[0], ...savedProfile };
  const profilePhoto = loadAarohiProfileImage();
  const availableMalls = [...mockMalls, ...customMalls].map((mall) => ({ ...mall, ...(mallOverrides[mall.id] || {}) })).filter((mall) => mall.fashionStores > 0);
  const selectedMalls = availableMalls.filter((mall) => selectedMallIds.includes(mall.id));
  const socialLinks = Object.entries(savedProfile.socialAccounts || {}).filter(([, url]) => url);

  const saveMallLocations = () => {
    const updatedProfile = { ...savedProfile, availableMallIds: draftMallIds };
    try {
      localStorage.setItem('zorevi-designer-profile', JSON.stringify(updatedProfile));
      setSavedProfile(updatedProfile);
      setSelectedMallIds(draftMallIds);
      setIsEditingLocations(false);
      addToast('Mall locations saved to your profile.', 'success');
    } catch {
      addToast('Could not save mall locations in this browser.', 'error');
    }
  };
  const bookings = mockBookings.slice(0, 4);
  const photos = [
    { title: 'Bridal Elegance', image: '/images/portfolio-bridal-hd.jpg' },
    { title: 'Modern Classics', image: '/images/portfolio-classics-hd.jpg' },
    { title: 'Family Styling', image: '/images/portfolio-family-hd.jpg' },
  ];
  const metrics = [
    { label: 'Total bookings', value: designer.totalBookings, change: '+12.8%', icon: CalendarDays },
    { label: 'Upcoming bookings', value: String(designer.upcomingBookings).padStart(2, '0'), note: 'Scheduled', icon: Clock3 },
    { label: 'Completed bookings', value: designer.completedBookings, change: '+8.2%', icon: CheckCircle2 },
    { label: 'Total earnings', value: money(designer.totalEarnings), change: '+18.4%', icon: Banknote },
    { label: 'Average rating', value: `${designer.rating}/5`, rating: true, icon: Star },
    { label: 'Profile views', value: designer.profileViews.toLocaleString('en-IN'), change: '+24.6%', icon: Eye },
  ];

  return (
    <div className="zorevi-designer-dash">
      <section className="studio-hero" aria-label="Welcome banner">
        <div className="studio-hero__copy">
          <span className="studio-eyebrow">YOUR CREATIVE STUDIO</span>
          <h1>Welcome back, {designer.name.split(' ')[0]}</h1>
          <p>Your fashion studio, clients, and bookings at a glance.</p>
          <Link to="/designer/services" className="studio-hero__button">Manage your services <ArrowRight size={15} /></Link>
        </div>
        <img src="/images/hero-banner-group-generated.png" alt="Models in festive Indian fashion" />
      </section>

      <section className="studio-metrics" aria-label="Performance metrics">
        {metrics.map(({ label, value, change, note, rating, icon: Icon }) => (
          <article className="studio-metric" key={label}>
            <div className="studio-metric__top"><span className="studio-icon"><Icon size={17} /></span>
              {change && <span className="studio-growth"><TrendingUp size={12} />{change}</span>}
            </div>
            <span className="studio-metric__label">{label}</span>
            <strong className="studio-metric__value">{value}</strong>
            {rating ? <span className="studio-stars" aria-label="5 star rating">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={11} fill="currentColor" />)}</span> : note && <span className="studio-metric__note">{note}</span>}
          </article>
        ))}
      </section>

      <section className="studio-overview" aria-label="Designer studio overview">
        <article className="studio-card studio-profile">
          <div className="studio-profile__identity">
            <img src={profilePhoto} alt={designer.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = AAROHI_PROFILE_IMAGE; }} />
            <div><h2>{designer.name} <BadgeCheck size={16} /></h2><p>{designer.title}</p><span><MapPin size={13} /> {designer.location} · {designer.serviceRadius}</span><span><Briefcase size={13} /> {designer.experience} experience</span><span><Star size={13} fill="currentColor" /> {designer.rating} <small>({designer.reviewCount.toLocaleString('en-IN')} reviews)</small></span></div>
          </div>
          {designer.bio && <p className="studio-profile__bio">{designer.bio}</p>}
          {selectedMalls.length > 0 && <div className="studio-profile__mall-list"><small>Available at</small>{selectedMalls.slice(0, 2).map((mall) => <span key={mall.id}><img src={mall.image} alt="" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/mall-lakeside.jpg'; }} /><small>{mall.name}</small></span>)}{selectedMalls.length > 2 && <b>+{selectedMalls.length - 2}</b>}</div>}
          <div className="studio-progress-label"><strong>Profile completion</strong><b>{designer.profileCompletion}%</b></div>
          <div className="studio-progress"><span style={{ width: `${designer.profileCompletion}%` }} /></div>
          <div className="studio-tags">{designer.specializations.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
          {socialLinks.length > 0 && <div className="studio-social-links">{socialLinks.map(([network, url]) => <a href={url} key={network} target="_blank" rel="noreferrer">{network}</a>)}</div>}
          <Link to="/designer/profile" className="studio-outline-button">Edit profile <ArrowRight size={14} /></Link>
        </article>

        <article className="studio-card studio-earnings">
          <div className="studio-card__heading"><div><span className="studio-kicker">PERFORMANCE</span><h2>Monthly earnings</h2></div><span className="studio-period">This month</span></div>
          <div className="studio-earnings__total">{money(designer.monthlyEarnings)} <span><TrendingUp size={13} /> +{designer.earningsChange}%</span></div>
          <p className="studio-muted">Your earnings are trending up this month</p>
          <div className="studio-chart" role="img" aria-label="Earnings trend rising from June through November">
            <div className="studio-chart__grid"><i /><i /><i /></div>
            <svg viewBox="0 0 480 150" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="studio-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8054d8" stopOpacity=".28"/><stop offset="1" stopColor="#8054d8" stopOpacity="0"/></linearGradient></defs><path d="M0 126 C42 112 50 100 96 108 S160 75 192 83 S253 63 288 72 S355 35 384 49 S441 18 480 10 L480 150 L0 150Z" fill="url(#studio-fill)"/><path d="M0 126 C42 112 50 100 96 108 S160 75 192 83 S253 63 288 72 S355 35 384 49 S441 18 480 10" fill="none" stroke="#7043c5" strokeWidth="3" vectorEffect="non-scaling-stroke"/><circle cx="480" cy="10" r="5" fill="#7043c5" stroke="white" strokeWidth="3" vectorEffect="non-scaling-stroke"/></svg>
          </div>
          <div className="studio-chart__months"><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span></div>
          <div className="studio-status"><span><i className={designer.isOnline ? 'online' : ''} />Studio status</span><button onClick={() => addToast('Studio availability can be updated in your availability settings.', 'info')}>{designer.isOnline ? 'Online · accepting bookings' : 'Offline'}</button></div>
        </article>

        <div className="studio-side-stack">
          <article className="studio-promo">
            <div className="studio-promo__copy"><span>POPULAR STARTER PACKAGE</span><h2>Style starts at <strong>₹499</strong></h2><p>Make it easy for new clients to discover your styling services.</p><Link to="/designer/pricing">Manage package rates <ArrowRight size={14} /></Link></div>
            <img src="/images/promo-model.png" alt="Fashion model wearing a festive outfit" />
          </article>
          <article className="studio-card studio-portfolio">
            <div className="studio-card__heading"><div><span className="studio-kicker">YOUR LATEST WORK</span><h2>Portfolio highlights</h2></div><Link to="/designer/portfolio" aria-label="View portfolio"><ArrowRight size={16} /></Link></div>
            <div className="studio-portfolio__items">{photos.map((photo) => <Link to="/designer/portfolio" key={photo.title}><img src={photo.image} alt={photo.title} /><span>{photo.title}</span></Link>)}</div>
          </article>
        </div>
      </section>

      <section className="studio-card studio-malls" aria-label="Designer mall locations">
        <div className="studio-card__heading">
          <div><span className="studio-kicker">IN-PERSON STYLING</span><h2>Where clients can meet me</h2><p>{selectedMalls.length ? `${selectedMalls.length} mall location${selectedMalls.length === 1 ? '' : 's'} selected` : 'Choose the fashion malls where you are available.'}</p></div>
          <button className="studio-text-link studio-malls__edit" onClick={() => { setDraftMallIds(selectedMallIds); setIsEditingLocations((open) => !open); }}><Pencil size={13} />{isEditingLocations ? 'Close editor' : 'Edit locations'}</button>
        </div>
        {isEditingLocations && <div className="studio-malls__editor">
          {availableMalls.map((mall) => <label key={mall.id}><input type="checkbox" checked={draftMallIds.includes(mall.id)} onChange={() => setDraftMallIds((ids) => ids.includes(mall.id) ? ids.filter((id) => id !== mall.id) : [...ids, mall.id])} /><span><strong>{mall.name}</strong><small>{mall.address}</small></span></label>)}
          <div className="studio-malls__actions"><button className="studio-malls__cancel" onClick={() => { setDraftMallIds(selectedMallIds); setIsEditingLocations(false); }}>Cancel</button><button className="studio-malls__save" onClick={saveMallLocations}>Save locations</button></div>
        </div>}
        {selectedMalls.length ? <div className="studio-malls__grid">{selectedMalls.map((mall) => <article className="studio-mall-card" key={mall.id}><img src={mall.image} alt={mall.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/mall-lakeside.jpg'; }} /><div><strong>{mall.name}</strong><span><MapPin size={12} />{mall.address}</span><small>{mall.fashionStores} fashion stores</small></div></article>)}</div> : !isEditingLocations && <div className="studio-malls__empty">No mall locations selected yet. Choose the places where clients can meet you.</div>}
      </section>

      <section className="studio-card studio-bookings" aria-label="Recent booking activity">
        <div className="studio-card__heading studio-bookings__heading"><div><span className="studio-kicker">KEEP THINGS MOVING</span><h2>Recent booking activity</h2><p>Stay up to date with your styling sessions and client requests.</p></div><Link to="/designer/bookings" className="studio-text-link">View all bookings <ArrowRight size={14} /></Link></div>
        <div className="studio-table-scroll"><table><thead><tr><th>Customer</th><th>Service</th><th>Date</th><th>Amount</th><th>Status</th><th /></tr></thead><tbody>
          {bookings.map((booking) => <tr key={booking.id}><td><div className="studio-customer"><span>{booking.customerName.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><strong>{booking.customerName}</strong></div></td><td>{booking.service}</td><td>{new Date(`${booking.date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {booking.startTime}</td><td className="studio-amount">{money(booking.amount)}</td><td><span className={`studio-booking-status ${booking.status.toLowerCase()}`}>{booking.status}</span></td><td><Link to="/designer/bookings" className="studio-row-link" aria-label={`View ${booking.customerName}'s booking`}><ArrowRight size={15} /></Link></td></tr>)}
        </tbody></table></div>
      </section>

      <section className="studio-trust" aria-label="Platform benefits">
        <div><span><ShieldCheck size={19} /></span><p><strong>Verified designer</strong><small>Trusted by clients</small></p></div>
        <div><span><LockKeyhole size={18} /></span><p><strong>Secure payments</strong><small>Protected transactions</small></p></div>
        <div><span><Heart size={18} /></span><p><strong>Loved by customers</strong><small>{designer.rating} average rating</small></p></div>
        <Link to="/designer/booking-requests"><span><Users size={18} /></span><p><strong>Ready for your next booking?</strong><small>Review new client requests</small></p><ArrowRight size={16} /></Link>
      </section>
    </div>
  );
}
