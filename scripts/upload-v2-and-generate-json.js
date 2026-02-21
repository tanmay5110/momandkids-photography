/**
 * upload-v2-and-generate-json.js
 *
 * Full pipeline:
 *   1. Delete old Cloudinary gallery folders
 *   2. Upload all compressed-v2/ images to Cloudinary
 *   3. Generate src/data/*.json files from what was uploaded
 *
 * Birthday events are split into Cloudinary sub-folders so each
 * event gets its own JSON → its own gallery sub-page.
 *
 * Run: node scripts/upload-v2-and-generate-json.js
 * Dry run (no upload/delete): node scripts/upload-v2-and-generate-json.js --dry-run
 */

/* eslint-disable no-console */
const fs        = require('fs');
const path      = require('path');
const cloudinary = require('cloudinary').v2;

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DRY_RUN    = process.argv.includes('--dry-run');
const COMPRESSED = path.join(__dirname, '../compressed-v2');
const DATA_DIR   = path.join(__dirname, '../src/data');
const CONCURRENCY = 4; // parallel uploads at a time

// ─── GALLERY DEFINITIONS ───────────────────────────────────────────────────
// Standard galleries: compressed-v2/<gallery>/ → Cloudinary <cloudFolder>/
const STANDARD_GALLERIES = [
  { name: 'Maternity',          compressedFolder: 'maternity',             cloudFolder: 'maternity',            jsonFile: 'maternity.json',              sortDesc: true  },
  { name: 'Newborn',            compressedFolder: 'newborn',               cloudFolder: 'newborn',              jsonFile: 'newborn.json',                sortDesc: true  },
  { name: '6–9 Months',        compressedFolder: '6-9-months',            cloudFolder: '6-9-months',           jsonFile: '6-9-months.json',             sortDesc: true  },
  { name: 'Pre-Birthday',      compressedFolder: 'pre-birthday',          cloudFolder: 'pre-birthday',         jsonFile: 'pre-birthday.json',           sortDesc: true  },
  { name: 'Cake Smash',        compressedFolder: 'cake-smash',            cloudFolder: 'cake-smash',           jsonFile: 'cake-smash.json',             sortDesc: true  },
  { name: 'Kids Indoor',       compressedFolder: 'kids-above-2-indoor',   cloudFolder: 'kids-above-2-indoor',  jsonFile: 'kids-above-2-indoor.json',    sortDesc: true  },
  { name: 'Kids Outdoor',      compressedFolder: 'kids-above-2-outdoor',  cloudFolder: 'kids-above-2-outdoor', jsonFile: 'kids-above-2-outdoor.json',   sortDesc: true  },
  { name: 'Family Shoot',      compressedFolder: 'family-shoot',          cloudFolder: 'family-shoot',         jsonFile: 'family-shoot.json',           sortDesc: true  },
  { name: 'Baby Shower',       compressedFolder: 'baby-shower',           cloudFolder: 'baby-shower',          jsonFile: 'baby-shower.json',            sortDesc: false },
  { name: 'Hero Slider',       compressedFolder: 'hero-slider',           cloudFolder: 'hero-slider',          jsonFile: null,                          sortDesc: false },
];

// Birthday events: each file has a prefix like "charvis_birthday__SVP00008CB.jpg"
// Split by prefix → separate Cloudinary sub-folders → separate JSON files
const BIRTHDAY_EVENTS = [
  { prefix: 'charvis_birthday__',                          cloudSubFolder: 'charvis-birthday',   jsonFile: 'birthday-charvis.json',   displayName: 'Charvis Birthday'          },
  { prefix: 'deversh_5th_birthday__',                     cloudSubFolder: 'deversh-birthday',   jsonFile: 'birthday-deversh.json',   displayName: 'Deversh 5th Birthday'      },
  { prefix: 'kkhushi_birthday__',                         cloudSubFolder: 'khushi-birthday',    jsonFile: 'birthday-khushi.json',    displayName: 'Khushi Birthday'           },
  { prefix: 'nilesh_kade_daughter_naming_ceremony__',     cloudSubFolder: 'naming-ceremony',    jsonFile: 'birthday-naming.json',    displayName: 'Naming Ceremony'           },
  { prefix: 'ridhima_birthday__',                         cloudSubFolder: 'ridhima-birthday',   jsonFile: 'birthday-ridhima.json',   displayName: 'Ridhima Birthday'          },
];

// Cloudinary folders to delete before uploading (thumbnails/ is kept)
const FOLDERS_TO_DELETE = [
  'maternity',
  'newborn',
  '6-9-months',
  'pre-birthday',
  'cake-smash',
  'kids-above-2-indoor',
  'kids-above-2-outdoor',
  'birthday-events',
  'family-shoot',
  'baby-shower',
  'hero-slider',
];

// ─── HELPERS ───────────────────────────────────────────────────────────────

const IMAGE_EXT = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/;

