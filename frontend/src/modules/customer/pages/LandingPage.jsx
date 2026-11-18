import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Search, Sparkles } from 'lucide-react';
import BookingModal from '../../../components/cards/BookingModal';
import PublicDesignerCard from '../../../components/cards/PublicDesignerCard';
import PublicMallCard from '../../../components/cards/PublicMallCard';
import { useApp } from '../../../context/AppContext';
import { discoveryCategories, discoveryDemoNotice, publicDesigners, publicMalls } from '../../../services/publicDiscoveryData';
import './LandingPage.css';

export default function LandingPage() {
  const { selectedCity } = useApp();
  const homeRef = useRef(null);
  const cursorRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [bookingDesigner, setBookingDesigner] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const home = homeRef.current;
    const cursor = cursorRef.current;
    const supportsDecorativeCursor = window.matchMedia(
      '(pointer: fine) and (prefers-reduced-motion: no-preference)',
    ).matches;

    if (!home || !cursor || !supportsDecorativeCursor) return undefined;

    const handlePointerMove = (event) => {
      cursor.style.left = `${event.clientX + 16}px`;
      cursor.style.top = `${event.clientY + 13}px`;
      cursor.classList.add('is-visible');
    };
    const handlePointerLeave = () => cursor.classList.remove('is-visible');

    home.addEventListener('pointermove', handlePointerMove, { passive: true });
    home.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      home.removeEventListener('pointermove', handlePointerMove);
      home.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  const filteredDesigners = useMemo(() => {
    const category = discoveryCategories.find((item) => item.id === selectedCategory) || discoveryCategories[0];
    const query = searchQuery.trim().toLowerCase();
    return publicDesigners
      .filter((designer) => designer.location.toLowerCase() === selectedCity.toLowerCase())
      .filter((designer) => !query || [
        designer.name,
        designer.title,
        designer.location,
        designer.area,
        ...designer.specializations,
      ].some((value) => value.toLowerCase().includes(query)))
      .filter((designer) => !category.terms.length
        || category.terms.some((term) => designer.specializations.some((specialization) => specialization.toLowerCase() === term)))
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-low') return a.startingPrice - b.startingPrice;
        if (sortBy === 'price-high') return b.startingPrice - a.startingPrice;
        if (sortBy === 'experience') return b.yearsExperience - a.yearsExperience;
        return 0;
      });
  }, [searchQuery, selectedCategory, selectedCity, sortBy]);

  const handleBook = (designer) => {
    setBookingDesigner(designer);
    setBookingOpen(true);
  };

  return (
    <main className="public-home" ref={homeRef}>
      <div className="public-home__ambience" aria-hidden="true">
        <Sparkles className="public-home__ambient-star public-home__ambient-star--one" />
        <Sparkles className="public-home__ambient-star public-home__ambient-star--two" />
        <Sparkles className="public-home__ambient-star public-home__ambient-star--three" />
      </div>
      <div className="public-home__cursor" ref={cursorRef} aria-hidden="true">
        <svg viewBox="0 0 40 40" focusable="false">
          <path d="M18.5 18.5C16.2 9.4 8.5 5.8 5.4 9.4c-3.1 3.7 1.8 10.1 12.1 11.7C7.2 23 5.5 29.8 9.5 32.4c3.8 2.4 9.3-2.7 10.5-10.4 1.2 7.7 6.7 12.8 10.5 10.4 4-2.6 2.3-9.4-8-11.3 10.3-1.6 15.2-8 12.1-11.7-3.1-3.6-10.8 0-13.1 9.1-.2-3.2-.8-5.8-1.5-8-.7 2.2-1.3 4.8-1.5 8Z" fill="url(#home-butterfly-gradient)" />
          <path d="M20 18.5c-1.3 3.4-1.3 7 0 10.5 1.3-3.5 1.3-7.1 0-10.5Z" fill="#5420A3" />
          <defs>
            <linearGradient id="home-butterfly-gradient" x1="6" y1="8" x2="35" y2="33" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C084FC" />
              <stop offset="1" stopColor="#6D28D9" />
            </linearGradient>
          </defs>
        </svg>
        <span className="public-home__cursor-star public-home__cursor-star--one">✦</span>
        <span className="public-home__cursor-star public-home__cursor-star--two">✧</span>
      </div>
      <div className="public-home__inner">
        <section className="public-hero" aria-labelledby="public-home-title">
          <div className="public-hero__copy">
            <p className="discovery-eyebrow"><Sparkles size={15} /> PERSONAL STYLE, MADE MORE ACCESSIBLE</p>
            <h1 id="public-home-title">Find your style with <span>Zorevi.</span></h1>
            <p className="public-hero__description">Discover fashion designers and styling ideas for every person, identity and occasion.</p>
            <div className="public-hero__actions">
              <Link to="/explore/designers" className="zorevi-btn zorevi-btn--primary public-hero__primary">
                Explore Designers <ArrowRight size={17} />
              </Link>
              <Link to="/explore/malls" className="zorevi-btn zorevi-btn--outline">
                <MapPin size={16} /> Find Nearby Malls
              </Link>
            </div>
            <div className="public-hero__location"><MapPin size={15} /> Exploring {selectedCity} <small>Location is selected manually in this demo.</small></div>
          </div>
          <div className="public-hero__visual">
            <img src="/assets/images/zorevi-family-fashion.png" alt="A South Asian family celebrating together in coordinated festive fashion" />
            <div className="public-price-card">
              <span>Standard starting package</span>
              <strong>₹499 <small>/ 2 hours</small></strong>
              <p>Personal styling session</p>
              <small>Custom services may cost more.</small>
            </div>
          </div>
        </section>

        <p className="discovery-demo-notice public-home__notice" role="note">{discoveryDemoNotice} This prototype does not use GPS or a live marketplace service.</p>

        <section className="public-discovery-section" aria-labelledby="public-designers-title">
          <div className="public-section-heading">
            <div>
              <p className="discovery-eyebrow">Explore your next look</p>
              <h2 id="public-designers-title">Verified designers near {selectedCity}</h2>
            </div>
            <Link to="/explore/designers" className="public-section-link">See all designers <ArrowRight size={15} /></Link>
          </div>

          <div className="discovery-chip-row public-home__categories" role="group" aria-label="Filter designers by style">
            {discoveryCategories.map((category) => (
              <button
                type="button"
                key={category.id}
                className={`discovery-chip ${selectedCategory === category.id ? 'is-active' : ''}`}
                aria-pressed={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="public-home__controls">
            <label className="discovery-search">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">Search designers, styles or areas</span>
              <input
                type="search"
                placeholder="Search designers, styles or areas"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
            <label className="discovery-sort">
              <span className="sr-only">Sort designers</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="rating">Highest rated (demo)</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="experience">Most experience</option>
              </select>
            </label>
            <span className="public-home__count" aria-live="polite">{filteredDesigners.length} sample profiles</span>
          </div>

          {filteredDesigners.length ? (
            <div className="public-designer-grid">
              {filteredDesigners.slice(0, 4).map((designer) => (
                <PublicDesignerCard key={designer.id} designer={designer} onBook={handleBook} />
              ))}
            </div>
          ) : (
            <div className="discovery-empty">
              <h3>No sample designers for this search</h3>
              <p>Try another style or select a different city.</p>
              <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="public-discovery-section public-home__mall-section" aria-labelledby="public-malls-title">
          <div className="public-section-heading">
            <div>
              <p className="discovery-eyebrow">Plan a day out</p>
              <h2 id="public-malls-title">Explore malls in {selectedCity}</h2>
            </div>
            <Link to="/explore/malls" className="public-section-link">See mall directory <ArrowRight size={15} /></Link>
          </div>
          <p className="public-section-subtitle">Venue details link to official mall websites. Photos below are illustrative and do not depict the named venues.</p>
          {selectedCity === 'Hyderabad' ? (
            <div className="public-mall-grid">
              {publicMalls.map((mall) => <PublicMallCard key={mall.id} mall={mall} />)}
            </div>
          ) : (
            <div className="discovery-empty discovery-empty--compact">
              <p>The prototype mall directory currently has official-source entries for Hyderabad.</p>
              <Link to="/explore/malls" className="zorevi-btn zorevi-btn--outline">Browse mall directory</Link>
            </div>
          )}
        </section>

        <section className="public-designer-invitation" aria-labelledby="designer-invitation-title">
          <div className="public-designer-invitation__mark" aria-hidden="true"><Sparkles size={26} /></div>
          <div>
            <p className="discovery-eyebrow">For designers and stylists</p>
            <h2 id="designer-invitation-title">Make room for your next creative chapter.</h2>
            <p>Build a profile, showcase your work and connect with customers looking for a personal style partner.</p>
          </div>
          <div className="public-designer-invitation__actions">
            <Link to="/for-designers" className="zorevi-btn zorevi-btn--outline">Learn about Zorevi</Link>
            <Link to="/designer/apply" className="zorevi-btn zorevi-btn--primary">Apply to join Zorevi <ArrowRight size={16} /></Link>
            <Link to="/designer/login" className="public-section-link">Designer sign in</Link>
          </div>
        </section>
      </div>
      {bookingOpen && (
        <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} initialDesigner={bookingDesigner} />
      )}
    </main>
  );
}
