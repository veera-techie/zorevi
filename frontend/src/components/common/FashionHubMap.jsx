import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Navigation, Star, Clock, ExternalLink, X,
  ZoomIn, ZoomOut, Compass, Layers, ShieldCheck
} from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import './FashionHubMap.css';

export default function FashionHubMap({
  hubs = [],
  userLocation,
  selectedHub,
  onSelectHub,
  radiusKm = 20,
}) {
  const [activeHub, setActiveHub] = useState(selectedHub || hubs[0] || null);
  const [zoomLevel, setZoomLevel] = useState(13);

  // Compute map center (from active hub or user location)
  const centerLat = userLocation?.lat || activeHub?.lat || 17.4319;
  const centerLng = userLocation?.lng || activeHub?.lng || 78.4073;

  // Bounding box for OpenStreetMap embed
  const delta = (radiusKm / 111) * 0.8;
  const bbox = `${centerLng - delta},${centerLat - delta},${centerLng + delta},${centerLat + delta}`;

  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${activeHub ? `${activeHub.lat},${activeHub.lng}` : `${centerLat},${centerLng}`}`;

  const handleSelect = (hub) => {
    setActiveHub(hub);
    onSelectHub?.(hub);
  };

  return (
    <div className="zorevi-hub-map-container">
      {/* Map Header / Toolbar */}
      <div className="zorevi-hub-map-toolbar">
        <div className="zorevi-hub-map-location-badge">
          <MapPin size={14} color="#7C3AED" />
          <span>Showing {hubs.length} Fashion Hubs near <strong>{userLocation?.locality || 'Selected Location'}</strong></span>
        </div>

        <div className="zorevi-hub-map-controls">
          <button
            type="button"
            className="zorevi-map-btn"
            title="Recenter Map on Current Location"
            onClick={() => setActiveHub(null)}
          >
            <Compass size={14} /> Center
          </button>
        </div>
      </div>

      {/* Main Map View Area */}
      <div className="zorevi-hub-map-viewport">
        {/* Real OpenStreetMap Tile Iframe */}
        <iframe
          title="OpenStreetMap Live Fashion Hubs"
          className="zorevi-osm-iframe"
          src={mapEmbedUrl}
          loading="lazy"
        />

        {/* Floating Interactive Markers Carousel / Overlay Bar */}
        <div className="zorevi-map-markers-bar">
          <div className="zorevi-map-markers-scroll">
            {hubs.slice(0, 10).map((hub) => {
              const isSelected = activeHub?.id === hub.id;
              return (
                <button
                  key={hub.id}
                  type="button"
                  className={`zorevi-map-pin-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelect(hub)}
                >
                  <MapPin size={13} />
                  <span className="pin-title">{hub.name}</span>
                  <span className="pin-dist">{hub.distance}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Hub Popup Card */}
        {activeHub && (
          <div className="zorevi-map-active-card">
            <button
              type="button"
              className="zorevi-map-card-close"
              onClick={() => setActiveHub(null)}
              aria-label="Close details"
            >
              <X size={14} />
            </button>

            <div className="zorevi-map-card-inner">
              <div className="zorevi-map-card-img-wrap">
                <ImageWithFallback
                  src={activeHub.image}
                  alt={activeHub.name}
                  className="zorevi-map-card-img"
                  fallbackType="mall"
                />
                <span className={`zorevi-map-card-status ${activeHub.isOpen ? 'open' : 'closed'}`}>
                  {activeHub.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>

              <div className="zorevi-map-card-body">
                <span className="zorevi-map-card-category">{activeHub.category}</span>
                <h4 className="zorevi-map-card-title">{activeHub.name}</h4>

                <p className="zorevi-map-card-address">
                  <MapPin size={12} /> {activeHub.address}
                </p>

                <div className="zorevi-map-card-meta">
                  <span className="meta-dist">
                    <strong>{activeHub.distance}</strong> from you
                  </span>
                  <span className="meta-rating">
                    <Star size={12} fill="#F59E0B" color="#F59E0B" /> {activeHub.rating} ({activeHub.reviewCount.toLocaleString()})
                  </span>
                </div>

                <div className="zorevi-map-card-actions">
                  <a
                    href={activeHub.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="zorevi-btn zorevi-btn--primary zorevi-btn--sm"
                  >
                    <Navigation size={13} /> Directions
                  </a>
                  <Link
                    to={`/customer/fashion-hubs/${activeHub.id}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="zorevi-btn zorevi-btn--outline zorevi-btn--sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
