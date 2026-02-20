# Mom and Kids Photography — Full Project Documentation

> **Live Site:** Deployed on Vercel  
> **GitHub:** https://github.com/tanmay5110/momandkids-photography  
> **Cloudinary Cloud:** `dbv8j2dto`

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Directory Structure](#2-directory-structure)
3. [Pages](#3-pages)
4. [Component Breakdown](#4-component-breakdown)
5. [Image Gallery System](#5-image-gallery-system)
6. [Cloudinary Setup](#6-cloudinary-setup)
7. [Gallery Data Files](#7-gallery-data-files)
8. [Image Counts](#8-image-counts)
9. [Local Static Assets](#9-local-static-assets)
10. [Upload Scripts](#10-upload-scripts)
11. [Environment Variables](#11-environment-variables)
12. [Deployment](#12-deployment)
13. [Known Issues / Lint Warnings](#13-known-issues--lint-warnings)

---

## 1. Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **Next.js** | 16.0.7 | Framework (App Router, static export) |
| **React** | 19 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling |
| **next-cloudinary** | 6.17.5 | Cloudinary image component (`CldImage`) |
| **lucide-react** | latest | Icons (Phone, ChevronLeft, etc.) |
| **Turbopack** | (bundled) | Fast dev/build bundler |

**Output mode:** `output: 'export'` — generates a fully **static HTML/CSS/JS** site (no server-side rendering). Hosted as static files on Vercel.

---

## 2. Directory Structure

```
nextjs-photography/
│
├── src/
│   ├── app/                        ← Next.js App Router pages
│   │   ├── globals.css             ← Global Tailwind + custom styles
│   │   ├── layout.tsx              ← Root layout (fonts, metadata)
│   │   ├── page.tsx                ← Homepage (/)
│   │   └── gallery/
│   │       ├── maternity/page.tsx
│   │       ├── newborn/page.tsx
│   │       ├── 6-9-months/page.tsx
│   │       ├── pre-birthday/page.tsx
│   │       ├── cake-smash/page.tsx
│   │       ├── kids-above-2/page.tsx
│   │       ├── birthday-events/page.tsx
│   │       └── baby-shower/page.tsx
│   │
│   ├── components/                 ← All reusable React components
│   │   ├── Header.tsx
│   │   ├── HeroSlider.tsx
│   │   ├── HeroContent.tsx
│   │   ├── About.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Awards.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Footer.tsx
│   │   ├── GalleryHeader.tsx       ← Shared header for all gallery pages
│   │   ├── CloudinaryGallery.tsx   ← Core gallery/lightbox component
│   │   ├── KidsAbove2Tabs.tsx      ← Indoor/outdoor tab switcher
│   │   ├── MaternityGallery.tsx    ← (alternate, not currently used in routing)
│   │   └── AnimatedBackground.tsx  ← Canvas particle animation
│   │
│   └── data/                       ← Cloudinary public ID arrays (JSON)
│       ├── maternity.json
│       ├── newborn.json
│       ├── 6-9-months.json
│       ├── pre-birthday.json
│       ├── cake-smash.json
│       ├── kids-above-2-indoor.json
│       ├── kids-above-2-outdoor.json
│       ├── birthday-events.json
│       ├── baby-shower.json
│       └── thumbnails.json
│
├── public/                         ← Static files served directly
│   ├── logo.png                    ← Studio logo
│   ├── robots.txt
│   ├── vite.svg
│   ├── certificate/                ← 8 award/certificate JPG images (local)
│   │   ├── IMG_20251202_203025_1 copy.jpg
│   │   ├── IMG_20251202_203206_1 copy.jpg
│   │   ├── IMG_20251202_203236_1 copy.jpg
│   │   ├── IMG_20251202_203330_1 copy.jpg
│   │   ├── IMG_20251202_203457_1 copy.jpg
│   │   ├── IMG_20251202_203546_1 copy.jpg
│   │   ├── IMG_20251202_203622_1 copy.jpg
│   │   ├── IMG_20251202_203703_1 copy.jpg
│   │   └── —Pngtree—luxury golden rectangle...png (decorative frame)
│   └── hero-slider/                ← Local copies of hero images + photographer photos
│       ├── 1.jpg → 12.jpg          ← Hero slider photos (also on Cloudinary)
│       ├── satish.jpg              ← Lead photographer photo
│       └── rohini.jpg              ← Senior photographer photo
│
├── scripts/                        ← Node.js CLI scripts for Cloudinary management
│   ├── upload-to-cloudinary.js
│   ├── upload-all-galleries.js
│   ├── upload-new-galleries.js
│   ├── upload-all-optimized.js
│   ├── upload-maternity-test.js
│   ├── sync-cloudinary.js
│   ├── sync-all-galleries.js
│   ├── reorganize-cloudinary.js
│   ├── optimize-large-images.js
│   ├── delete-cloudinary.js
│   ├── delete-all-cloudinary.js
│   ├── test-cloudinary.js
│   ├── test-folder-upload.js
│   └── cleanup-test-folders.js
│
├── .env.local                      ← Local secrets (not committed)
├── .env.production                 ← NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (committed)
├── .env.example                    ← Template for env vars
├── .gitignore
├── next.config.ts                  ← Next.js config (static export, image domains)
├── package.json
├── tsconfig.json
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## 3. Pages

### Homepage `/`

**File:** `src/app/page.tsx`

Renders the full homepage by composing 8 sections in order:

```
Header → HeroSlider → HeroContent → About → Portfolio → Awards → Testimonials → Footer
```

### Gallery Pages `/gallery/[category]`

All 8 gallery pages follow the **same pattern**:

```tsx
import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import images from '@/data/[category].json';

export const metadata = { title: '...', description: '...', keywords: '...' };

export default function Page() {
  return (
    <main>
      <GalleryHeader title="..." description="..." imageCount={images.length} />
      <div className="container">
        <CloudinaryGallery ids={images} />
      </div>
    </main>
  );
}
```

**Exception — Kids Above 2:** Uses `KidsAbove2Tabs` with two JSON files (indoor + outdoor) instead of `CloudinaryGallery` directly.

| Route | Data File | Notes |
|-------|-----------|-------|
| `/gallery/maternity` | `maternity.json` | Standard |
| `/gallery/newborn` | `newborn.json` | Standard |
| `/gallery/6-9-months` | `6-9-months.json` | Standard |
| `/gallery/pre-birthday` | `pre-birthday.json` | Standard |
| `/gallery/cake-smash` | `cake-smash.json` | Standard |
| `/gallery/birthday-events` | `birthday-events.json` | Standard |
| `/gallery/baby-shower` | `baby-shower.json` | Standard |
| `/gallery/kids-above-2` | `kids-above-2-indoor.json` + `kids-above-2-outdoor.json` | Tab interface |

---

## 4. Component Breakdown

### `Header.tsx`
- Fixed header, always on top (`z-50`)
- **Scroll effect:** transparent + white text when at top → white background + dark text after 100px scroll
- Logo loads from `/logo.png` with text fallback on error
- Desktop nav: Home, About Us, Portfolio, Testimonials (anchor links to sections)
- Call button: `tel:+919321130477` with Phone icon (lucide-react)
- Mobile: nav hidden, only logo + call button visible

### `HeroSlider.tsx`
- Full-screen image slider (`h-[75svh]` mobile, `h-screen` desktop)
- **11 slides** from Cloudinary (`hero-slider/1` through `hero-slider/12`, skipping 3)
- Auto-advances every **5 seconds**
- Manual prev/next arrow buttons
- Dot indicators at bottom
- Uses `CldImage` with `fill` prop and `priority` on first 2 slides
- Right-click disabled (image protection)

### `HeroContent.tsx`
- Text section immediately below the hero slider
- Studio tagline, call-to-action text

### `About.tsx`
- Two-column photographer profiles: **Satish** and **Rohini**
- Photos loaded from local `/hero-slider/satish.jpg` and `/hero-slider/rohini.jpg`
- Regular `<img>` tag (not CldImage) — local files
- Hover scale effect, gradient overlay

### `Portfolio.tsx`
- 8 category preview cards in a `grid md:grid-cols-2 lg:grid-cols-4` grid
- Each card: thumbnail image from Cloudinary + link button to gallery page
- Thumbnail IDs stored directly in the component (e.g., `thumbnails/maternity`)
- Uses `CldImage` with `fill` and hover zoom effect

### `Awards.tsx`
- Horizontal scrolling / train animation of **8 certificate** images
- Images loaded from `/public/certificate/` (local static files, NOT Cloudinary)
- Uses regular `<img>` tag
- Decorative golden Pngtree frame overlay
- Animated rail — certificates scroll past continuously

### `Testimonials.tsx`
- Client review cards with star ratings
- Static hardcoded text data (no external API)

### `Footer.tsx`
- Studio contact details, social links, copyright

### `GalleryHeader.tsx`
- Replaces `Header.tsx` on gallery pages (has a back-to-home link)
- Built-in mini background slider using **3 maternity images** from Cloudinary
- Shows gallery title, description, and image count
- Own scroll-aware styling
- Same desktop nav as main header + "Book a Session" call button

### `CloudinaryGallery.tsx` ← **Core Gallery Component**

See full breakdown in [Section 5](#5-image-gallery-system).

### `KidsAbove2Tabs.tsx`
- Tab switcher: **🏠 Indoor Studio** | **🌳 Outdoor**
- Shows image count in each tab button
- Switches between two `CloudinaryGallery` instances
- Active tab has warm gold (`#D4A574`) background

### `AnimatedBackground.tsx`
- Canvas-based particle animation
- 25 floating gold particles
- Used as decorative background (currently placed in certain sections)

### `MaternityGallery.tsx`
- Alternative gallery component (exists in codebase, not used in current routing)

---

## 5. Image Gallery System

This is the heart of the website. The entire gallery system is built around:

```
Cloudinary CDN → CldImage (next-cloudinary) → CloudinaryGallery component → Gallery pages
```

### How it works step by step:

**Step 1 — Image IDs in JSON**  
Every gallery image is identified by its **Cloudinary public ID** stored in a JSON array:
```json
["maternity/856", "maternity/855", "maternity/854", ...]
```

**Step 2 — Page imports JSON**  
Each gallery page imports the JSON and passes the array to `CloudinaryGallery`:
```tsx
import maternityImages from '@/data/maternity.json';
<CloudinaryGallery ids={maternityImages} />
```

**Step 3 — Masonry Grid Layout**  
`CloudinaryGallery` distributes images across responsive columns:
- Mobile (< 768px): **2 columns**
- Tablet (768px–1023px): **3 columns**
- Desktop (≥ 1024px): **4 columns**

Images are distributed round-robin: image 0→col0, image 1→col1... creating a balanced masonry look.

**Step 4 — Thumbnail rendering**  
Each image renders as:
```tsx
<CldImage
  src={publicId}
  width={600}
  height={900}
  crop="limit"
  quality="auto"
  format="auto"
  loading="lazy"
  sizes="(max-width: 768px) 50vw, ..."
/>
```
Cloudinary auto-optimizes format (WebP/AVIF) and quality.

**Step 5 — Lightbox on click**  
Clicking any image opens a fullscreen lightbox:
- Black `bg-black/95` overlay
- High-quality image at `width={1920}` / `quality={90}`
- Blurred low-quality placeholder (quality 10) shown during load
- Prev/Next navigation buttons
- Image counter (`1 / 165`)
- Close button (×)
- Browser back button support (pushes history state)

**Step 6 — Mobile gestures**  
The lightbox supports:
- **Pinch to zoom** (up to 4×) — two-finger touch
- **Pan/drag** — single finger when zoomed in
- **Double-tap** — resets zoom to 1×
- **Zoom indicator** shows current percentage

**Image Protection features:**
- `draggable={false}` on all images
- `onContextMenu={(e) => e.preventDefault()}` everywhere
- Invisible `<div>` overlay on all images blocks right-click save

---

## 6. Cloudinary Setup

**Cloud Name:** `dbv8j2dto`  
**Account:** Cloudinary free / paid tier

### Folder structure on Cloudinary:

```
dbv8j2dto/
├── hero-slider/        ← Hero slider images (1.jpg, 2.jpg, ..., 12.jpg)
├── thumbnails/         ← Portfolio preview thumbnails
│   ├── maternity
│   ├── newborn
│   ├── 6-to-9-months
│   ├── pre-birthday
│   ├── cake-smash
│   ├── kids-above-2
│   └── birthday-events
├── maternity/          ← Gallery images (856 files, IDs 856 down)
├── newborn/            ← Gallery images
├── 6-9-months/         ← Gallery images (folder named with dash)
├── pre-birthday/
├── cake-smash/
├── kids-above-2-indoor/
├── kids-above-2-outdoor/
├── birthday-events/
└── baby-shower/
```

### Image transformations used:

| Use Case | Width | Height | Crop | Quality | Format |
|----------|-------|--------|------|---------|--------|
| Hero slider | fill | fill | fill | 85 | auto |
| Portfolio thumb | fill | fill | fill | auto | auto |
| Gallery thumbnail | 600 | 900 | limit | auto | auto |
| Lightbox placeholder | 100 | 100 | fill | 10 | auto |
| Lightbox fullsize | 1920 | 1080 | limit | 90 | auto |
| Gallery header bg | fill | fill | fill | auto | auto |

---

## 7. Gallery Data Files

Located in `src/data/`. Each file is a **plain JSON array of strings** (Cloudinary public IDs).

**Example (`maternity.json`):**
```json
[
  "maternity/856",
  "maternity/855",
  "maternity/854",
  ...
]
```

**To add new images:**
1. Upload the image to Cloudinary into the correct folder
2. Add its public ID to the corresponding JSON file
3. Commit and push → Vercel auto-redeploys

---

## 8. Image Counts

| Gallery | JSON File | Image Count |
|---------|-----------|-------------|
| Maternity | `maternity.json` | **165** |
| Newborn | `newborn.json` | **332** |
| 6-9 Months | `6-9-months.json` | **103** |
| Pre Birthday | `pre-birthday.json` | **332** |
| Cake Smash | `cake-smash.json` | **72** |
| Kids Indoor | `kids-above-2-indoor.json` | **77** |
| Kids Outdoor | `kids-above-2-outdoor.json` | **87** |
| Birthday Events | `birthday-events.json` | **128** |
| Baby Shower | `baby-shower.json` | **201** |
| **TOTAL** | | **~1,497 images** |

---

## 9. Local Static Assets

These are stored **in the repo** under `public/` and served directly:

| File/Folder | Contents | Used In |
|-------------|----------|---------|
| `public/logo.png` | Studio logo | Header, GalleryHeader |
| `public/hero-slider/satish.jpg` | Lead photographer photo | About section |
| `public/hero-slider/rohini.jpg` | Senior photographer photo | About section |
| `public/hero-slider/1–12.jpg` | Hero slide photos (local backup) | — (Cloudinary used instead) |
| `public/certificate/*.jpg` | 8 award certificate images | Awards section |
| `public/robots.txt` | SEO robots file | — |

> **Note:** Hero slider images exist both locally in `public/hero-slider/` AND on Cloudinary. The live site uses the **Cloudinary versions** via `CldImage`. The local copies are backups.

---

## 10. Upload Scripts

Located in `scripts/`. These are **Node.js CommonJS scripts** run locally with `.env.local` credentials. They are NOT part of Vercel's build.

| Script | Purpose |
|--------|---------|
| `upload-to-cloudinary.js` | Base upload utility |
| `upload-all-galleries.js` | Upload all gallery folders |
| `upload-new-galleries.js` | Upload only new/missing images |
| `upload-all-optimized.js` | Upload with optimization |
| `upload-maternity-test.js` | Test maternity uploads |
| `sync-cloudinary.js` | Sync local → Cloudinary |
| `sync-all-galleries.js` | Sync all folders |
| `reorganize-cloudinary.js` | Restructure Cloudinary folders |
| `optimize-large-images.js` | Compress images before upload |
| `delete-cloudinary.js` | Delete specific images |
| `delete-all-cloudinary.js` | ⚠️ Delete everything (use with caution) |
| `test-cloudinary.js` | Test Cloudinary connection |
| `test-folder-upload.js` | Test one folder upload |
| `cleanup-test-folders.js` | Remove test/temp folders |

**To run a script:**
```bash
# Make sure .env.local has Cloudinary credentials
node scripts/upload-all-galleries.js
```

---

## 11. Environment Variables

| Variable | Required For | Where Set |
|----------|-------------|-----------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Build + runtime (images) | `.env.production` (committed) |
| `CLOUDINARY_API_KEY` | Upload scripts only | `.env.local` (NOT committed) |
| `CLOUDINARY_API_SECRET` | Upload scripts only | `.env.local` (NOT committed) |
| `CLOUDINARY_CLOUD_NAME` | Upload scripts only | `.env.local` (NOT committed) |

**`.env.production`** (committed to git — safe because cloud name is public):
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dbv8j2dto
```

**`.env.local`** (never committed — contains secrets):
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dbv8j2dto
CLOUDINARY_CLOUD_NAME=dbv8j2dto
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> The site is **fully static** — it does NOT call the Cloudinary API at runtime. Images are served from Cloudinary's CDN via pre-built URLs. Only `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is needed for the build.

---

## 12. Deployment

### Vercel (Production)

- **Type:** Static export (`output: 'export'`)
- **Branch:** `master`
- **Build command:** `npm run build` (auto-detected)
- **Install command:** `npm install` (auto-detected)
- **No env vars needed** in Vercel dashboard (`.env.production` is committed)
- Auto-deploys on every push to `master`

### Local Development

```bash
npm install
npm run dev       # Start dev server at localhost:3000
npm run build     # Build for production
npm run lint      # Check for lint issues
```

### Next.js Configuration (`next.config.ts`)

```ts
const nextConfig = {
  output: 'export',           // Static HTML export
  images: {
    unoptimized: true,        // Required for static export
    qualities: [75, 85, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'tanmaywebtest.me' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};
```

---

## 13. Known Issues / Lint Warnings

| Issue | Location | Severity | Impact |
|-------|----------|----------|--------|
| `require()` style imports | All `scripts/*.js` | Warning (lint only) | None — scripts still work |
| `setState` inside `useEffect` body | `CloudinaryGallery.tsx:56` | Warning | Minor — causes one extra render on resize |
| Unused import `Metadata` | `layout.tsx:1` | Warning | None |
| Unused import `CloudinaryGallery` | `gallery/kids-above-2/page.tsx:1` | Warning | None |
| `<img>` instead of `<Image />` | `About.tsx`, `Awards.tsx` | Info | Slight LCP impact; works fine |
| Inline `class` declaration | `AnimatedBackground.tsx:33` | Warning | Turbopack compilation skipped for that component |

> All issues are **warnings only** — the build passes successfully and the site works correctly in production.

---

*Last updated: February 2026*