function log(msg)  { console.log(msg); }
function warn(msg) { console.warn('  ⚠️  ' + msg); }
function ok(msg)   { console.log('  ✅ ' + msg); }
function err(msg)  { console.error('  ❌ ' + msg); }

function getImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => IMAGE_EXT.test(f) && !f.startsWith('.'));
}

/** Upload in batches of CONCURRENCY */
async function uploadBatch(items, uploadFn) {
  let i = 0;
  let done = 0;
  const total = items.length;
  const results = [];

  while (i < total) {
    const batch = items.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(uploadFn));
    results.push(...batchResults);
    done += batch.length;
    i += CONCURRENCY;
    process.stdout.write(`\r    ${done}/${total} uploaded...`);
  }
  process.stdout.write('\n');
  return results;
}

/** Delete all resources under a Cloudinary prefix */
async function deleteCloudinaryFolder(prefix) {
  let deleted = 0;
  let nextCursor;

  do {
    const res = await cloudinary.api.resources({
      type: 'upload',
      prefix: prefix + '/',
      max_results: 500,
      next_cursor: nextCursor,
    });

    if (res.resources.length > 0) {
      const publicIds = res.resources.map(r => r.public_id);
      await cloudinary.api.delete_resources(publicIds);
      deleted += publicIds.length;
    }

    nextCursor = res.next_cursor;
  } while (nextCursor);

  return deleted;
}

/** Sort public IDs: numeric desc (highest first) or alphabetical */
function sortIds(ids, descNumeric) {
  if (!descNumeric) return ids.sort();

  return [...ids].sort((a, b) => {
    const nameA = a.split('/').pop() || '';
    const nameB = b.split('/').pop() || '';
    // Extract leading numeric part
    const numA = parseInt((nameA.match(/^(\d+)/) || ['0','0'])[1], 10);
    const numB = parseInt((nameB.match(/^(\d+)/) || ['0','0'])[1], 10);
    if (!isNaN(numA) && !isNaN(numB) && numA !== numB) return numB - numA;
    // fallback: alphabetical descending (handles 883a, 883b)
    return nameB.localeCompare(nameA, undefined, { numeric: true, sensitivity: 'base' });
  });
}

// ─── STEP 1: DELETE OLD CLOUDINARY DATA ────────────────────────────────────

async function deleteOldData() {
  log('\n' + '═'.repeat(60));
  log('  STEP 1 — Delete old Cloudinary galleries');
  log('═'.repeat(60));

  if (DRY_RUN) { log('  [DRY RUN] Skipping delete.'); return; }

  for (const folder of FOLDERS_TO_DELETE) {
    process.stdout.write(`  Deleting ${folder}/... `);
    try {
      const count = await deleteCloudinaryFolder(folder);
      console.log(`${count} resources deleted`);
    } catch (e) {
      console.log(`0 resources (folder may not exist)`);
    }
  }
  ok('Old data cleared.');
}

// ─── STEP 2: UPLOAD STANDARD GALLERIES ─────────────────────────────────────

async function uploadStandardGalleries() {
  log('\n' + '═'.repeat(60));
  log('  STEP 2a — Upload standard galleries');
  log('═'.repeat(60));

  for (const gallery of STANDARD_GALLERIES) {
    const srcDir = path.join(COMPRESSED, gallery.compressedFolder);
    const files  = getImageFiles(srcDir);

    if (files.length === 0) {
      warn(`No images in compressed-v2/${gallery.compressedFolder} — skipping`);
      continue;
    }

    log(`\n  📁 ${gallery.name} (${files.length} images → ${gallery.cloudFolder}/)`);
    if (DRY_RUN) { log('  [DRY RUN] Would upload ' + files.length + ' files.'); continue; }

    let uploaded = 0, failed = 0;

    const items = files.map(file => ({
      filePath: path.join(srcDir, file),
      publicId: `${gallery.cloudFolder}/${path.basename(file, path.extname(file))}`,
    }));

    const results = await uploadBatch(items, async ({ filePath, publicId }) => {
      try {
        await cloudinary.uploader.upload(filePath, {
          public_id: publicId,
          overwrite: true,
          invalidate: true,
          resource_type: 'image',
        });
        return { ok: true };
      } catch (e) {
        err(`${path.basename(filePath)}: ${e.message}`);
        return { ok: false };
      }
    });

    results.forEach(r => r.ok ? uploaded++ : failed++);
    ok(`${gallery.name}: ${uploaded} uploaded${failed ? ', ' + failed + ' failed' : ''}`);
  }
}

// ─── STEP 2b: UPLOAD BIRTHDAY EVENTS ────────────────────────────────────────

