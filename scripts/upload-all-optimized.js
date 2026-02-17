/* eslint-disable no-console */
/**
 * Upload ALL galleries to Cloudinary with proper folder organization
 * - Optimizes images and stores them permanently in public/optimized-galleries/{gallery}/
 * - Uploads to Cloudinary {gallery}/ folder
 * - No need to re-optimize if images already exist
 */

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

// Gallery configurations - using original source folders
const galleries = [
  {
    name: 'Maternity',
    sourceFolder: 'public/data/maternity',
    cloudinaryFolder: 'maternity',
    jsonFile: 'maternity.json',
  },
  {
    name: 'Newborn',
    sourceFolder: 'public/data/1 A NEW BORN FOR for web UPLOAD',
    cloudinaryFolder: 'newborn',
    jsonFile: 'newborn.json',
  },
  {
    name: '6-9 Months',
    sourceFolder: 'public/data/1 A 6 to 9 month baby shoot',
    cloudinaryFolder: '6-9-months',
    jsonFile: '6-9-months.json',
  },
  {
    name: 'Cake Smash',
    sourceFolder: 'public/data/1 A cake smash  for web UPLOAD',
    cloudinaryFolder: 'cake-smash',
    jsonFile: 'cake-smash.json',
  },
  {
    name: 'Pre-Birthday',
    sourceFolder: 'public/data/1 A prebirthday one to two ywaer FOR for web UPLOAD',
    cloudinaryFolder: 'pre-birthday',
    jsonFile: 'pre-birthday.json',
  },
];

const BASE_DIR = path.join(__dirname, '..');
const OPTIMIZED_BASE = path.join(BASE_DIR, 'public/optimized-galleries');
const DATA_DIR = path.join(BASE_DIR, 'src/data');

// Optimize a single image - must be under 10MB for Cloudinary
async function optimizeImage(inputPath, outputPath) {
  const stats = fs.statSync(inputPath);
  const sizeMB = stats.size / (1024 * 1024);

  // Always convert to jpg for consistency
  let quality = 90;
  let maxDimension = 3000;
  
  // For larger files, reduce more aggressively to stay under 10MB
  if (sizeMB > 15) {
    quality = 75;
    maxDimension = 2500;
  }
  if (sizeMB > 25) {
    quality = 70;
    maxDimension = 2000;
  }
  
  await sharp(inputPath)
    .jpeg({ quality, progressive: true })
    .resize(maxDimension, maxDimension, { fit: 'inside', withoutEnlargement: true })
    .toFile(outputPath);
  
  const newStats = fs.statSync(outputPath);
  const newSizeMB = newStats.size / (1024 * 1024);
  
  // If still too large, reduce further
  if (newSizeMB > 9) {
    await sharp(inputPath)
      .jpeg({ quality: 60, progressive: true })
      .resize(1800, 1800, { fit: 'inside', withoutEnlargement: true })
      .toFile(outputPath);
  }
  
  return { originalSize: sizeMB, newSize: fs.statSync(outputPath).size / (1024 * 1024) };
}

