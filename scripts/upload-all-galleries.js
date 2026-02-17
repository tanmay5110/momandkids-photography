/* eslint-disable no-console */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Gallery configurations
const galleries = [
  {
    name: '6-9 Months',
    localFolder: '1 A 6 to 9 month baby shoot',
    cloudinaryFolder: '6-9-months',
    jsonFile: '6-9-months.json',
  },
  {
    name: 'Cake Smash',
    localFolder: '1 A cake smash  for web UPLOAD',
    cloudinaryFolder: 'cake-smash',
    jsonFile: 'cake-smash.json',
  },
  {
    name: 'Newborn',
    localFolder: '1 A NEW BORN FOR for web UPLOAD',
    cloudinaryFolder: 'newborn',
    jsonFile: 'newborn.json',
  },
  {
    name: 'Pre-Birthday',
    localFolder: '1 A prebirthday one to two ywaer FOR for web UPLOAD',
    cloudinaryFolder: 'pre-birthday',
    jsonFile: 'pre-birthday.json',
  },
];

async function optimizeImage(inputPath, outputPath) {
  const stats = fs.statSync(inputPath);
  const sizeMB = stats.size / (1024 * 1024);

  if (sizeMB < 8) {
    // Just copy if small enough
    fs.copyFileSync(inputPath, outputPath);
    return false;
  } else {
    // Optimize large images
    await sharp(inputPath)
      .jpeg({ quality: 85, progressive: true })
      .resize(3000, 3000, { fit: 'inside', withoutEnlargement: true })
      .toFile(outputPath);
    return true;
  }
}

async function uploadImage(filePath, publicId) {
  try {
    await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: false,
      resource_type: 'image',
    });
    return { success: true, skipped: false };
  } catch (err) {
    if (err.http_code === 409) {
      return { success: true, skipped: true };
    }
    throw err;
  }
}

async function processGallery(gallery) {
  const baseDir = path.join(__dirname, '../public/data');
  const inputDir = path.join(baseDir, gallery.localFolder);
  const tempDir = path.join(baseDir, `${gallery.cloudinaryFolder}-optimized`);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📸 Processing: ${gallery.name}`);
  console.log(`   Source: ${gallery.localFolder}`);
  console.log(`${'='.repeat(60)}`);

  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Folder not found: ${inputDir}`);
    return;
  }

  // Create temp directory
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Get all image files (exclude subfolders like 'ai edit')
  const files = fs.readdirSync(inputDir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });

  console.log(`\n📁 Found ${files.length} images`);

  // Step 1: Optimize images
  console.log(`\n🔄 Step 1: Optimizing images...`);
  let optimized = 0;
  let copied = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(tempDir, file.replace(/\.(jpeg|png|webp)$/i, '.jpg'));

    try {
      const wasOptimized = await optimizeImage(inputPath, outputPath);
      if (wasOptimized) optimized++;
      else copied++;
      process.stdout.write(`\r   Progress: ${i + 1}/${files.length}`);
    } catch (err) {
      console.error(`\n   ❌ Error optimizing ${file}: ${err.message}`);
    }
  }
  console.log(`\n   ✅ Optimized: ${optimized}, Copied: ${copied}`);

  // Step 2: Upload to Cloudinary
  console.log(`\n☁️  Step 2: Uploading to Cloudinary...`);
  const optimizedFiles = fs.readdirSync(tempDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  let uploaded = 0;
  let skipped = 0;

  for (let i = 0; i < optimizedFiles.length; i++) {
    const file = optimizedFiles[i];
    const filePath = path.join(tempDir, file);
    const publicId = `${gallery.cloudinaryFolder}/${file.replace(/\.(jpg|jpeg|png|webp)$/i, '')}`;

    try {
      const result = await uploadImage(filePath, publicId);
      if (result.skipped) skipped++;
      else uploaded++;
      process.stdout.write(`\r   Progress: ${i + 1}/${optimizedFiles.length}`);
    } catch (err) {
      console.error(`\n   ❌ Error uploading ${file}: ${err.message}`);
    }
  }
  console.log(`\n   ✅ Uploaded: ${uploaded}, Skipped (exists): ${skipped}`);

  console.log(`\n✅ ${gallery.name} complete!`);
}

function extractLastNumber(str) {
  const matches = str.match(/\d+/g);
  if (!matches) return NaN;
  return parseInt(matches[matches.length - 1], 10);
}

function sortNumericDesc(ids) {
  return ids.sort((a, b) => {
    const nameA = a.split('/').pop();
    const nameB = b.split('/').pop();
    const numA = extractLastNumber(nameA);
    const numB = extractLastNumber(nameB);

    if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
      return numB - numA;
    }
    return nameA < nameB ? 1 : nameA > nameB ? -1 : 0;
  });
}

async function syncAllGalleries() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📥 Syncing all galleries from Cloudinary...`);
  console.log(`${'='.repeat(60)}`);

  const outDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Include maternity in sync
  const allFolders = [
    { folder: 'maternity', jsonFile: 'maternity.json' },
    ...galleries.map(g => ({ folder: g.cloudinaryFolder, jsonFile: g.jsonFile })),
  ];

  for (const { folder, jsonFile } of allFolders) {
    console.log(`\n   Syncing: ${folder}`);
    
    const publicIds = [];
    let nextCursor = undefined;

    do {
      const res = await cloudinary.api.resources({
        type: 'upload',
        prefix: `${folder}/`,
        max_results: 500,
        next_cursor: nextCursor,
      });

      publicIds.push(...res.resources.map((r) => r.public_id));
      nextCursor = res.next_cursor;
    } while (nextCursor);

    const sorted = sortNumericDesc(publicIds);
    const outPath = path.join(outDir, jsonFile);
    fs.writeFileSync(outPath, JSON.stringify(sorted, null, 2), 'utf8');
    console.log(`   ✅ ${sorted.length} images → ${jsonFile}`);
  }

  console.log(`\n✅ Sync complete!`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--sync-only')) {
    await syncAllGalleries();
    return;
  }

  // Process each gallery
  for (const gallery of galleries) {
    await processGallery(gallery);
  }

  // Sync all from Cloudinary
  await syncAllGalleries();

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🎉 ALL GALLERIES PROCESSED SUCCESSFULLY!`);
  console.log(`${'='.repeat(60)}\n`);
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
