# Gallery V3 Update Plan

## Current deployed Cloudinary structure

Cloudinary cloud: `dbv8j2dto`

This was checked against the Cloudinary Admin API on 2026-07-12.

| Cloudinary prefix | Current deployed count | Notes |
| --- | ---: | --- |
| `hero-slider/` | 11 | Used by homepage hero slider |
| `thumbnails/` | 10 | Used by portfolio cards |
| `maternity/` | 202 | Used by `src/data/maternity.json` |
| `newborn/` | 435 | Used by `src/data/newborn.json` |
| `6-9-months/` | 103 | Used by `src/data/6-9-months.json` |
| `pre-birthday/` | 402 | Used by `src/data/pre-birthday.json` |
| `cake-smash/` | 88 | Used by `src/data/cake-smash.json` |
| `kids-above-2-indoor/` | 79 | Used by `src/data/kids-above-2-indoor.json` |
| `kids-above-2-outdoor/` | 87 | Used by `src/data/kids-above-2-outdoor.json` |
| `family-shoot/` | 68 | Used by `src/data/family-shoot.json` |
| `baby-shower/` | 402 | Used by `src/data/baby-shower.json` |
| `birthday-events/` | 2410 | Parent prefix total, includes nested event folders and older flat assets |
| `birthday-events/charvis-birthday/` | 611 | Birthday event sub-gallery |
| `birthday-events/deversh-birthday/` | 568 | Birthday event sub-gallery |
| `birthday-events/khushi-birthday/` | 281 | Birthday event sub-gallery |
| `birthday-events/naming-ceremony/` | 284 | Birthday event sub-gallery |
| `birthday-events/ridhima-birthday/` | 538 | Birthday event sub-gallery |
| `birthday-events/nikku-birthday/` | 0 | New local V3 event, not deployed yet |

Important note: `birthday-events/` currently contains both nested birthday event folders and older flat assets. For V3, we should treat the nested folders as the real structure and avoid using a flat `birthday-events.json`.

## Current website gallery wiring

The live website does not discover Cloudinary folders dynamically. The flow is:

1. Images are uploaded to Cloudinary.
2. Cloudinary public IDs are written into JSON files under `src/data/`.
3. Gallery pages import those JSON files.
4. `CloudinaryGallery` renders those IDs with `next-cloudinary`.

Main files:

| Area | File |
| --- | --- |
| Core gallery grid and lightbox | `src/components/CloudinaryGallery.tsx` |
| Portfolio category cards | `src/components/Portfolio.tsx` |
| Gallery header/cover image | `src/components/GalleryHeader.tsx` |
| Kids indoor/outdoor tabs | `src/components/KidsAbove2Tabs.tsx` |
| Gallery routes | `src/app/gallery/**/page.tsx` |
| Gallery data manifests | `src/data/*.json` |
| Old V2 compression script | `scripts/compress-v2-images.js` |
| Old V2 upload + JSON script | `scripts/upload-v2-and-generate-json.js` |

## Local V3 source structure

Local V3 source folder:

`new web sit v3 photo/`

Selected V3 source folders that map cleanly to current website galleries:

| Website gallery | V3 source folder | Local V3 count |
| --- | --- | ---: |
| `maternity` | `1 maternity/1 A Maternity FOR for web UPLOAD` | 252 |
| `newborn` | `2 new born/1 A NEW BORN FOR for web UPLOAD` | 443 |
| `6-9-months` | `3 6 to 9 month baby photoshoot/1 A 6 to 9 month baby shoot` | 102 |
| `pre-birthday` | `4 prebirthday photoshoot { one to two yers/1 A prebirthday one to two ywaer FOR for web UPLOAD` | 379 |
| `cake-smash` | `5 cake smash/1 A cake smash  for web UPLOAD` | 88 |
| `kids-above-2-indoor` | `6 kids above 2 years/inddor/1 A INDDOR kids above 2 year for web UPLOAD` | 128 |
| `kids-above-2-outdoor` | `6 kids above 2 years/out door/1 Akids above 2 year OUT DOOR for web UPLOAD` | 87 |
| `baby-shower` | `8 baby shower/pranali Baby Shower` | 596 |
| `family-shoot` | `9 family shoot` | 68 |
| `hero-slider` | `hero slider` | 11 |

Birthday event V3 source folders:

| Event | V3 source folder | Local V3 count | Current deployed count |
| --- | --- | ---: | ---: |
| Charvis Birthday | `7 birth day event shoot/Charvis birthday` | 612 | 611 |
| Deversh 5th Birthday | `7 birth day event shoot/deversh 5th birthday` | 568 | 568 |
| Khushi Birthday | `7 birth day event shoot/KKHUSHI BIRTHDAY` | 281 | 281 |
| Naming Ceremony | `7 birth day event shoot/Nilesh Kade daughter Naming Ceremony` | 284 | 284 |
| Ridhima Birthday | `7 birth day event shoot/Ridhima birthday` | 538 | 538 |
| Nikku Daughter 1st Birthday | `7 birth day event shoot/nikku daughter 1st birthday` | 430 | 0 |

## New or unmapped V3 content