// Process a single gallery
async function processGallery(gallery) {
  console.log('\n' + '═'.repeat(60));
  console.log(`📸 ${gallery.name.toUpperCase()}`);
  console.log('═'.repeat(60));
  
  const sourceFolder = path.join(BASE_DIR, gallery.sourceFolder);
  const optimizedFolder = path.join(OPTIMIZED_BASE, gallery.cloudinaryFolder);
  const jsonPath = path.join(DATA_DIR, gallery.jsonFile);
  
  // Check source folder
  if (!fs.existsSync(sourceFolder)) {
    console.log(`   ⚠️  Source folder not found: ${gallery.sourceFolder}`);
    console.log(`   Skipping ${gallery.name}...`);
    return { uploaded: 0, failed: 0 };
  }
  
  // Create optimized folder
  if (!fs.existsSync(optimizedFolder)) {
    fs.mkdirSync(optimizedFolder, { recursive: true });
    console.log(`   ✅ Created: ${optimizedFolder}`);
  }
  
  // Get source files
  const files = fs.readdirSync(sourceFolder)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });
  
  console.log(`\n   📁 Source: ${files.length} images`);
  
  // STEP 1: Optimize images
  console.log('\n   🔄 Optimizing...');
  let optimizedCount = 0;
  let skippedCount = 0;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(sourceFolder, file);
    const outputFileName = file.replace(/\.(jpeg|png|webp)$/i, '.jpg');
    const outputPath = path.join(optimizedFolder, outputFileName);
    
    // Skip if already optimized
    if (fs.existsSync(outputPath)) {
      skippedCount++;
      continue;
    }
    
    try {
      await optimizeImage(inputPath, outputPath);
      optimizedCount++;
      process.stdout.write(`\r      Progress: ${i + 1}/${files.length}`);
    } catch (err) {
      console.error(`\n      ❌ Error: ${file}: ${err.message}`);
    }
  }
  
  console.log(`\r      ✅ Optimized: ${optimizedCount}, Skipped: ${skippedCount}     `);
  
  // STEP 2: Upload to Cloudinary
  console.log(`\n   ☁️  Uploading to ${gallery.cloudinaryFolder}/...`);
  
  const optimizedFiles = fs.readdirSync(optimizedFolder)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });
  
  let uploaded = 0;
  let failed = 0;
  
  for (let i = 0; i < optimizedFiles.length; i++) {
    const file = optimizedFiles[i];
    const filePath = path.join(optimizedFolder, file);
    const publicId = file.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    
    try {
      await cloudinary.uploader.upload(filePath, {
        folder: gallery.cloudinaryFolder,
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      });
      
      uploaded++;
      process.stdout.write(`\r      Progress: ${i + 1}/${optimizedFiles.length} (${uploaded} uploaded)`);
    } catch (err) {
      failed++;
      console.error(`\n      ❌ Failed: ${file} - ${err.message}`);
    }
  }
  
  console.log(`\r      ✅ Uploaded: ${uploaded}/${optimizedFiles.length}                    `);
  if (failed > 0) {
    console.log(`      ❌ Failed: ${failed}`);
  }
  
  // STEP 3: Update JSON file
  console.log(`\n   📝 Updating ${gallery.jsonFile}...`);
  
  const allPublicIds = [];
  let nextCursor = undefined;
  
  do {
    const res = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${gallery.cloudinaryFolder}/`,
      max_results: 500,
      next_cursor: nextCursor,
    });
    
    allPublicIds.push(...res.resources.map(r => r.public_id));
    nextCursor = res.next_cursor;
  } while (nextCursor);
  
  // Sort descending by number
  const sorted = allPublicIds.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/g)?.pop() || '0', 10);
    const numB = parseInt(b.match(/\d+/g)?.pop() || '0', 10);
    return numB - numA;
  });
  
  fs.writeFileSync(jsonPath, JSON.stringify(sorted, null, 2), 'utf8');
  console.log(`      ✅ Saved ${sorted.length} IDs`);
  
  return { uploaded, failed };
}

async function main() {
  console.log('\n' + '▀'.repeat(60));
  console.log('🚀 UPLOADING ALL GALLERIES TO CLOUDINARY');
  console.log('▀'.repeat(60));
  console.log(`\nOptimized images will be stored in: ${OPTIMIZED_BASE}`);
  console.log('Already optimized images will be skipped (faster re-runs!)');
  
  const summary = [];
  let totalUploaded = 0;
  let totalFailed = 0;
  
  for (const gallery of galleries) {
    const result = await processGallery(gallery);
    summary.push({ name: gallery.name, ...result });
    totalUploaded += result.uploaded;
    totalFailed += result.failed;
  }
  
  // Final summary
  console.log('\n' + '▀'.repeat(60));
  console.log('📊 SUMMARY');
  console.log('▀'.repeat(60));
  
  for (const s of summary) {
    const status = s.failed > 0 ? '⚠️' : '✅';
    console.log(`   ${status} ${s.name}: ${s.uploaded} uploaded, ${s.failed} failed`);
  }
  
  console.log('\n   ' + '─'.repeat(40));
  console.log(`   📤 Total uploaded: ${totalUploaded}`);
  if (totalFailed > 0) {
    console.log(`   ❌ Total failed: ${totalFailed}`);
  }
  
  console.log('\n✅ COMPLETE!');
  console.log('   Optimized images stored permanently for future use.');
  console.log('   JSON files updated with Cloudinary IDs.\n');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
