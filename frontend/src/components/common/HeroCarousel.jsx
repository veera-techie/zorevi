import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './HeroCarousel.css';

export const HERO_SLIDES = [
  {
    id: 'family-partner',
    image: '/assets/images/hero-slide-family-partner.jpg',
    title: "Your Family's Complete Fashion Partner",
    subtitle: 'Expert Designers • Curated Shopping • Nearby Fashion Hubs • For Every Occasion',
    tagline: 'Personal Style, Made More Accessible',
    primaryCta: { label: 'Explore Fashion Hubs', link: '/explore/fashion-hubs' },
    secondaryCta: { label: 'Book Designers', link: '/explore/designers' },
    tabLabel: 'Family Partner',
    occasion: 'All Occasions',
  },
  {
    id: 'family-shopping',
    image: '/assets/images/hero-slide-family-shopping.jpg',
    title: 'Curated Styling for the Whole Family',
    subtitle: 'Celebrate together with coordinated outfits, designer consultations & handpicked collections',
    tagline: 'Shop • Style • Celebrate',
    primaryCta: { label: 'Plan Family Shopping', link: '/explore/fashion-hubs?category=family' },
    secondaryCta: { label: 'Explore Stylists', link: '/explore/designers' },
    tabLabel: 'Style & Celebrate',
    occasion: 'Festivals & Weddings',
  },
  {
    id: 'bridal-couture',
    image: '/assets/images/hero-slide-bridal-couture.jpg',
    title: 'Exquisite Bridal & Groom Couture',
    subtitle: 'Bespoke wedding lehengas, royal sherwanis, jewelry matching & personal bridal styling',
    tagline: 'Wedding & Bridal Specialists',
    primaryCta: { label: 'Book Bridal Designer', link: '/explore/designers?category=bridal' },
    secondaryCta: { label: 'Explore Bridal Hubs', link: '/explore/fashion-hubs?category=bridal' },
    tabLabel: 'Bridal Couture',
    occasion: 'Weddings & Receptions',
  },
  {
    id: 'mens-luxury',
    image: '/assets/images/hero-slide-mens-luxury.jpg',
    title: "Men's Luxury Fashion & Bespoke Tailoring",
    subtitle: 'Fine Italian suits, royal bandhgalas, tuxedos & customized festive kurtas crafted to perfection',
    tagline: "Men's Sartorial Luxury",
    primaryCta: { label: "Explore Men's Stores", link: '/explore/fashion-hubs?category=men' },
    secondaryCta: { label: 'Consult Master Stylist', link: '/explore/designers?category=men' },
    tabLabel: "Men's Luxury",
    occasion: 'Executive & Formal',
  },
];

export default function HeroCarousel({ autoInterval = 2000 }) {
  const { selectedCity, userLocation } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef(null);

  const totalSlides = HERO_SLIDES.length;

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setProgressKey((prev) => prev + 1);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgressKey((prev) => prev + 1);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setProgressKey((prev) => prev + 1);
  };

  // 2-second auto-transition timer
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      goToNext();
    }, autoInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, autoInterval, goToNext, currentSlide]);

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <section
      className="zorevi-hero-carousel"
      aria-label="Featured Fashion Collections and Experiences"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="zorevi-hero-carousel__viewport">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`zorevi-hero-carousel__slide ${isActive ? 'is-active' : ''}`}
              aria-hidden={!isActive}
            >
              <Link
                to={slide.primaryCta.link}
                className="zorevi-hero-carousel__link"
                tabIndex={isActive ? 0 : -1}
                aria-label={`${slide.title} - ${slide.subtitle}`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="zorevi-hero-carousel__image"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </Link>
            </div>
          );
        })}

        {/* Previous & Next Controls */}
        <button
          type="button"
          className="zorevi-hero-carousel__nav-btn zorevi-hero-carousel__nav-btn--prev"
          onClick={goToPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          className="zorevi-hero-carousel__nav-btn zorevi-hero-carousel__nav-btn--next"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <ChevronRight size={22} />
        </button>

        {/* Top Controls Bar: 2s Auto Tag & Pause/Play */}
        <div className="zorevi-hero-carousel__top-ctrls">
          <button
            type="button"
            className="zorevi-hero-carousel__play-toggle"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause 2-second auto-slide' : 'Play auto-slide'}
          >
            {isPlaying ? (
              <>
                <Pause size={12} />
                <span>2s Auto Active</span>
              </>
            ) : (
              <>
                <Play size={12} />
                <span>Paused</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom Navigation Indicators with 2-second Progress Bar */}
        <div className="zorevi-hero-carousel__bottom-bar">
          <div className="zorevi-hero-carousel__tabs" role="tablist">
            {HERO_SLIDES.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`zorevi-hero-carousel__tab-pill ${isActive ? 'is-active' : ''}`}
                  onClick={() => goToSlide(index)}
                >
                  <span className="zorevi-hero-carousel__tab-number">0{index + 1}</span>
                  <span className="zorevi-hero-carousel__tab-text">{slide.tabLabel}</span>
                  {isActive && isPlaying && !isHovered && (
                    <span
                      key={progressKey}
                      className="zorevi-hero-carousel__tab-progress"
                      style={{ animationDuration: `${autoInterval}ms` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-Hero Location & Quick Links Bar */}
      <div className="zorevi-hero-carousel__quickbar">
        <div className="zorevi-hero-carousel__location-tag">
          <MapPin size={16} className="zorevi-hero-carousel__loc-pin" />
          <span>
            Exploring near{' '}
            <strong>
              {userLocation?.locality
                ? `${userLocation.locality}, ${userLocation.city || selectedCity}`
                : selectedCity}
            </strong>
          </span>
          {userLocation?.isDetected && (
            <span className="zorevi-hero-carousel__gps-badge">✓ Live GPS Active</span>
          )}
        </div>

        <div className="zorevi-hero-carousel__actions-strip">
          <Link
            to={activeSlideData.primaryCta.link}
            className="zorevi-btn zorevi-btn--primary zorevi-hero-carousel__action-btn"
          >
            <span>{activeSlideData.primaryCta.label}</span>
            <ArrowRight size={15} />
          </Link>
          <Link
            to={activeSlideData.secondaryCta.link}
            className="zorevi-btn zorevi-btn--outline zorevi-hero-carousel__action-btn"
          >
            <span>{activeSlideData.secondaryCta.label}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
