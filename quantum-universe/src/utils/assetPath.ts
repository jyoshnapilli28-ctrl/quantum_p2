/**
 * QYNX Universal Asset Path Resolver
 * 
 * Safely resolves asset paths in any environment:
 * - Local development (root '/')
 * - Production root deployment ('/')
 * - Production subpath deployment (e.g. '/quantum_p2/', '/qynx/')
 * - Relative hosting ('./')
 */

export function getAssetUrl(path: string): string {
  if (!path) return '';

  // Return absolute or data URLs directly
  if (/^(https?:|data:|blob:|\/\/)/i.test(path)) {
    return path;
  }

  // Strip leading slashes to make relative to base
  const cleanPath = path.replace(/^\/+/, '');

  // 1. If Vite base URL is defined and absolute or valid subpath
  const baseUrl = import.meta.env.BASE_URL;
  if (baseUrl && baseUrl !== './' && baseUrl !== '.') {
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${normalizedBase}${cleanPath}`;
  }

  // 2. In browser environment, resolve dynamically relative to current script bundle or origin
  if (typeof window !== 'undefined') {
    try {
      // In production Vite, chunks are loaded from <base>/assets/<chunk>.js
      if (import.meta.url && !import.meta.url.includes('/src/')) {
        const url = new URL(import.meta.url);
        const assetsIndex = url.pathname.indexOf('/assets/');
        if (assetsIndex !== -1) {
          const basePath = url.pathname.slice(0, assetsIndex + 1);
          return `${url.origin}${basePath}${cleanPath}`;
        }
      }
    } catch {
      // Ignore URL parsing errors and fallback
    }

    // 3. Fallback to document base URI
    try {
      const baseUri = document.baseURI || window.location.href;
      const baseObj = new URL(baseUri);
      let dir = baseObj.pathname;
      if (!dir.endsWith('/')) {
        dir = dir.slice(0, dir.lastIndexOf('/') + 1);
      }
      return `${baseObj.origin}${dir}${cleanPath}`;
    } catch {
      // Fallback
    }
  }

  // Fallback for SSR or direct resolution
  return `/${cleanPath}`;
}
