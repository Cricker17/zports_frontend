/**
 * Composable for generating storage image URLs from the backend.
 * Replaces duplicated getImageUrl() across 9+ files.
 */
const FALLBACK_IMAGE = '/src/assets/images/shoe1.jpg'

function getStorageBaseUrl(): string {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
  // Strip '/api' to get the base domain
  return apiBase.replace(/\/api\/?$/, '')
}

/**
 * Returns a full URL for an image stored in Laravel storage.
 * Handles: null/undefined paths, absolute URLs, and relative storage paths.
 */
export function getImageUrl(imagePath?: string | null): string {
  if (!imagePath || typeof imagePath !== 'string') return FALLBACK_IMAGE
  if (imagePath.startsWith('http')) return imagePath
  return `${getStorageBaseUrl()}/storage/${imagePath}`
}

/**
 * Composable wrapper - use when you need reactive access or consistent naming.
 */
export function useImageUrl() {
  return { getImageUrl }
}
