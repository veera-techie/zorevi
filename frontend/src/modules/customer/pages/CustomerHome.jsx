import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  Crown,
  LayoutGrid,
  Shirt,
  Smile,
  Heart,
  Users,
  Scissors,
  Sparkles,
  Building2,
} from 'lucide-react';
import DesignerCard from '../../../components/cards/DesignerCard';
import MallCard from '../../../components/cards/MallCard';
import { useApp } from '../../../context/AppContext';
import { CATEGORIES, PRICE_BASE, PRICE_DURATION_HOURS } from '../../../constants';
import { mockDesigners, mockMalls } from '../../../services/mockData';
import './CustomerHome.css';

const heroSlides = [
  {
    src: '/assets/images/zorevi-family-fashion.png',
    alt: 'South Asian family celebrating in coordinated festive fashion',
    objectPosition: 'center 20%',
  },
  {
    src: '/images/slide-fashion-design.jpg',
    alt: 'Bespoke fashion designer sketching couture in creative studio atelier',
    objectPosition: 'center center',
  },
  {
    src: '/images/slide-shopping-mall.jpg',
    alt: 'Luxury fashion boutique shopping experience at premier mall',
    objectPosition: 'center center',
  },
];

const categoryTerms = {
  all: [],
  mens: ["men's fashion", "men's styling", "men's & formal styling"],
  womens: ["women's fashion", "women's styling", "women's & bridal styling", "contemporary & occasion wear"],
  kids: ["kids' fashion", "kids' styling", "family styling"],
  couple: ['couple styling'],
  family: ['family styling', 'casual, fusion & family styling'],
  bridal: ['bridal & groom', "women's & bridal styling"],
  personal: ['personal styling', 'styling & consultation'],
};

function matchesCategory(designer, category) {
  if (category === 'all') return true;
  const terms = categoryTerms[category] || [];
  const title = (designer.title || '').toLowerCase();
  if (terms.some((term) => title.includes(term.toLowerCase()))) return true;
  return designer.specializations?.some((specialization) => {
    const value = specialization.toLowerCase();
    return terms.some((term) => value.includes(term.toLowerCase()) || term.toLowerCase().includes(value));
  }) || false;
}

function getCategoryIcon(id) {
  switch (id) {
    case 'all':
      return <LayoutGrid size={16} />;
    case 'mens':
      return <Shirt size={16} />;
    case 'womens':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2l6 4 6-4" />
          <path d="M12 6v3" />
          <path d="M4 14l3-5h10l3 5-3 8H7l-3-8z" />
        </svg>
      );
    case 'kids':
      return <Smile size={16} />;
    case 'couple':
      return <Heart size={16} />;
    case 'family':
      return <Users size={16} />;
    case 'bridal':
      return <Crown size={16} />;
    case 'personal':
      return <Scissors size={16} />;
    default:
      return <Sparkles size={16} />;
  }
}

