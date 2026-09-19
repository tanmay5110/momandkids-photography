/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Sync the updated "MOM AND KIDS" source folders to Cloudinary and refresh JSON.
 *
 * This script is designed for replace-mode updates:
 * - validate every local image before changing Cloudinary
 * - upload optimized replacements with retries
 * - verify the exact live Cloudinary public IDs
 * - regenerate JSON only after every gallery succeeds
 *
 * Source tree:
 * - MOM AND KIDS/1 A Maternity FOR for web UPLOAD
 * - MOM AND KIDS/1 A NEW BORN FOR for web UPLOAD
 * - MOM AND KIDS/1 A 6 to 9 month baby shoot
 * - MOM AND KIDS/1 A prebirthday one to two ywaer FOR for web UPLOAD
 * - MOM AND KIDS/1 A cake smash  for web UPLOAD
 * - MOM AND KIDS/1 A INDDOR kids above 2 year for web UPLOAD
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
const MAX_UPLOAD_ATTEMPTS = 3;

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

function getLocalFiles(target) {
  const sourceDir = path.join(BASE_DIR, target.sourceDir);
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source folder not found: ${sourceDir}`);
  }

  const files = fs.readdirSync(sourceDir)
    .filter(isImage)
    .sort((a, b) => {
      const numA = extractNumber(a);
      const numB = extractNumber(b);
      if (numA !== numB) return numA - numB;
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });

  if (files.length === 0) {
    throw new Error(`No images found in: ${sourceDir}`);
  }

  return { sourceDir, files };
}

async function validateSources() {
  console.log('\nValidating local source images...');

  for (const target of TARGETS) {
    const { sourceDir, files } = getLocalFiles(target);

    for (const file of files) {
      try {
        const metadata = await sharp(path.join(sourceDir, file)).metadata();
        if (!metadata.width || !metadata.height) {
          throw new Error('missing dimensions');
        }
      } catch (err) {
        throw new Error(`Invalid image ${path.join(sourceDir, file)}: ${err.message}`);
      }
    }

    console.log(`   OK ${target.name}: ${files.length} images`);
  }
}

async function uploadWithRetry(filePath, options) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt++) {
    try {
      return await cloudinary.uploader.upload(filePath, options);
    } catch (err) {
      lastError = err;
      if (attempt < MAX_UPLOAD_ATTEMPTS) {
        console.log(`\n   Upload failed; retrying (${attempt + 1}/${MAX_UPLOAD_ATTEMPTS})...`);
      }
    }
  }

  throw lastError;
}

async function deleteResources(ids) {
  for (let i = 0; i < ids.length; i += 100) {
    await cloudinary.api.delete_resources(ids.slice(i, i + 100), {
      resource_type: 'image',
      invalidate: true,
    });
  }
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
  const { sourceDir, files: localFiles } = getLocalFiles(target);

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📁 ${target.name}`);
  console.log('═'.repeat(60));
  console.log(`Source: ${target.sourceDir}`);
  console.log(`Cloudinary: ${target.cloudFolder}/`);
  console.log(`Images: ${localFiles.length}`);

  let uploaded = 0;

  for (let i = 0; i < localFiles.length; i++) {
    const file = localFiles[i];
    const inputPath = path.join(sourceDir, file);
    const outputPath = path.join(TEMP_DIR, `${target.cloudFolder}-${i + 1}.jpg`);
    const publicId = String(i + 1);

    try {
      await optimizeImage(inputPath, outputPath);
      await uploadWithRetry(outputPath, {
        folder: target.cloudFolder,
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
      });

      uploaded += 1;
      process.stdout.write(`\r   ${uploaded}/${localFiles.length} uploaded`);
    } catch (err) {
      throw new Error(`Upload failed for ${file}: ${err.message}`);
    } finally {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }
  }

  console.log(`\n   Upload complete: ${uploaded} uploaded`);

  const liveIds = await fetchIds(target.cloudFolder);
  const expectedIds = localFiles.map((_, i) => `${target.cloudFolder}/${i + 1}`);
  const liveSet = new Set(liveIds);
  const expectedSet = new Set(expectedIds);
  const missingIds = expectedIds.filter((id) => !liveSet.has(id));

  if (missingIds.length > 0) {
    throw new Error(`Cloudinary verification failed for ${target.name}: ${missingIds.length} IDs missing`);
  }

  const staleIds = liveIds.filter((id) => !expectedSet.has(id));
  console.log(`   Verified: ${expectedIds.length} expected IDs are live`);

  return {
    name: target.name,
    uploaded,
    count: expectedIds.length,
    jsonFile: target.jsonFile,
    ids: sortIds(expectedIds),
    staleIds,
  };
}

async function main() {
  const missingEnv = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
    .filter((name) => !process.env[name]);

  if (missingEnv.length > 0) {
    throw new Error(`Missing Cloudinary configuration: ${missingEnv.join(', ')}`);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('SYNC MOM AND KIDS');
  console.log('═'.repeat(60));
  console.log(`Cloudinary cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);

  await validateSources();

  const summary = [];

  for (const target of TARGETS) {
    summary.push(await syncTarget(target));
  }

  for (const item of summary) {
    const jsonPath = path.join(DATA_DIR, item.jsonFile);
    fs.writeFileSync(jsonPath, JSON.stringify(item.ids, null, 2) + '\n', 'utf8');
    console.log(`JSON written: ${item.jsonFile}`);
  }

  for (const item of summary) {
    if (item.staleIds.length > 0) {
      await deleteResources(item.staleIds);
      console.log(`Removed ${item.staleIds.length} stale assets from ${item.name}`);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('SUMMARY');
  console.log('═'.repeat(60));

  for (const item of summary) {
    console.log(`OK ${item.name}: ${item.count} live images (${item.uploaded} uploaded)`);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