These exist locally in V3 but are not fully wired as website galleries yet:

| Local V3 item | Count | Recommendation |
| --- | ---: | --- |
| `7 birth day event shoot/nikku daughter 1st birthday` | 430 | Add as new birthday event page and Cloudinary folder `birthday-events/nikku-birthday/` |
| `7a inbox spl shoot` | 6 | Decide whether this becomes a new gallery, a portfolio card, or stays unused |
| `certificate` | 9 | Existing awards section uses local certificates, not Cloudinary gallery data |
| Root-level V3 photos | 10 | Likely thumbnails or loose assets; decide manually before upload |

## Gallery V3 Cloudinary target structure

Keep the existing public folder names where possible so route files and portfolio links do not need a big rewrite.

Recommended V3 Cloudinary folders:

```text
hero-slider/
thumbnails/
maternity/
newborn/
6-9-months/
pre-birthday/
cake-smash/
kids-above-2-indoor/
kids-above-2-outdoor/
family-shoot/
baby-shower/
birthday-events/charvis-birthday/
birthday-events/deversh-birthday/
birthday-events/khushi-birthday/
birthday-events/naming-ceremony/
birthday-events/ridhima-birthday/
birthday-events/nikku-birthday/
```

Optional only if we decide to show it on the site:

```text
inbox-special/
```

## Compress V3 plan

Create a new script instead of changing the old V2 script:

`scripts/compress-v3-images.js`

It should:

1. Read originals from `new web sit v3 photo/`.
2. Write compressed output to `compressed-v3/`.
3. Never modify original photos.
4. Use `sharp`.
5. Auto-rotate via EXIF.
6. Resize longest edge to around `2500px`.
7. Export progressive JPEG at quality `82`.
8. Preserve clean filenames where possible.
9. Prefix birthday event filenames only if needed to avoid collisions.

Recommended output:

```text
compressed-v3/
├── maternity/
├── newborn/
├── 6-9-months/
├── pre-birthday/
├── cake-smash/
├── kids-above-2-indoor/
├── kids-above-2-outdoor/
├── family-shoot/
├── baby-shower/
├── hero-slider/
└── birthday-events/
    ├── charvis-birthday/
    ├── deversh-birthday/
    ├── khushi-birthday/
    ├── naming-ceremony/
    ├── ridhima-birthday/
    └── nikku-birthday/
```

This nested birthday output is cleaner than the old V2 flattening approach.

## Upload V3 plan

Create another new script:

`scripts/upload-v3-and-generate-json.js`

It should:

1. Read compressed images from `compressed-v3/`.
2. Upload each compressed folder to the matching Cloudinary folder.
3. Use `overwrite: true` and `invalidate: true`.
4. Delete old gallery resources before upload only after V3 compression has been verified.
5. Upload birthday events into nested folders.
6. Regenerate `src/data/*.json` from Cloudinary after upload.
7. Add a new JSON file for Nikku:
   `src/data/birthday-nikku.json`

Recommended safety modes:

```bash
node scripts/upload-v3-and-generate-json.js --dry-run
node scripts/upload-v3-and-generate-json.js
```

The dry run should show counts and target folders without deleting or uploading anything.

## Website code changes needed for V3

Most existing galleries can keep the same pages and data file names.

Expected changed or added files:

| Change | File |
| --- | --- |
| Regenerate gallery JSON | `src/data/maternity.json` and other existing gallery JSON files |
| Add Nikku JSON | `src/data/birthday-nikku.json` |
| Add Nikku birthday page | `src/app/gallery/birthday-events/nikku/page.tsx` |
| Add Nikku event card | `src/app/gallery/birthday-events/page.tsx` |
| Add optional new portfolio card if needed | `src/components/Portfolio.tsx` |
| Add optional new gallery route if `7a inbox spl shoot` becomes public | `src/app/gallery/inbox-special/page.tsx` |

## Recommended execution sequence

1. Confirm which optional V3 items should go live:
   `nikku-birthday` should go live if birthday events need the complete V3 set.
   `inbox-special` needs a decision.

2. Create V3 scripts:
   `scripts/compress-v3-images.js`
   `scripts/upload-v3-and-generate-json.js`

3. Run compression:

```bash
node scripts/compress-v3-images.js
```

4. Inspect compressed output counts:

```bash
find compressed-v3 -type f | wc -l
find compressed-v3 -maxdepth 3 -type d | sort
```

5. Dry-run Cloudinary upload:

```bash
node scripts/upload-v3-and-generate-json.js --dry-run
```

6. Upload V3 to Cloudinary and regenerate JSON:

```bash
node scripts/upload-v3-and-generate-json.js
```

7. Update website pages for any new galleries:
   add Nikku birthday page/card at minimum.

8. Build and test:

```bash
npm run build
```

9. Deploy:
   commit changed scripts, changed `src/data/*.json`, and any new route/component updates.

## Current blocker in this shell

The current shell does not have `node`, `npm`, or `npx` available in `PATH`, so compression and upload scripts cannot be run from this exact terminal session yet.

Before running V3 scripts, install/fix Node.js in the environment or run from a terminal where `node` and `npm` are available.

