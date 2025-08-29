# 📁 Assets Folder Structure

This folder contains all static assets for the MetaMorph application.

## 📂 Folder Organization

### 🖼️ `/images/`
- **Logo files:** `logooo.png`, `logooo.gif`
- **Icons and graphics**
- **UI images and illustrations**
- **Screenshots and previews**

### 🎯 `/icons/`
- **Favicon files**
- **App icons for different platforms**
- **SVG icons for UI elements**
- **Social media icons**

### 🔤 `/fonts/`
- **Custom font files** (if any)
- **Font variations and weights**
- **Web font formats** (.woff, .woff2, .ttf)

## 🎨 Usage Examples

### In React Components:
```jsx
// For images
<img src="/assets/images/logooo.png" alt="MetaMorph Logo" />

// For icons
<link rel="icon" href="/assets/icons/favicon.ico" />

// For fonts (in CSS)
@font-face {
  font-family: 'CustomFont';
  src: url('/assets/fonts/custom-font.woff2') format('woff2');
}
```

### In CSS/SCSS:
```css
.logo {
  background-image: url('/assets/images/logooo.png');
}

.custom-icon {
  content: url('/assets/icons/custom-icon.svg');
}
```

### In Next.js Image Component:
```jsx
import Image from 'next/image';

<Image 
  src="/assets/images/logooo.png" 
  alt="MetaMorph Logo"
  width={150}
  height={150}
/>
```

## 📝 File Naming Conventions

- Use **kebab-case** for file names: `my-image.png`
- Include **descriptive names**: `metamorph-logo.png` instead of `logo.png`
- Add **size indicators** when needed: `icon-24x24.png`, `hero-1920x1080.jpg`
- Use **appropriate extensions**: `.png` for logos, `.jpg` for photos, `.svg` for icons

## 🔧 Supported File Formats

### Images:
- **PNG:** Logos, icons with transparency
- **JPG/JPEG:** Photos, high-quality images
- **SVG:** Vector graphics, scalable icons
- **GIF:** Animated images
- **WebP:** Modern image format for better compression

### Icons:
- **ICO:** Favicons for older browsers
- **SVG:** Scalable vector icons
- **PNG:** Icon sets with different sizes

### Fonts:
- **WOFF2:** Modern web font format (preferred)
- **WOFF:** Web font format (fallback)
- **TTF/OTF:** Traditional font formats

## 🚀 Performance Tips

1. **Optimize images** before adding them
2. Use **WebP format** for better compression
3. Provide **multiple sizes** for responsive images
4. Use **SVG** for simple graphics and icons
5. **Compress fonts** to reduce load times

## 📱 Current Assets

- `logooo.png` - Main MetaMorph logo
- `logooo.gif` - Animated MetaMorph logo
- `log.ico` - Favicon (copied to root as favicon.ico)