import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, MapPin, X, ArrowUpDown, Sparkles } from 'lucide-react';
import DesignerCard from '../../../components/cards/DesignerCard';
import BookingModal from '../../../components/cards/BookingModal';
import { mockDesigners, mockMalls } from '../../../services/mockData';
import { SPECIALIZATIONS, OCCASIONS } from '../../../constants';
import { useApp } from '../../../context/AppContext';
import './PublicDesigners.css';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Designers' },
  { id: 'women', label: "Women's Fashion" },
  { id: 'men', label: "Men's Fashion" },
  { id: 'kids', label: "Kids' Fashion" },
  { id: 'family', label: 'Family Styling' },
  { id: 'bridal', label: 'Bridal & Groom' },
];

export default function PublicDesigners({ role = 'public' }) {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const { selectedCity } = useApp();

  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [budgetTier, setBudgetTier] = useState('all'); // all, under500, under1000, under2000, luxury
  const [sortBy, setSortBy] = useState('top-rated');
  const [selectedDesignerForBooking, setSelectedDesignerForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleBook = (designer) => {
    setSelectedDesignerForBooking(designer);
    setIsBookingModalOpen(true);
  };

  const filteredDesigners = mockDesigners
    .filter((des) => {
      // Category Tab filter
      if (selectedCategoryTab === 'women') {
        const t = (des.title || '').toLowerCase();
        if (!t.includes('women') && !t.includes('bridal') && !t.includes('couture')) return false;
      }
      if (selectedCategoryTab === 'men') {
        const t = (des.title || '').toLowerCase();
        if (!t.includes('men') && !t.includes('formal') && !t.includes('groom')) return false;
      }
      if (selectedCategoryTab === 'kids') {
        const t = (des.title || '').toLowerCase();
        const specs = des.specializations.map((s) => s.toLowerCase());
        if (!t.includes('kid') && !t.includes('family') && !specs.some((s) => s.includes('kid') || s.includes('family'))) return false;
      }
      if (selectedCategoryTab === 'family') {
        const t = (des.title || '').toLowerCase();
        const specs = des.specializations.map((s) => s.toLowerCase());
        if (!t.includes('family') && !specs.some((s) => s.includes('family'))) return false;
      }
      if (selectedCategoryTab === 'bridal') {
        const t = (des.title || '').toLowerCase();
        const specs = des.specializations.map((s) => s.toLowerCase());
        if (!t.includes('bridal') && !specs.some((s) => s.includes('bridal') || s.includes('wedding'))) return false;
      }

      // Search Query
      const matchSearch =
        des.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        des.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        des.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Specialization
      const matchSpec =
        selectedSpecialization === 'All' ||
        des.specializations.includes(selectedSpecialization);

      // Location
      const matchLocation =
        selectedLocation === 'All' ||
        (des.location || '').toLowerCase() === selectedLocation.toLowerCase() ||
        (des.locality || '').toLowerCase().includes(selectedLocation.toLowerCase());

      // Budget Tier
      const startingPrice = des.startingPrice || 499;
      let matchBudget = true;
      if (budgetTier === 'under500') matchBudget = startingPrice <= 500;
      else if (budgetTier === 'under1000') matchBudget = startingPrice <= 1000;
      else if (budgetTier === 'under2000') matchBudget = startingPrice <= 2000;
      else if (budgetTier === 'luxury') matchBudget = startingPrice > 1500;

      return matchSearch && matchSpec && matchLocation && matchBudget;
    })
    .sort((a, b) => {
      if (sortBy === 'top-rated') return b.rating - a.rating;
      if (sortBy === 'price-low') return (a.startingPrice || 499) - (b.startingPrice || 499);
      if (sortBy === 'price-high') return (b.startingPrice || 499) - (a.startingPrice || 499);
      if (sortBy === 'experience') return parseInt(b.experience) - parseInt(a.experience);
      return 0;
    });

  const clearFilters = () => {
    setSelectedCategoryTab('all');
    setSearchQuery('');
    setSelectedSpecialization('All');
    setSelectedOccasion('All');
    setSelectedLocation('All');
    setBudgetTier('all');
    setSortBy('top-rated');
  };

  return (
    <div className="zorevi-designers-page container">
      {/* Page Header */}
      <div className="zorevi-designers-header">
        <div>
          <h1 className="zorevi-designers-title">Find Fashion Designers & Stylists</h1>
          <p className="zorevi-designers-subtitle">
            Book verified personal stylists in {selectedCity} for weddings, festivities, office wardrobes, and mall shopping.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', overflowX: 'auto', paddingBottom: '4px' }}>
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategoryTab(tab.id)}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: selectedCategoryTab === tab.id ? '1px solid #7C3AED' : '1px solid #E5E7EB',
              background: selectedCategoryTab === tab.id ? '#7C3AED' : '#FFFFFF',
              color: selectedCategoryTab === tab.id ? '#FFFFFF' : '#4B5563',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: selectedCategoryTab === tab.id ? '0 4px 12px rgba(124, 58, 237, 0.22)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filters Bar */}
      <div className="zorevi-filter-panel">
        <div className="zorevi-filter-row">
          <div className="zorevi-filter-search">
            <Search size={18} className="zorevi-filter-icon" />
            <input
              type="text"
              placeholder="Search by designer name, style, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="zorevi-clear-input" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="zorevi-filter-select-wrap">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="zorevi-filter-select"
            >
              <option value="All">All Specializations</option>
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div className="zorevi-filter-select-wrap">
            <select
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value)}
              className="zorevi-filter-select"
            >
              <option value="all">Budget: All Rates</option>
              <option value="under500">Under ₹500</option>
              <option value="under1000">Under ₹1,000</option>
              <option value="under2000">Under ₹2,000</option>
              <option value="luxury">Luxury / Bespoke</option>
            </select>
          </div>

          <div className="zorevi-filter-select-wrap">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="zorevi-filter-select"
            >
              <option value="top-rated">Sort: Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="experience">Most Experienced</option>
            </select>
          </div>

          <button className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm" onClick={clearFilters}>
            Clear
          </button>
        </div>

        {/* Active Filters count summary */}
        <div className="zorevi-filter-summary">
          <span>Showing <strong>{filteredDesigners.length}</strong> verified stylists available in {selectedCity}</span>
        </div>
      </div>

      {/* Designers Grid */}
      {filteredDesigners.length > 0 ? (
        <div className="zorevi-designers-grid" style={{ marginTop: '24px' }}>
          {filteredDesigners.map((designer) => (
            <DesignerCard
              key={designer.id}
              designer={designer}
              onBook={handleBook}
              showBookBtn={true}
              role={role}
            />
          ))}
        </div>
      ) : (
        <div className="zorevi-no-results">
          <p>No designers match your active filters.</p>
          <button className="zorevi-btn zorevi-btn--primary" onClick={clearFilters}>
            Reset All Filters
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          initialDesigner={selectedDesignerForBooking}
        />
      )}
    </div>
  );
}
