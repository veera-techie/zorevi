import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, MapPin, X, ArrowUpDown } from 'lucide-react';
import DesignerCard from '../../../components/cards/DesignerCard';
import BookingModal from '../../../components/cards/BookingModal';
import { mockDesigners } from '../../../services/mockData';
import { SPECIALIZATIONS, OCCASIONS } from '../../../constants';
import './PublicDesigners.css';

export default function PublicDesigners({ role = 'public' }) {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('top-rated');
  const [selectedDesignerForBooking, setSelectedDesignerForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleBook = (designer) => {
    setSelectedDesignerForBooking(designer);
    setIsBookingModalOpen(true);
  };

  const filteredDesigners = mockDesigners
    .filter((des) => {
      const matchSearch =
        des.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        des.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        des.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchSpec =
        selectedSpecialization === 'All' ||
        des.specializations.includes(selectedSpecialization);

      const matchPrice = (des.startingPrice || 499) <= maxPrice;

      return matchSearch && matchSpec && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'top-rated') return b.rating - a.rating;
      if (sortBy === 'price-low') return (a.startingPrice || 499) - (b.startingPrice || 499);
      if (sortBy === 'price-high') return (b.startingPrice || 499) - (a.startingPrice || 499);
      if (sortBy === 'experience') return parseInt(b.experience) - parseInt(a.experience);
      return 0;
    });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialization('All');
    setSelectedOccasion('All');
    setMaxPrice(5000);
    setSortBy('top-rated');
  };

  return (
    <div className="zorevi-designers-page container">
      {/* Page Header */}
      <div className="zorevi-designers-header">
        <div>
          <h1 className="zorevi-designers-title">Discover Nearby Designers</h1>
          <p className="zorevi-designers-subtitle">
            Find verified fashion designers and personal stylists around you for weddings, parties, or everyday looks.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="zorevi-filter-panel">
        <div className="zorevi-filter-row">
          <div className="zorevi-filter-search">
            <Search size={18} className="zorevi-filter-icon" />
            <input
              type="text"
              placeholder="Search designers by name, style, or specialty..."
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
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="zorevi-filter-select"
            >
              <option value="All">All Occasions</option>
              {OCCASIONS.map((occ) => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
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
            Clear Filters
          </button>
        </div>

        {/* Active Filters count summary */}
        <div className="zorevi-filter-summary">
          <span>Showing <strong>{filteredDesigners.length}</strong> designers available in Hyderabad</span>
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
              role={role === 'customer' ? 'customer' : 'public'}
            />
          ))}
        </div>
      ) : (
        <div className="zorevi-empty-state">
          <h3>No designers matched your criteria</h3>
          <p>Try loosening your search filters or resetting to view all verified stylists.</p>
          <button className="zorevi-btn zorevi-btn--primary" onClick={clearFilters}>
            Reset Filters
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

