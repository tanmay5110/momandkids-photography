/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Sync the updated "MOM AND KIDS" source folders to Cloudinary and refresh JSON.
 *
 * This script is designed for replace-mode updates:
 * - delete the existing Cloudinary folder contents
 * - upload optimized replacements from the new local source folder
 * - regenerate the corresponding JSON from live Cloudinary public IDs
 *
 * Source tree:
 * - MOM AND KIDS/1 A Maternity FOR for web UPLOAD
 * - MOM AND KIDS/1 A NEW BORN FOR for web UPLOAD
 * - MOM AND KIDS/1 A 6 to 9 month baby shoot
 * - MOM AND KIDS/1 A prebirthday one to two ywaer FOR for web UPLOAD
 * - MOM AND KIDS/1 A cake smash  for web UPLOAD
 * - MOM AND KIDS/1 A INDDOR kids above 2 year for web UPLOAD
 * - MOM AND KIDS/9 family shoot
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

const BASE_DIR = path.join(__dirname, '../MOM AND KIDS');
const TEMP_DIR = path.join(os.tmpdir(), 'mom-and-kids-sync');
const DATA_DIR = path.join(__dirname, '../src/data');

const TARGETS = [
  {
    name: 'Maternity',
    sourceDir: '1 A Maternity FOR for web UPLOAD',
    cloudFolder: 'maternity',
    jsonFile: 'maternity.json',
  },
  {
    name: 'Newborn',
    sourceDir: '1 A NEW BORN FOR for web UPLOAD',
    cloudFolder: 'newborn',
    jsonFile: 'newborn.json',
  },
  {
    name: '6-9 Months',
    sourceDir: '1 A 6 to 9 month baby shoot',
    cloudFolder: '6-9-months',
    jsonFile: '6-9-months.json',
  },
  {
    name: 'Pre-Birthday',
    sourceDir: '1 A prebirthday one to two ywaer FOR for web UPLOAD',
    cloudFolder: 'pre-birthday',
    jsonFile: 'pre-birthday.json',
  },
  {
    name: 'Cake Smash',
    sourceDir: '1 A cake smash  for web UPLOAD',
    cloudFolder: 'cake-smash',
    jsonFile: 'cake-smash.json',
  },
  {
    name: 'Kids Above 2 Indoor',
    sourceDir: '1 A INDDOR kids above 2 year for web UPLOAD',
    cloudFolder: 'kids-above-2-indoor',
    jsonFile: 'kids-above-2-indoor.json',
  },
  {
    name: 'Family Shoot',
    sourceDir: '9 family shoot',
    cloudFolder: 'family-shoot',
    jsonFile: 'family-shoot.json',
  },
];

function isImage(file) {
  return /\.(jpg|jpeg|png|webp)$/i.test(file);
}

function extractNumber(fileName) {
  const match = fileName.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function sortIds(ids) {
  return [...ids].sort((a, b) => {
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

async function deleteExistingFolder(prefix) {
  const res = await cloudinary.api.delete_resources_by_prefix(`${prefix}/`);
  const deleted = Object.keys(res.deleted || {}).length;
  console.log(`   Deleted ${deleted} existing assets from ${prefix}/`);
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

async function syncTarget(target) {
  const sourceDir = path.join(BASE_DIR, target.sourceDir);
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source folder not found: ${sourceDir}`);
  }

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const localFiles = fs.readdirSync(sourceDir)
    .filter(isImage)
    .sort((a, b) => {
      const numA = extractNumber(a);
      const numB = extractNumber(b);
      if (numA !== numB) return numA - numB;
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📁 ${target.name}`);
  console.log('═'.repeat(60));
  console.log(`Source: ${target.sourceDir}`);
  console.log(`Cloudinary: ${target.cloudFolder}/`);
  console.log(`Images: ${localFiles.length}`);

  await deleteExistingFolder(target.cloudFolder);

  const uploadedIds = [];
  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < localFiles.length; i++) {
    const file = localFiles[i];
    const inputPath = path.join(sourceDir, file);
    const outputPath = path.join(TEMP_DIR, `${target.cloudFolder}-${i + 1}.jpg`);
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
      uploaded += 1;
      process.stdout.write(`\r   ${uploaded}/${localFiles.length} uploaded`);
    } catch (err) {
      failed += 1;
      console.error(`\n   ❌ ${file}: ${err.message}`);
    } finally {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }
  }

  console.log(`\n   Upload complete: ${uploaded} uploaded, ${failed} failed`);

  const liveIds = sortIds(await fetchIds(target.cloudFolder));
  const jsonPath = path.join(DATA_DIR, target.jsonFile);
  fs.writeFileSync(jsonPath, JSON.stringify(liveIds, null, 2) + '\n', 'utf8');

  console.log(`   JSON written: ${target.jsonFile}`);
  console.log(`   Live count: ${liveIds.length}`);

  return {
    name: target.name,
    uploaded,
    failed,
    count: liveIds.length,
  };
}

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('SYNC MOM AND KIDS');
  console.log('═'.repeat(60));
  console.log(`Cloudinary cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);

  const summary = [];

  for (const target of TARGETS) {
    summary.push(await syncTarget(target));
  }

  console.log('\n' + '═'.repeat(60));
  console.log('SUMMARY');
  console.log('═'.repeat(60));

  for (const item of summary) {
    console.log(`✅ ${item.name}: ${item.count} live images (${item.uploaded} uploaded, ${item.failed} failed)`);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
