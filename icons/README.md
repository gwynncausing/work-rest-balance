# 🎨 Work-Rest Balance Icons

This folder contains the icon assets for the Work-Rest Balance Chrome extension.

## Current Icon Files

### Extension Icons (PNG)
- ✅ `favicon-16x16.png` - 16x16 pixels (toolbar icon, small)
- ✅ `favicon-32x32.png` - 32x32 pixels (toolbar icon, medium)
- ✅ `android-chrome-192x192.png` - 192x192 pixels (larger displays)
- ✅ `android-chrome-512x512.png` - 512x512 pixels (high resolution)

### Web Icons
- ✅ `apple-touch-icon.png` - 180x180 pixels (iOS home screen)
- ✅ `favicon.ico` - Multi-size ICO file (browser favicon)

### Manifest Files
- ✅ `site.webmanifest` - Web app manifest (for PWA functionality)

## Usage in Extension

These icons are referenced in `manifest.json`:

```json
"action": {
  "default_icon": {
    "16": "icons/favicon-16x16.png",
    "32": "icons/favicon-32x32.png"
  }
},
"icons": {
  "16": "icons/favicon-16x16.png",
  "32": "icons/favicon-32x32.png",
  "192": "icons/android-chrome-192x192.png",
  "512": "icons/android-chrome-512x512.png"
}
```

## Icon Design Guidelines

### Current Design
The icons should feature:
- 🎨 Purple gradient (#667eea to #764ba2)
- ⏰ Clock or timer symbol
- 💜 Break/rest related imagery
- ✨ Clean, modern design

### Best Practices
- Keep design simple (especially for 16x16)
- Use high contrast for visibility
- Ensure recognizable at small sizes
- Match app's color scheme
- Use transparent background (PNG)

## Updating Icons

To replace icons:

1. **Create new icons** with same filenames
2. **Maintain sizes**:
   - 16x16, 32x32, 192x192, 512x512
3. **Keep PNG format** for transparency
4. **Reload extension** in Chrome to see changes

## Tools for Creating Icons

### Online Generators
- [Favicon.io](https://favicon.io/) - Generate from text/image
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Complete favicon package
- [Canva](https://www.canva.com/) - Design custom icons

### Desktop Tools
- **Figma** - Professional design tool
- **Inkscape** - Free SVG editor
- **GIMP** - Free image editor
- **Photoshop** - Professional editor

## Icon Specifications

| File | Size | Purpose |
|------|------|---------|
| favicon-16x16.png | 16×16 | Toolbar icon (small) |
| favicon-32x32.png | 32×32 | Toolbar icon (medium) |
| android-chrome-192x192.png | 192×192 | App icon (standard) |
| android-chrome-512x512.png | 512×512 | App icon (hi-res) |
| apple-touch-icon.png | 180×180 | iOS home screen |
| favicon.ico | Multi-size | Browser favicon |

## Testing Icons

After updating icons:

1. Go to `chrome://extensions/`
2. Click **Reload** on Work-Rest Balance
3. Check toolbar icon (should show new design)
4. Pin extension to see icon clearly
5. Open popup to verify it loads correctly

---

**Icons are ready to use! The extension now has proper branding.** 🎨✨
