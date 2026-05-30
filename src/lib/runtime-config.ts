const apiBase = (import.meta.env.PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

function getBaseUrl(): string {
  if (apiBase) return apiBase;
  if (typeof window !== 'undefined') return window.location.origin;
  return 'http://localhost:4321';
}

const base = getBaseUrl();

export const runtimeConfig = {
  apiBaseUrl: base,
  publicApiBaseUrl: `${base}/api`,
  adminApiBaseUrl: `${base}/api`,
  mediaBaseUrl: `${base}/api/media`,
};
