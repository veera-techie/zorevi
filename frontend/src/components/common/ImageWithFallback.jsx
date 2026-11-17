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

  // High quality Unsplash fashion curated fallbacks
  const fallbackUrls = {
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    avatarMen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    designer: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    fashion: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    mall: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800&q=80',
    bridal: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    hero: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
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

