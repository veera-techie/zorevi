import { useState } from 'react';

/**
 * ImageWithFallback provides graceful image fallbacks if an asset is missing or fails to load.
 * Images can be placed in `public/images/` by name (e.g. `customer-praveen.jpg`, `designer-aarohi.jpg`).
 */
export default function ImageWithFallback({
  src,
  alt = '',
  className = '',
  fallbackType = 'fashion',
  fallbackText = '',
  width,
  height,
  style = {},
  ...props
}) {
  const [error, setError] = useState(false);

  // Use local project assets so the fallback still works when the browser is offline.
  const fallbackUrls = {
    avatar: '/images/aarohi-avatar.png',
    avatarMen: '/images/customer-rohan.png',
    designer: '/images/aarohi-portrait-hd.jpg',
    fashion: '/images/hero-banner-group.png',
    mall: '/images/entire_banner_card.png',
    bridal: '/images/portfolio-bridal-hd.jpg',
    hero: '/images/hero-banner-group.png',
  };

  const chosenFallback = fallbackUrls[fallbackType] || fallbackUrls.fashion;

  const handleError = () => {
    if (!error) {
      setError(true);
    }
  };

  const finalSrc = error || !src ? chosenFallback : src;

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      onError={handleError}
      width={width}
      height={height}
      style={{ objectFit: 'cover', ...style }}
      loading="lazy"
      {...props}
    />
  );
}

