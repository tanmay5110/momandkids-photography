/**
 * retry-deversh-upload.js
 *
 * Retries uploading only the Deversh birthday images that didn't make it
 * to Cloudinary due to rate limiting.
 *
 * Strategy:
 *   1. List what's ALREADY in birthday-events/deversh-birthday/ on Cloudinary
 *   2. Compare against local compressed-v2/birthday-events/ (deversh prefix)
 *   3. Upload only the MISSING ones, concurrency=1, 1.5s delay between batches
 *   4. Re-sync all birthday JSONs from Cloudinary
 *
 * Run: node scripts/retry-deversh-upload.js
 */

/* eslint-disable no-console */
const fs         = require('fs');
const path       = require('path');
const cloudinary = require('cloudinary').v2;

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const COMPRESSED    = path.join(__dirname, '../compressed-v2/birthday-events');
const DATA_DIR      = path.join(__dirname, '../src/data');
const DELAY_MS      = 1500;   // 1.5 s between each upload
const IMAGE_EXT     = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/;

const BIRTHDAY_EVENTS = [
  { prefix: 'charvis_birthday__',                          cloudSubFolder: 'charvis-birthday',   jsonFile: 'birthday-charvis.json',   displayName: 'Charvis Birthday'          },
  { prefix: 'deversh_5th_birthday__',                      cloudSubFolder: 'deversh-birthday',   jsonFile: 'birthday-deversh.json',   displayName: 'Deversh 5th Birthday'      },
  { prefix: 'kkhushi_birthday__',                          cloudSubFolder: 'khushi-birthday',    jsonFile: 'birthday-khushi.json',    displayName: 'Khushi Birthday'           },
  { prefix: 'nilesh_kade_daughter_naming_ceremony__',      cloudSubFolder: 'naming-ceremony',    jsonFile: 'birthday-naming.json',    displayName: 'Naming Ceremony'           },
  { prefix: 'ridhima_birthday__',                          cloudSubFolder: 'ridhima-birthday',   jsonFile: 'birthday-ridhima.json',   displayName: 'Ridhima Birthday'          },
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** List ALL resources in a Cloudinary prefix (handles pagination) */
async function listAllInFolder(prefix) {
  const publicIds = new Set();
  let nextCursor;

  do {
    const res = await cloudinary.api.resources({
      type:        'upload',
      prefix:      prefix + '/',
      max_results: 500,
      next_cursor: nextCursor,
    });
    for (const r of res.resources) {
      // Store just the filename part (last segment after last /)
      publicIds.add(r.public_id.split('/').pop());
    }
    nextCursor = res.next_cursor;
  } while (nextCursor);

  return publicIds;
}

/** Upload a single file, return { ok, publicId, error } */
async function uploadFile(filePath, publicId) {
  try {
    await cloudinary.uploader.upload(filePath, {
      public_id:       publicId,
      overwrite:       true,
      resource_type:   'image',
      folder:          undefined, // publicId already includes folder
      use_filename:    false,
    });
    return { ok: true, publicId };
  } catch (e) {
    const msg = e.message || e.error?.message || JSON.stringify(e);
    return { ok: false, publicId, error: msg };
  }
}

/** Upload missing images for a single birthday event, one-at-a-time with delay */
async function retryEvent(eventPrefix) {
  const event = BIRTHDAY_EVENTS.find(e => e.prefix === eventPrefix);
  const cloudFolder = `birthday-events/${event.cloudSubFolder}`;

  console.log(`\n🔍 Checking what's already in Cloudinary: ${cloudFolder}/`);
  const existing = await listAllInFolder(cloudFolder);
  console.log(`   Found ${existing.size} images already uploaded.`);

  // List local deversh files
  const allLocalFiles = fs.readdirSync(COMPRESSED)
    .filter(f => IMAGE_EXT.test(f) && f.startsWith(event.prefix));

  console.log(`   Local source: ${allLocalFiles.length} deversh files in compressed-v2/birthday-events/`);

  // Compute missing: those whose derived public_id filename is NOT on Cloudinary
  const missing = allLocalFiles.filter(filename => {
    const filenameNoPrefix = filename.slice(event.prefix.length);         // e.g. SVP00337db.jpg
    const filenameNoExt    = filenameNoPrefix.replace(/\.[^.]+$/, '');   // e.g. SVP00337db
    return !existing.has(filenameNoExt);
  });

  console.log(`   Missing: ${missing.length} images to upload`);

  if (missing.length === 0) {
    console.log('   ✅ Nothing to retry — all Deversh images are on Cloudinary!');
    return;
  }

  let uploaded = 0;
  let failed   = 0;
  const failedIds = [];

  console.log(`\n⬆️  Uploading ${missing.length} missing Deversh images (1 at a time, ${DELAY_MS}ms delay)...`);
  console.log('   This will take approximately', Math.ceil(missing.length * DELAY_MS / 60000), 'minutes.\n');

  for (let i = 0; i < missing.length; i++) {
    const filename         = missing[i];
    const filenameNoPrefix = filename.slice(event.prefix.length);
    const filenameNoExt    = filenameNoPrefix.replace(/\.[^.]+$/, '');
    const publicId         = `${cloudFolder}/${filenameNoExt}`;
    const localPath        = path.join(COMPRESSED, filename);

    const result = await uploadFile(localPath, publicId);

    if (result.ok) {
      uploaded++;
      if ((i + 1) % 10 === 0 || i === missing.length - 1) {
        process.stdout.write(`\r   [${i + 1}/${missing.length}] ✅ ${uploaded} uploaded, ❌ ${failed} failed`);
      }
    } else {
      failed++;
      failedIds.push(filename);
      process.stdout.write(`\r   [${i + 1}/${missing.length}] ✅ ${uploaded} uploaded, ❌ ${failed} failed`);
      if (result.error) {
        console.log(`\n   Error on ${filename}: ${result.error}`);
      }
    }

    // Wait between uploads to avoid rate limiting
    if (i < missing.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  process.stdout.write('\n');
  console.log(`\n   Result: ${uploaded} uploaded, ${failed} failed`);

  if (failedIds.length > 0) {
    console.log('\n   ⚠️  Still-failed files:');
    failedIds.forEach(f => console.log('      ' + f));
    console.log('\n   Run this script again to retry the remaining', failedIds.length, 'files.');
  }
}

/** Re-sync all birthday JSONs from Cloudinary */
async function syncAllBirthdayJsons() {
  console.log('\n' + '═'.repeat(60));
  console.log('  Re-syncing birthday JSON files from Cloudinary...');
  console.log('═'.repeat(60) + '\n');

  for (const event of BIRTHDAY_EVENTS) {
    const cloudFolder = `birthday-events/${event.cloudSubFolder}`;
    process.stdout.write(`  Syncing ${cloudFolder}/... `);

    const publicIds = [];
    let nextCursor;

    do {
      const res = await cloudinary.api.resources({
        type:        'upload',
        prefix:      cloudFolder + '/',
        max_results: 500,
        next_cursor: nextCursor,
      });
      publicIds.push(...res.resources.map(r => r.public_id));
      nextCursor = res.next_cursor;
    } while (nextCursor);

    const sorted  = publicIds.sort();
    const outPath = path.join(DATA_DIR, event.jsonFile);
    fs.writeFileSync(outPath, JSON.stringify(sorted, null, 2), 'utf8');
    console.log(`✅ ${event.jsonFile}: ${sorted.length} images`);
  }
}

async function main() {
  console.log('\n🔄 Birthday Events Retry Upload (Charvis + Deversh)');
  console.log('   Cloud: ' + process.env.CLOUDINARY_CLOUD_NAME);

  const start = Date.now();

  const targets = [
    'charvis_birthday__',
    'deversh_5th_birthday__',
  ];

  for (const prefix of targets) {
    await retryEvent(prefix);
  }

  await syncAllBirthdayJsons();

  const mins = ((Date.now() - start) / 60000).toFixed(1);
  console.log('\n' + '═'.repeat(60));
  console.log(`  ✅ DONE in ${mins} minutes`);
  console.log('═'.repeat(60));
  console.log('\n  Next: git add src/data/ && git commit && git push');
}

main().catch(e => {
  console.error('\n💥 Fatal:', e);
  process.exit(1);
});