export default function CustomerHome() {
  const { selectedCity } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const cityDesigners = mockDesigners.filter((designer) => designer.location === selectedCity);
  const displayDesigners = cityDesigners.length > 0 ? cityDesigners : mockDesigners;
  const filteredDesigners = displayDesigners
    .filter((designer) => matchesCategory(designer, selectedCategory))
    .slice(0, 4);

  const cityMalls = mockMalls.filter((mall) => (mall.location || '').toLowerCase() === selectedCity.toLowerCase());
  const displayMalls = cityMalls.length > 0 ? cityMalls.slice(0, 4) : mockMalls.slice(0, 4);

  const activeSlide = heroSlides[activeHeroSlide];

  const changeHeroSlide = (direction) => {
    setActiveHeroSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setActiveHeroSlide((curr) => (curr + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  return (
    <div className="customer-dashboard-home">
      {/* HERO SECTION */}
      <section className="customer-home-hero" aria-labelledby="customer-home-title">
        <div className="customer-home-hero__copy">
          <h1 id="customer-home-title">
            Fashion for Everyone.
            <span>Style for Every Occasion.</span>
          </h1>
          <p className="customer-home-hero__description">
            Discover expert fashion designers, explore nearby malls, and book your personalized styling experience.
          </p>
          <div className="customer-home-hero__actions">
            <Link to="/customer/designers" className="zorevi-btn zorevi-btn--hero-primary">
              <span>Explore Designers</span>
              <ArrowRight size={17} />
            </Link>
            <Link to="/customer/malls" className="zorevi-btn zorevi-btn--hero-secondary">
              <span>Find Nearby Malls</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <div
          className="customer-home-hero__visual"
          aria-roledescription="carousel"
          aria-label="Fashion scenes"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div className="customer-home-hero__image-frame">
            <img
              key={activeSlide.src}
              className="customer-home-hero__image"
              src={activeSlide.src}
              alt={activeSlide.alt}
              style={{ objectPosition: activeSlide.objectPosition || 'center center' }}
            />

            {/* Price badge floating over image */}
            <div className="customer-home-price-card">
              <span className="customer-home-price-card__label">Starting at</span>
              <div className="customer-home-price-card__amount">
                <strong>₹{PRICE_BASE}</strong> <span>/ {PRICE_DURATION_HOURS} Hours</span>
              </div>
              <ul className="customer-home-price-card__list">
                <li><Check size={13} className="price-check-icon" strokeWidth={3} /> <span>Designer Consultation</span></li>
                <li><Check size={13} className="price-check-icon" strokeWidth={3} /> <span>Styling Assistance</span></li>
                <li><Check size={13} className="price-check-icon" strokeWidth={3} /> <span>Personalized Suggestions</span></li>
              </ul>
            </div>

            {/* Carousel navigation controls */}
            <button
              type="button"
              className="customer-home-hero__nav-btn prev"
              aria-label="Previous image"
              onClick={() => changeHeroSlide(-1)}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="customer-home-hero__nav-btn next"
              aria-label="Next image"
              onClick={() => changeHeroSlide(1)}
            >
              <ChevronRight size={20} />
            </button>

            {/* Pagination dots */}
            <div className="customer-home-hero__dots" role="group" aria-label="Slide indicators">
              {heroSlides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.src}
                  className={`customer-home-hero__dot ${index === activeHeroSlide ? 'is-active' : ''}`}
                  aria-label={`Slide ${index + 1}`}
                  aria-pressed={index === activeHeroSlide}
                  onClick={() => setActiveHeroSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES ROW */}
      <nav className="customer-home-categories" aria-label="Styling categories">
        {CATEGORIES.map((category) => (
          <button
            type="button"
            key={category.id}
            className={`customer-home-category ${selectedCategory === category.id ? 'is-active' : ''}`}
            aria-pressed={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{getCategoryIcon(category.id)}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </nav>

      {/* NEARBY DESIGNERS SECTION */}
      <section className="customer-home-designers" aria-labelledby="customer-home-designers-title">
        <div className="customer-home-section-heading">
          <div className="customer-home-heading-title">
            <Crown size={22} className="crown-icon" />
            <h2 id="customer-home-designers-title">Nearby Designers in {selectedCity}</h2>
          </div>
          <Link to="/customer/designers" className="customer-home-section-heading__view-all">
            <span>View all</span>
            <ArrowRight size={17} />
          </Link>
        </div>

        {filteredDesigners.length > 0 ? (
          <div className="customer-home-designers__grid">
            {filteredDesigners.map((designer) => (
              <DesignerCard
                key={designer.id}
                designer={designer}
                role="customer"
                variant="dashboard"
                showBookBtn={false}
              />
            ))}
          </div>
        ) : (
          <div className="customer-home-designers__empty" role="status">
            <h3>No designers are currently listed in {selectedCity}</h3>
            <p>Try another styling category or choose a different location from the header.</p>
          </div>
        )}
      </section>

      {/* NEARBY SHOPPING MALLS SECTION */}
      <section className="customer-home-malls" aria-labelledby="customer-home-malls-title">
        <div className="customer-home-section-heading">
          <div className="customer-home-heading-title">
            <Building2 size={22} className="crown-icon" />
            <h2 id="customer-home-malls-title">Nearby Shopping Malls in {selectedCity}</h2>
          </div>
          <Link to="/customer/malls" className="customer-home-section-heading__view-all">
            <span>View all</span>
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="customer-home-malls__grid">
          {displayMalls.map((mall) => (
            <MallCard key={mall.id} mall={mall} role="customer" />
          ))}
        </div>
      </section>
    </div>
  );
}
