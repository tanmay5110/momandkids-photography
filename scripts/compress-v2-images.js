/**
 * compress-v2-images.js
 *
 * Reads all "for web upload" subfolders from the v2 photo directory,
 * compresses each image to max 2500px / quality 82 progressive JPEG,
 * and writes output to scripts/compressed-v2/<gallery>/<filename>.jpg
 *
 * Originals are NEVER modified.
 *
 * Run: node scripts/compress-v2-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ─── CONFIG ────────────────────────────────────────────────────────────────

const V2_BASE = path.join(__dirname, '../new web sit v2 photo');
const OUT_BASE = path.join(__dirname, '../compressed-v2');
const MAX_PX   = 2500;   // longest edge cap
const QUALITY  = 82;     // JPEG quality (82 is visually near-lossless for web)

// Map: output gallery folder name → source folder path (relative to V2_BASE)
// Only the "for web upload" folders — no sub-tiers, no AI edits
const GALLERY_MAP = {
  'maternity': '1 maternity/1 A Maternity FOR for web UPLOAD',
  'newborn':   '2 new born/1 A NEW BORN FOR for web UPLOAD',
  '6-9-months':    '3 6 to 9 month baby photoshoot/1 A 6 to 9 month baby shoot',
  'pre-birthday':  '4 prebirthday photoshoot { one to two yers/1 A prebirthday one to two ywaer FOR for web UPLOAD',
  'cake-smash':    '5 cake smash/1 A cake smash  for web UPLOAD',
  'kids-above-2-indoor':  '6 kids above 2 years/inddor/1 A INDDOR kids above 2 year for web UPLOAD',
  'kids-above-2-outdoor': '6 kids above 2 years/out door/1 Akids above 2 year OUT DOOR for web UPLOAD',
  'family-shoot': '9 family shoot',  // images directly at root
};

// Birthday events: each sub-event folder becomes part of birthday-events
// We flatten all sub-folders into one gallery, prefixing filenames to avoid collisions
const BIRTHDAY_BASE = path.join(V2_BASE, '7 birth day event shoot');
const BIRTHDAY_OUT  = path.join(OUT_BASE, 'birthday-events');

// Baby shower — copied from OLD directory (not v2)
// Has 2 sub-folders: "baby shower/" and "Rashmi Baby Shower/" — we flatten both
const OLD_BABY_SHOWER_ROOT = path.join(__dirname, '../new web site photo/8 baby shower');

// ─── HELPERS ───────────────────────────────────────────────────────────────

const IMAGE_EXT = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/;

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function getAllImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => IMAGE_EXT.test(f) && !f.startsWith('.'))
    .map(f => path.join(dir, f));
}

async function compressFile(inputPath, outputPath) {
  const mb = fs.statSync(inputPath).size / 1024 / 1024;

  await sharp(inputPath)
    .rotate()                                // auto-rotate from EXIF
    .resize(MAX_PX, MAX_PX, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({
      quality: QUALITY,
      progressive: true,
      mozjpeg: true,                         // better compression algo
    })
    .toFile(outputPath);

  const outMb = fs.statSync(outputPath).size / 1024 / 1024;
  return { mb, outMb };
}

// ─── MAIN ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🗜  V2 Image Compression');
  console.log('========================');
  console.log(`  Max dimension : ${MAX_PX}px`);
  console.log(`  JPEG quality  : ${QUALITY}`);
  console.log(`  Output folder : ${OUT_BASE}`);
  console.log('');

  let totalIn = 0, totalOut = 0, totalFiles = 0, errors = 0;

  // ── 1. Standard galleries ────────────────────────────────────────────────
  for (const [galleryName, relPath] of Object.entries(GALLERY_MAP)) {
    const srcDir = path.join(V2_BASE, relPath);
    const outDir = path.join(OUT_BASE, galleryName);
    ensureDir(outDir);

    const files = getAllImageFiles(srcDir);
    if (files.length === 0) {
      console.warn(`  ⚠️  No images found: ${relPath}`);
      continue;
    }

    console.log(`\n📁 ${galleryName} (${files.length} images)`);
    let galleryIn = 0, galleryOut = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const baseName = path.basename(file).replace(/\.[^.]+$/, '') + '.jpg';
      const outPath  = path.join(outDir, baseName);

      try {
        const { mb, outMb } = await compressFile(file, outPath);
        galleryIn  += mb;
        galleryOut += outMb;
        totalFiles++;
        process.stdout.write(`\r  [${i + 1}/${files.length}] ${baseName.padEnd(20)} ${mb.toFixed(1)}MB → ${outMb.toFixed(2)}MB`);
      } catch (err) {
        errors++;
        console.error(`\n  ❌ ${path.basename(file)}: ${err.message}`);
      }
    }

    totalIn  += galleryIn;
    totalOut += galleryOut;
    console.log(`\n  ✅ ${galleryName}: ${galleryIn.toFixed(0)}MB → ${galleryOut.toFixed(0)}MB  (saved ${((1 - galleryOut/galleryIn)*100).toFixed(0)}%)`);
  }

  // ── 2. Birthday events (flatten sub-folders) ─────────────────────────────
  console.log(`\n📁 birthday-events (sub-folders)`);
  ensureDir(BIRTHDAY_OUT);

  if (fs.existsSync(BIRTHDAY_BASE)) {
    const subFolders = fs.readdirSync(BIRTHDAY_BASE)
      .filter(f => fs.statSync(path.join(BIRTHDAY_BASE, f)).isDirectory());

    let bIn = 0, bOut = 0, bCount = 0;

    for (const sub of subFolders) {
      const srcDir = path.join(BIRTHDAY_BASE, sub);
      const files  = getAllImageFiles(srcDir);
      // Prefix filename with a sanitized version of the event folder name
      // e.g. "Charvis birthday" → "charvis_birthday_SVP00008CB.jpg"
      const prefix = sub.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') + '__';

      console.log(`  └─ ${sub} (${files.length} files)`);

      for (const file of files) {
        const baseName = prefix + path.basename(file).replace(/\.[^.]+$/, '') + '.jpg';
        const outPath  = path.join(BIRTHDAY_OUT, baseName);

        try {
          const { mb, outMb } = await compressFile(file, outPath);
          bIn    += mb;
          bOut   += outMb;
          bCount++;
          totalFiles++;
          process.stdout.write(`\r    ${baseName.substring(0, 50).padEnd(50)} ${mb.toFixed(1)}MB → ${outMb.toFixed(2)}MB`);
        } catch (err) {
          errors++;
          console.error(`\n  ❌ ${path.basename(file)}: ${err.message}`);
        }
      }
    }

    totalIn  += bIn;
    totalOut += bOut;
    console.log(`\n  ✅ birthday-events: ${bIn.toFixed(0)}MB → ${bOut.toFixed(0)}MB  (${bCount} files)`);
  } else {
    console.warn('  ⚠️  Birthday events folder not found');
  }

  // ── 3. Baby shower — from OLD photo directory (2 sub-folders, flatten both) ──
  console.log(`\n📁 baby-shower (from old directory)`);
  const babyOutDir = path.join(OUT_BASE, 'baby-shower');
  ensureDir(babyOutDir);

  let bIn = 0, bOut = 0;

  if (fs.existsSync(OLD_BABY_SHOWER_ROOT)) {
    const subFolders = fs.readdirSync(OLD_BABY_SHOWER_ROOT)
      .filter(f => fs.statSync(path.join(OLD_BABY_SHOWER_ROOT, f)).isDirectory());

    // Also grab any images directly in root (just in case)
    const rootImages = getAllImageFiles(OLD_BABY_SHOWER_ROOT);
    const allSources = [
      ...rootImages.map(f => ({ file: f, prefix: '' })),
      ...subFolders.flatMap(sub => {
        const dir = path.join(OLD_BABY_SHOWER_ROOT, sub);
        return getAllImageFiles(dir).map(f => ({ file: f, prefix: '' }));
        // Filenames already unique via their suffix (NK, rbs etc), no prefix needed
      }),
    ];

    console.log(`  Found ${allSources.length} files across ${subFolders.length} sub-folders`);

    for (let i = 0; i < allSources.length; i++) {
      const { file } = allSources[i];
      const baseName = path.basename(file).replace(/\.[^.]+$/, '') + '.jpg';
      const outPath  = path.join(babyOutDir, baseName);
      try {
        const { mb, outMb } = await compressFile(file, outPath);
        bIn  += mb;
        bOut += outMb;
        totalFiles++;
        process.stdout.write(`\r  [${i+1}/${allSources.length}] ${baseName.padEnd(25)} ${mb.toFixed(1)}MB → ${outMb.toFixed(2)}MB`);
      } catch (err) {
        errors++;
        console.error(`\n  ❌ ${path.basename(file)}: ${err.message}`);
      }
    }
  } else {
    console.warn(`  ⚠️  Not found: ${OLD_BABY_SHOWER_ROOT}`);
  }

  totalIn  += bIn;
  totalOut += bOut;
  console.log(`\n  ✅ baby-shower: ${bIn.toFixed(0)}MB → ${bOut.toFixed(0)}MB`);

  // ── 4. Hero Slider ────────────────────────────────────────────────────────
  console.log(`\n📁 hero-slider`);
  const heroSrcDir = path.join(V2_BASE, 'hero slider');
  const heroOutDir = path.join(OUT_BASE, 'hero-slider');
  ensureDir(heroOutDir);

  const heroFiles = getAllImageFiles(heroSrcDir);
  let hIn = 0, hOut = 0;

  for (const file of heroFiles) {
    const baseName = path.basename(file).replace(/\.[^.]+$/, '') + '.jpg';
    const outPath  = path.join(heroOutDir, baseName);
    try {
      const { mb, outMb } = await compressFile(file, outPath);
      hIn  += mb;
      hOut += outMb;
      totalFiles++;
    } catch (err) {
      errors++;
      console.error(`\n  ❌ ${path.basename(file)}: ${err.message}`);
    }
  }
  console.log(`  ✅ hero-slider: ${heroFiles.length} files, ${hIn.toFixed(0)}MB → ${hOut.toFixed(0)}MB`);
  totalIn  += hIn;
  totalOut += hOut;

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n');
  console.log('═══════════════════════════════════════');
  console.log('  COMPRESSION COMPLETE');
  console.log('═══════════════════════════════════════');
  console.log(`  Total files  : ${totalFiles}`);
  console.log(`  Input size   : ${(totalIn / 1024).toFixed(1)} GB`);
  console.log(`  Output size  : ${totalOut.toFixed(0)} MB`);
  console.log(`  Space saved  : ${(totalIn - totalOut).toFixed(0)} MB  (${((1 - totalOut/totalIn)*100).toFixed(0)}% reduction)`);
  if (errors > 0) console.warn(`  Errors       : ${errors}`);
  console.log('');
  console.log(`  Output is at: ${OUT_BASE}`);
  console.log('  Run upload script next to push to Cloudinary.');
  console.log('');
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});
