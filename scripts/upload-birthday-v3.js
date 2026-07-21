/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Upload the missing birthday v3 folders:
 * - 7 birth day event shoot/nikku daughter 1st birthday
 * - 7a inbox spl shoot (special shoot)
 *
 * Behavior:
 * - If the Cloudinary folder already exists, it will not re-upload.
 * - If the folder is missing, images are optimized and uploaded.
 * - JSON files are generated from the live Cloudinary folder IDs.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const BASE_DIR = path.join(__dirname, '../new web sit v3 photo');
const TEMP_DIR = path.join(os.tmpdir(), 'birthday-v3-upload');
const DATA_DIR = path.join(__dirname, '../src/data');

const TARGETS = [
  {
    name: 'Nikku Birthday',
    sourceDir: path.join(BASE_DIR, '7 birth day event shoot/nikku daughter 1st birthday'),
    cloudFolder: 'birthday-events/nikku-daughter-1st-birthday',
    jsonFile: 'birthday-nikku.json',
    sortMode: 'numeric',
  },
  {
    name: 'Special Shoot',
    sourceDir: path.join(BASE_DIR, '7a inbox spl shoot'),
    cloudFolder: 'special-shoot',
    jsonFile: 'special-shoot.json',
    sortMode: 'alpha',
  },
];

function isImage(file) {
  return /\.(jpg|jpeg|png|webp)$/i.test(file);
}

function extractNumber(value) {
  const matches = value.match(/\d+/g);
  if (!matches || matches.length === 0) return 0;
  return parseInt(matches[matches.length - 1], 10);
}

function sortIds(ids, mode) {
  const copy = [...ids];
  if (mode === 'alpha') return copy.sort();

  return copy.sort((a, b) => {
    const nameA = a.split('/').pop() || '';
    const nameB = b.split('/').pop() || '';
    const numA = extractNumber(nameA);
    const numB = extractNumber(nameB);
    if (numA !== numB) return numB - numA;
    return nameB.localeCompare(nameA, undefined, { numeric: true, sensitivity: 'base' });
  });
}

async function optimizeImage(inputPath, outputPath) {
  const sizeMB = fs.statSync(inputPath).size / (1024 * 1024);
  let quality = 86;
  let maxEdge = 2400;

  if (sizeMB > 8) {
    quality = 82;
    maxEdge = 2200;
  }
  if (sizeMB > 14) {
    quality = 78;
    maxEdge = 2000;
  }

  await sharp(inputPath)
    .rotate()
    .resize(maxEdge, maxEdge, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality, progressive: true })
    .toFile(outputPath);
}

async function fetchIds(prefix) {
  const ids = [];
  let nextCursor;

  do {
    const res = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${prefix}/`,
      max_results: 500,
      next_cursor: nextCursor,
    });

    ids.push(...res.resources.map((r) => r.public_id));
    nextCursor = res.next_cursor;
  } while (nextCursor);

  return ids;
}

async function uploadFolder(target) {
  if (!fs.existsSync(target.sourceDir)) {
    throw new Error(`Source folder not found: ${target.sourceDir}`);
  }

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const localFiles = fs.readdirSync(target.sourceDir)
    .filter(isImage)
    .sort((a, b) => extractNumber(a) - extractNumber(b));

  const existingIds = await fetchIds(target.cloudFolder);
  if (existingIds.length > 0) {
    console.log(`\n${target.name}: folder already exists in Cloudinary (${existingIds.length} images)`);
    const sorted = sortIds(existingIds, target.sortMode);
    const outPath = path.join(DATA_DIR, target.jsonFile);
    fs.writeFileSync(outPath, JSON.stringify(sorted, null, 2), 'utf8');
    console.log(`   JSON refreshed: ${target.jsonFile}`);
    return;
  }

  console.log(`\n${target.name}: uploading ${localFiles.length} images to ${target.cloudFolder}/`);

  const uploadedIds = [];
  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < localFiles.length; i++) {
    const file = localFiles[i];
    const inputPath = path.join(target.sourceDir, file);
    const outputPath = path.join(TEMP_DIR, `${path.parse(file).name}.jpg`);
    const publicId = String(i + 1);

    try {
      await optimizeImage(inputPath, outputPath);
      const result = await cloudinary.uploader.upload(outputPath, {
        folder: target.cloudFolder,
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
      });
      uploadedIds.push(result.public_id);
      uploaded++;
      process.stdout.write(`\r   ${uploaded}/${localFiles.length} uploaded`);
    } catch (err) {
      failed++;
      console.error(`\n   ❌ ${file}: ${err.message}`);
    } finally {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }
  }

  console.log(`\n   Upload complete: ${uploaded} uploaded, ${failed} failed`);

  const liveIds = await fetchIds(target.cloudFolder);
  const sorted = sortIds(liveIds, target.sortMode);
  const outPath = path.join(DATA_DIR, target.jsonFile);
  fs.writeFileSync(outPath, JSON.stringify(sorted, null, 2), 'utf8');

  console.log(`   JSON written: ${target.jsonFile}`);
  console.log(`   Live count: ${sorted.length}`);
}

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('🎂 BIRTHDAY V3 UPLOAD');
  console.log('═'.repeat(60));
  console.log(`Cloudinary cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);

  for (const target of TARGETS) {
    await uploadFolder(target);
  }

  console.log('\n✅ Birthday v3 upload finished');
}

main().catch((err) => {
  console.error('❌ Birthday upload failed:', err);
  process.exit(1);
});
