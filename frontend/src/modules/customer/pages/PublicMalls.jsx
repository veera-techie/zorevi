import { useState } from 'react';
import { Search, MapPin, Star, Navigation, Filter, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockMalls } from '../../../services/mockData';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import './PublicMalls.css';

export default function PublicMalls({ role = 'public' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMall, setSelectedMall] = useState(mockMalls[0]);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredMalls = mockMalls.filter((mall) => {
    return (
      mall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mall.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mall.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="zorevi-malls-page container">
      {/* Header */}
      <div className="zorevi-malls-header">
        <h1 className="zorevi-malls-title">Explore Nearby Malls</h1>
        <p className="zorevi-malls-subtitle">
          Discover shopping malls near you with top fashion stores, brands, and agreed designer meeting spots.
        </p>

        {/* Feature badges */}
        <div className="zorevi-malls-tags">
          <span className="zorevi-malls-tag">✓ Top Fashion Brands</span>
          <span className="zorevi-malls-tag">✓ Multiple Stores & Boutiques</span>
          <span className="zorevi-malls-tag">✓ Designer Meeting Lounges</span>
          <span className="zorevi-malls-tag">✓ Easy Directions & Parking</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="zorevi-malls-filter-bar">
        <div className="zorevi-malls-search">
          <Search size={18} className="zorevi-malls-search-icon" />
          <input
            type="text"
            placeholder="Search malls by name, area, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="zorevi-malls-filters-row">
          <button className="zorevi-malls-filter-btn active">Distance: Within 5 km</button>
          <button className="zorevi-malls-filter-btn">Stores: Fashion</button>
          <button className="zorevi-malls-filter-btn">Rating: 4.0+</button>
          <button className="zorevi-malls-filter-btn">Amenities</button>
        </div>
      </div>

      {/* Main split: List on Left, Interactive Map Preview on Right */}
      <div className="zorevi-malls-split-grid">
        {/* Left Malls List */}
        <div className="zorevi-malls-list-col">
          <h3 className="zorevi-malls-list-title">Nearby Malls ({filteredMalls.length})</h3>

          <div className="zorevi-malls-items-wrap">
            {filteredMalls.map((mall) => {
              const isSelected = selectedMall.id === mall.id;
              const detailsUrl = role === 'customer'
                ? `/customer/malls/${mall.id}`
                : `/explore/malls/${mall.id}`;

              return (
                <div
                  key={mall.id}
                  className={`zorevi-mall-list-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedMall(mall)}
                >
                  <ImageWithFallback
                    src={mall.image}
                    alt={mall.name}
                    className="zorevi-mall-item-img"
                    fallbackType="mall"
                  />

                  <div className="zorevi-mall-item-content">
                    <div className="zorevi-mall-item-header">
                      <Link to={detailsUrl} style={{ textDecoration: 'none' }}>
                        <h4 className="zorevi-mall-item-name">{mall.name}</h4>
                      </Link>
                      <span className="zorevi-mall-item-dist">
                        <MapPin size={12} /> {mall.distance}
                      </span>
                    </div>

                    <div className="zorevi-mall-item-stars">
                      <Star size={13} fill="#F59E0B" color="#F59E0B" />
                      <strong>{mall.rating}</strong>
                      <span>({mall.reviewCount} reviews)</span>
                    </div>

                    <div className="zorevi-mall-item-stats">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <ShoppingBag size={12} color="#7C3AED" /> {mall.fashionStores} fashion stores
                      </span>
                      <span className="zorevi-mall-open-badge">Open till 10 PM</span>
                    </div>

                    <div className="zorevi-mall-item-actions">
                      <Link to={detailsUrl} className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                        View Details
                      </Link>
                      <Link to={detailsUrl} className="zorevi-btn zorevi-btn--primary zorevi-btn--sm">
                        <Navigation size={13} /> Directions
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Map Preview */}
        <div className="zorevi-malls-map-col">
          <div className="zorevi-map-container">
            {/* Map styling & markers simulation */}
            <div className="zorevi-map-canvas">
              {/* Map grid lines simulation */}
              <div className="zorevi-map-grid-bg"></div>

              {/* Selected Mall Popover */}
              <div className="zorevi-map-marker-pin selected">
                <div className="zorevi-map-pin-bubble">
                  <strong>{selectedMall.name}</strong>
                  <span>★ {selectedMall.rating} • {selectedMall.distance}</span>
                </div>
                <div className="zorevi-map-pin-point"></div>
              </div>

              {/* Other Mall Pins */}
              <div className="zorevi-map-marker-pin" style={{ top: '35%', left: '30%' }}>
                <div className="zorevi-map-pin-point"></div>
              </div>
              <div className="zorevi-map-marker-pin" style={{ top: '65%', left: '70%' }}>
                <div className="zorevi-map-pin-point"></div>
              </div>
              <div className="zorevi-map-marker-pin" style={{ top: '20%', left: '75%' }}>
                <div className="zorevi-map-pin-point"></div>
              </div>

              <div className="zorevi-map-city-label">
                <MapPin size={16} /> Hyderabad City
              </div>

              <div className="zorevi-map-controls">
                <button>+</button>
                <button>-</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

