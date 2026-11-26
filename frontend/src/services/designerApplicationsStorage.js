export const DESIGNER_APPLICATIONS_STORAGE_KEY = 'zorevi_designer_applications';

const LEGACY_SESSION_STORAGE_PREFIX = 'zorevi_designer_application_';

export function getStoredDesignerApplications() {
  const storedValue = localStorage.getItem(DESIGNER_APPLICATIONS_STORAGE_KEY);
  if (!storedValue) return [];

  let applications;
  try {
    applications = JSON.parse(storedValue);
  } catch {
    throw new Error('Saved applications in this browser could not be read because the stored data is invalid.');
  }
  if (!Array.isArray(applications)) {
    throw new Error('Saved application data is not in the expected format.');
  }
  return applications;
}

export function saveDesignerApplication(application) {
  if (!application?.applicationId) {
    throw new Error('An application ID is required to save this application.');
  }

  const applications = getStoredDesignerApplications();
  const updatedApplications = [
    application,
    ...applications.filter((savedApplication) => savedApplication?.applicationId !== application.applicationId),
  ];
  localStorage.setItem(DESIGNER_APPLICATIONS_STORAGE_KEY, JSON.stringify(updatedApplications));
}

export function findDesignerApplication(applicationId) {
  const applications = getStoredDesignerApplications();
  const savedApplication = applications.find((application) => application?.applicationId === applicationId);
  if (savedApplication) return savedApplication;

  const legacyValue = sessionStorage.getItem(`${LEGACY_SESSION_STORAGE_PREFIX}${applicationId}`);
  if (!legacyValue) return null;

  const legacyApplication = JSON.parse(legacyValue);
  if (!legacyApplication || legacyApplication.applicationId !== applicationId) return null;

  saveDesignerApplication(legacyApplication);
  return legacyApplication;
}
