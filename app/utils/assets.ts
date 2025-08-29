const ASSETS_BASE = '/assets';
const IMAGES_PATH = `${ASSETS_BASE}/images`;
const ICONS_PATH = `${ASSETS_BASE}/icons`;
const FONTS_PATH = `${ASSETS_BASE}/fonts`;

export const getImagePath = (filename: string): string => {
  return `${IMAGES_PATH}/${filename}`;
};

export const getIconPath = (filename: string): string => {
  return `${ICONS_PATH}/${filename}`;
};

export const getFontPath = (filename: string): string => {
  return `${FONTS_PATH}/${filename}`;
};

export const LOGO_ASSETS = {
  main: getImagePath('logooo.png'),
  animated: getImagePath('logooo.gif'),
  icon: getIconPath('log.ico'),
  favicon: '/favicon.ico',
} as const;

export const ICON_SIZES = {
  small: 16,
  medium: 24,
  large: 32,
  xlarge: 48,
  hero: 64,
} as const;

export const getResponsiveImageSrcSet = (
  baseName: string,
  extension: string,
  sizes: number[]
): string => {
  return sizes
    .map(size => `${getImagePath(`${baseName}-${size}x${size}.${extension}`)} ${size}w`)
    .join(', ');
};

export const getOGImagePath = (filename: string = 'og-image.png'): string => {
  return getImagePath(filename);
};

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

export const assetExists = async (assetPath: string): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  try {
    const response = await fetch(assetPath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

export const preloadCriticalAssets = (): void => {
  preloadAssets([
    LOGO_ASSETS.main,
    LOGO_ASSETS.animated,
    LOGO_ASSETS.icon,
  ]);
};