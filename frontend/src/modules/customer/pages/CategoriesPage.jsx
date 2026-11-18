<<<<<<< HEAD
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { discoveryCategories, discoveryDemoNotice } from '../../../services/publicDiscoveryData';
import './PublicDiscovery.css';

export default function CategoriesPage() {
  return (
    <main className="discovery-page public-info-page">
      <header className="public-info-hero">
        <p className="discovery-eyebrow">Explore your way</p>
        <h1>Style for every person and occasion.</h1>
        <p>Browse sample categories and discover the kinds of looks and styling perspectives available across the Zorevi demo.</p>
      </header>
      <p className="discovery-demo-notice" role="note">{discoveryDemoNotice}</p>
      <div className="public-category-grid">
        {discoveryCategories.filter((category) => category.id !== 'all').map((category) => (
          <article className="public-category-card" key={category.id}>
            <img src={category.image} alt={`Illustrative ${category.title} fashion`} loading="lazy" />
            <div className="public-category-card__body">
              <p className="discovery-eyebrow">Styling category</p>
              <h2>{category.title}</h2>
              <p>{category.description}</p>
              <Link to={`/explore/designers?category=${encodeURIComponent(category.id)}`} className="public-section-link">
                Explore sample designers <ArrowRight size={15} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
=======
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, Crown, Heart, User, ArrowRight } from 'lucide-react';
import { CATEGORIES, SPECIALIZATIONS } from '../../../constants';
import ImageWithFallback from '../../../components/common/ImageWithFallback';

export default function CategoriesPage() {
  const categoryDetails = [
    {
      id: 'bridal',
      title: 'Bridal & Groom Couture',
      desc: 'Exclusive bespoke bridal lehengas, sherwanis, safas, and color-coordinated wedding couple styling.',
      image: '/images/cat-bridal.jpg',
      tags: ['Lehengas', 'Sherwanis', 'Trousseau', 'Jewelry Coordination'],
      starting: '₹1,499',
    },
    {
      id: 'personal',
      title: 'Personal & Wardrobe Styling',
      desc: 'One-on-one consultation with certified stylists to revamp your everyday, capsule, and corporate wardrobe.',
      image: '/images/cat-personal.jpg',
      tags: ['Color Palette Analysis', 'Body Type Styling', 'Capsule Wardrobe'],
      starting: '₹499',
    },
    {
      id: 'mens',
      title: "Men's Sartorial Styling",
      desc: 'Tailored suits, sharp tuxedos, bandhgalas, kurtas, and casual streetwear styling for men.',
      image: '/images/cat-mens.jpg',
      tags: ['Bespoke Suits', 'Ethnic Kurtas', 'Groom Styling', 'Sneakers & Shoes'],
      starting: '₹499',
    },
    {
      id: 'womens',
      title: "Women's Occasion Wear",
      desc: 'Designer sarees, cocktail gowns, fusion silhouettes, and festive ethnic curation for every celebration.',
      image: '/images/cat-womens.jpg',
      tags: ['Sarees', 'Anarkalis', 'Cocktail Gowns', 'Fusion Indo-Western'],
      starting: '₹499',
    },
    {
      id: 'couple',
      title: 'Couple Theme Styling',
      desc: 'Harmonious color matching, contrasting palettes, and coordinated aesthetics for couples.',
      image: '/images/cat-couple.jpg',
      tags: ['Sangeet Themes', 'Reception Looks', 'Pre-wedding Shoots'],
      starting: '₹899',
    },
    {
      id: 'family',
      title: 'Family & Group Ensembles',
      desc: 'Synchronized festive ensembles for parents, siblings, and kids with coordinated color schemes.',
      image: '/images/cat-family.jpg',
      tags: ['Festivals', 'Milestone Birthdays', 'Family Portraits'],
      starting: '₹1,299',
    },
  ];

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#1E1B4B', marginBottom: '8px' }}>
          Explore Fashion Categories
        </h1>
        <p style={{ fontSize: '1rem', color: '#6B7280' }}>
          Whatever the occasion or aesthetic, discover certified stylists and bespoke designers tailored to your exact needs.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {categoryDetails.map((cat) => (
          <div
            key={cat.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #F3F4F6',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease',
            }}
          >
            <div style={{ height: '200px', width: '100%', position: 'relative' }}>
              <ImageWithFallback
                src={cat.image}
                alt={cat.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                fallbackType="fashion"
              />
              <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#7C3AED' }}>
                Starts at {cat.starting}
              </span>
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '8px' }}>
                {cat.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.5', marginBottom: '16px', flex: 1 }}>
                {cat.desc}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {cat.tags.map((t) => (
                  <span key={t} style={{ fontSize: '0.72rem', background: '#F5F0FF', color: '#7C3AED', padding: '3px 8px', borderRadius: '9999px', fontWeight: '500' }}>
                    {t}
                  </span>
                ))}
              </div>

              <Link
                to={`/explore/designers?category=${cat.id}`}
                className="zorevi-btn zorevi-btn--outline zorevi-btn--full"
              >
                Browse Designers <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

>>>>>>> origin/sai
