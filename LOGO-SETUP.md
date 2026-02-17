# 📸 Logo Setup Instructions

## Quick Setup

1. **Prepare your logo file:**
   - Format: PNG with transparent background (recommended)
   - Size: 200-300 pixels wide, height proportional
   - Name: `logo.png`

2. **Add to project:**
   ```
   Copy logo.png to: /public/logo.png
   ```

3. **Rebuild:**
   ```bash
   npm run build
   ```

4. **The header will automatically:**
   - Show your logo instead of text
   - Maintain aspect ratio
   - Scale responsively on mobile
   - Fallback to "Memories by Barkha" text if logo fails to load

## Logo Specifications

### Recommended Sizes:
- **Desktop**: 200px wide × 60-80px tall
- **Mobile**: Auto-scales to fit
- **High DPI (Retina)**: 2x size (400px × 120-160px)

### File Formats (in order of preference):
1. **SVG** - Best for logos (scalable, small file size)
2. **PNG** - Good with transparency
3. **WebP** - Modern, smaller file size
4. **JPG** - Only if no transparency needed

### Optimization:
- Use TinyPNG.com to compress PNG files
- Keep file size under 50KB
- Use transparent background

## Current Header Behavior

### When Scrolled Up (Top of Page):
- Transparent background
- White logo/text with drop shadow
- White border button

### When Scrolled Down:
- White background
- Black logo/text
- Black border button
- Shadow appears

## Example Logo Placement

Your file structure should look like:
```
nextjs-photography/
├── public/
│   ├── logo.png          ← Place your logo here
│   ├── optimized/
│   │   ├── hero-slider/
│   │   ├── photographers/
│   │   └── portfolio/
│   └── .htaccess
├── src/
└── ...
```

## Testing Your Logo

1. Place `logo.png` in `/public/`
2. Run `npm run build`
3. Open `http://localhost:3000`
4. Check:
   - Logo appears in header
   - Logo is visible on transparent background
   - Logo changes appropriately when scrolling
   - Mobile view shows logo correctly

## Troubleshooting

**Logo not showing?**
- Check file name is exactly `logo.png` (lowercase)
- Verify it's in `/public/` folder (not `/public/optimized/`)
- Clear browser cache
- Rebuild project

**Logo too big/small?**
- Resize to 200-300px wide before uploading
- Header auto-adjusts height: h-8 sm:h-10 md:h-12

**Logo hard to see on hero images?**
- Use white/light colored logo for transparent header
- Or add drop shadow effect (already included)

## Advanced: Using SVG Logo

If you have an SVG logo, rename it to `logo.svg` and update Header.tsx:

```tsx
<img 
  src="/logo.svg" 
  alt="Memories by Barkha" 
  className="h-8 sm:h-10 md:h-12 w-auto object-contain"
/>
```

SVG benefits:
- Infinitely scalable
- Smaller file size
- Sharp on all displays