async function uploadBirthdayEvents() {
  log('\n' + '═'.repeat(60));
  log('  STEP 2b — Upload birthday events (5 sub-events)');
  log('═'.repeat(60));

  const birthdaySrcDir = path.join(COMPRESSED, 'birthday-events');
  const allFiles = getImageFiles(birthdaySrcDir);

  if (allFiles.length === 0) {
    warn('No birthday event images found in compressed-v2/birthday-events/');
    return;
  }

  for (const event of BIRTHDAY_EVENTS) {
    const eventFiles = allFiles.filter(f => f.startsWith(event.prefix));
    const cloudFolder = `birthday-events/${event.cloudSubFolder}`;

    log(`\n  🎂 ${event.displayName} (${eventFiles.length} images → ${cloudFolder}/)`);
    if (DRY_RUN) { log('  [DRY RUN] Would upload ' + eventFiles.length + ' files.'); continue; }

    let uploaded = 0, failed = 0;

    const items = eventFiles.map(file => ({
      filePath: path.join(birthdaySrcDir, file),
      // Strip the prefix to get the clean filename as the Cloudinary ID
      publicId: `${cloudFolder}/${path.basename(file, '.jpg').slice(event.prefix.length)}`,
    }));

    const results = await uploadBatch(items, async ({ filePath, publicId }) => {
      try {
        await cloudinary.uploader.upload(filePath, {
          public_id: publicId,
          overwrite: true,
          invalidate: true,
          resource_type: 'image',
        });
        return { ok: true };
      } catch (e) {
        err(`${path.basename(filePath)}: ${e.message}`);
        return { ok: false };
      }
    });

    results.forEach(r => r.ok ? uploaded++ : failed++);
    ok(`${event.displayName}: ${uploaded} uploaded${failed ? ', ' + failed + ' failed' : ''}`);
  }
}

// ─── STEP 3: GENERATE JSON FILES ────────────────────────────────────────────

async function generateJsonFiles() {
  log('\n' + '═'.repeat(60));
  log('  STEP 3 — Generate src/data/*.json from Cloudinary');
  log('═'.repeat(60));

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  // Standard galleries
  for (const gallery of STANDARD_GALLERIES) {
    if (!gallery.jsonFile) continue; // hero-slider has no data JSON

    log(`\n  Syncing ${gallery.cloudFolder}/...`);
    const publicIds = [];
    let nextCursor;

    do {
      const res = await cloudinary.api.resources({
        type: 'upload',
        prefix: gallery.cloudFolder + '/',
        max_results: 500,
        next_cursor: nextCursor,
      });
      publicIds.push(...res.resources.map(r => r.public_id));
      nextCursor = res.next_cursor;
    } while (nextCursor);

    const sorted = sortIds(publicIds, gallery.sortDesc);
    const outPath = path.join(DATA_DIR, gallery.jsonFile);

    if (!DRY_RUN) {
      fs.writeFileSync(outPath, JSON.stringify(sorted, null, 2), 'utf8');
    }
    ok(`${gallery.jsonFile}: ${sorted.length} images${DRY_RUN ? ' (dry run)' : ''}`);
  }

  // Birthday event sub-folders
  for (const event of BIRTHDAY_EVENTS) {
    const cloudFolder = `birthday-events/${event.cloudSubFolder}`;
    log(`\n  Syncing ${cloudFolder}/...`);

    const publicIds = [];
    let nextCursor;

    do {
      const res = await cloudinary.api.resources({
        type: 'upload',
        prefix: cloudFolder + '/',
        max_results: 500,
        next_cursor: nextCursor,
      });
      publicIds.push(...res.resources.map(r => r.public_id));
      nextCursor = res.next_cursor;
    } while (nextCursor);

    // Birthday events sort alphabetically (SVP filenames, no number system)
    const sorted = publicIds.sort();
    const outPath = path.join(DATA_DIR, event.jsonFile);

    if (!DRY_RUN) {
      fs.writeFileSync(outPath, JSON.stringify(sorted, null, 2), 'utf8');
    }
    ok(`${event.jsonFile}: ${sorted.length} images${DRY_RUN ? ' (dry run)' : ''}`);
  }
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

async function main() {
  log('\n🚀 V2 Cloudinary Upload Pipeline');
  if (DRY_RUN) log('   ⚠️  DRY RUN MODE — no changes will be made');
  log('   Cloud: ' + process.env.CLOUDINARY_CLOUD_NAME);
  log('   Source: ' + COMPRESSED);
  log('');

  // Verify compressed-v2 exists
  if (!fs.existsSync(COMPRESSED)) {
    err('compressed-v2/ folder not found. Run compress-v2-images.js first.');
    process.exit(1);
  }

  const start = Date.now();

  await deleteOldData();
  await uploadStandardGalleries();
  await uploadBirthdayEvents();
  await generateJsonFiles();

  const mins = ((Date.now() - start) / 60000).toFixed(1);

  log('\n' + '═'.repeat(60));
  log('  ✅ ALL DONE in ' + mins + ' minutes');
  log('═'.repeat(60));
  log('');
  log('  Next steps:');
  log('  1. git add src/data/ && git commit -m "v2 gallery data"');
  log('  2. git push → Vercel auto-deploys');
  log('');
}

main().catch(e => {
  console.error('\n💥 Fatal:', e);
  process.exit(1);
});
