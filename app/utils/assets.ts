/**
 * Asset path utilities for MetaMorph application
 * Provides helper functions for accessing static assets
 */

// Base asset paths
const ASSETS_BASE = '/assets';
const IMAGES_PATH = `${ASSETS_BASE}/images`;
const ICONS_PATH = `${ASSETS_BASE}/icons`;
const FONTS_PATH = `${ASSETS_BASE}/fonts`;

/**
 * Get image asset path
 * @param filename - Image filename with extension
 * @returns Full path to image asset
 */
export const getImagePath = (filename: string): string => {
  return `${IMAGES_PATH}/${filename}`;
};

/**
 * Get icon asset path
 * @param filename - Icon filename with extension
 * @returns Full path to icon asset
 */
export const getIconPath = (filename: string): string => {
  return `${ICONS_PATH}/${filename}`;
};

/**
 * Get font asset path
 * @param filename - Font filename with extension
 * @returns Full path to font asset
 */
export const getFontPath = (filename: string): string => {
  return `${FONTS_PATH}/${filename}`;
};

/**
 * Get logo paths for MetaMorph branding
 */
export const LOGO_ASSETS = {
  main: getImagePath('logooo.png'),
  animated: getImagePath('logooo.gif'),
  icon: getIconPath('log.ico'),
  favicon: '/favicon.ico',
} as const;

/**
 * Common icon sizes for responsive design
 */
export const ICON_SIZES = {
  small: 16,
  medium: 24,
  large: 32,
  xlarge: 48,
  hero: 64,
} as const;

/**
 * Get responsive image srcSet for Next.js Image component
 * @param baseName - Base filename without size suffix
 * @param extension - File extension (e.g., 'png', 'jpg')
 * @param sizes - Array of sizes available
 * @returns srcSet string for responsive images
 */
export const getResponsiveImageSrcSet = (
  baseName: string,
  extension: string,
  sizes: number[]
): string => {
  return sizes
    .map(size => `${getImagePath(`${baseName}-${size}x${size}.${extension}`)} ${size}w`)
    .join(', ');
};

/**
 * Get Open Graph image path for social media sharing
 * @param filename - OG image filename
 * @returns Full URL for Open Graph image
 */
export const getOGImagePath = (filename: string = 'og-image.png'): string => {
  return getImagePath(filename);
};

/**
 * Asset preloading utility for performance optimization
 * @param assets - Array of asset paths to preload
 */
export const preloadAssets = (assets: string[]): void => {
  if (typeof window === 'undefined') return;
  
  assets.forEach(assetPath => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = assetPath;
    document.head.appendChild(link);
  });
};

/**
 * Check if asset exists (client-side only)
 * @param assetPath - Path to asset
 * @returns Promise that resolves to boolean
 */
export const assetExists = async (assetPath: string): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  try {
    const response = await fetch(assetPath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Common asset preloading for MetaMorph application
 * Call this to preload important assets on app start
 */
export const preloadCriticalAssets = (): void => {
  preloadAssets([
    LOGO_ASSETS.main,
    LOGO_ASSETS.animated,
    LOGO_ASSETS.icon,
  ]);
};