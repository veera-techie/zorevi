export const SAMPLE_DESIGNER_STORES = {
  'mall-001': { name: 'Aarohi Couture', image: '/images/boutique-interior-minimal.jpg' },
  'mall-002': { name: 'Aarohi Bridal Studio', image: '/images/boutique-interior-brick.jpg' },
  'mall-003': { name: 'Mehta Festive Wear', image: '/images/boutique-interior-minimal.jpg' },
  'mall-004': { name: 'Aarohi Design Atelier', image: '/images/boutique-interior-brick.jpg' },
};

export const DESIGNER_MALL_IDS_KEY = 'zorevi-designer-available-mall-ids';

export const loadDesignerMallIds = (profile = {}) => {
  try {
    const storedIds = sessionStorage.getItem(DESIGNER_MALL_IDS_KEY);
    if (storedIds !== null) {
      const parsedIds = JSON.parse(storedIds);
      if (Array.isArray(parsedIds)) return parsedIds;
    }
  } catch {
    // Fall back to persistent storage if this browser blocks session storage.
  }
  try {
    const storedIds = localStorage.getItem(DESIGNER_MALL_IDS_KEY);
    if (storedIds !== null) {
      const parsedIds = JSON.parse(storedIds);
      if (Array.isArray(parsedIds)) return parsedIds;
    }
  } catch {
    // Fall back to the older profile field if browser storage is unavailable.
  }
  return Array.isArray(profile.availableMallIds) ? profile.availableMallIds : [];
};

export const saveDesignerMallIds = (ids) => {
  const serializedIds = JSON.stringify(ids);
  let sessionSaved = false;
  try {
    sessionStorage.setItem(DESIGNER_MALL_IDS_KEY, serializedIds);
    sessionSaved = true;
  } catch {
    // Persistent storage may still be available if session storage is blocked.
  }
  try {
    localStorage.setItem(DESIGNER_MALL_IDS_KEY, serializedIds);
    return 'local';
  } catch {
    if (sessionSaved) return 'session';
    throw new Error('Browser storage is unavailable for saving designer locations.');
  }
};

export const getDesignerStoreNames = (profile = {}) => {
  const savedNames = profile.mallStoreNames || {};
  if (profile.mallStoreNamesConfigured || Object.keys(savedNames).length) return savedNames;
  return Object.fromEntries(Object.entries(SAMPLE_DESIGNER_STORES).map(([id, store]) => [id, store.name]));
};

export const getDesignerStoreImages = (profile = {}) => {
  const savedImages = profile.mallStoreImages || {};
  const defaults = Object.fromEntries(Object.entries(SAMPLE_DESIGNER_STORES).map(([id, store]) => [id, store.image]));
  if (profile.mallStoreImagesConfigured) return savedImages;
  const previousDemoImages = new Set([
    '/images/slide-fashion-design.jpg',
    '/images/portfolio-bridal-hd.jpg',
    '/images/portfolio-saree-hd.jpg',
    '/images/portfolio-family-hd.jpg',
  ]);
  const images = { ...defaults, ...savedImages };
  Object.entries(savedImages).forEach(([id, image]) => {
    if (previousDemoImages.has(image) && defaults[id]) images[id] = defaults[id];
  });
  return images;
};
