export const AAROHI_PROFILE_IMAGE = '/images/aarohi-portrait.png';

const PROFILE_PHOTO_KEY = 'zorevi-designer-profile-photo';
const PROFILE_PHOTO_MIGRATION_KEY = 'zorevi-aarohi-original-photo-migrated-v1';
const PREVIOUS_DEFAULT_PHOTOS = new Set([
  '/images/designer-aarohi.jpg',
  '/images/aarohi-portrait-hd.jpg',
  '/images/aarohi-avatar.png',
]);

export function loadAarohiProfileImage() {
  try {
    const savedPhoto = localStorage.getItem(PROFILE_PHOTO_KEY);
    const alreadyMigrated = localStorage.getItem(PROFILE_PHOTO_MIGRATION_KEY) === 'true';

    if (!alreadyMigrated) {
      localStorage.setItem(PROFILE_PHOTO_KEY, AAROHI_PROFILE_IMAGE);
      localStorage.setItem(PROFILE_PHOTO_MIGRATION_KEY, 'true');
      return AAROHI_PROFILE_IMAGE;
    }

    if (savedPhoto && !PREVIOUS_DEFAULT_PHOTOS.has(savedPhoto)) return savedPhoto;

    localStorage.setItem(PROFILE_PHOTO_KEY, AAROHI_PROFILE_IMAGE);
  } catch { /* Use the original bundled profile photo when storage is unavailable. */ }

  return AAROHI_PROFILE_IMAGE;
}
