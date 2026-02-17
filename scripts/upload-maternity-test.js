/* eslint-disable no-console */
/**
 * TEST SCRIPT: Upload maternity images to Cloudinary folder
 * - Optimizes images and stores them permanently in public/optimized-galleries/maternity/
 * - Uploads to Cloudinary maternity/ folder
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

const SOURCE_FOLDER = path.join(__dirname, '../public/data/maternity');
const OPTIMIZED_FOLDER = path.join(__dirname, '../public/optimized-galleries/maternity');
const CLOUDINARY_FOLDER = 'maternity'; // This will create maternity/ folder in Cloudinary

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

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('🧪 MATERNITY UPLOAD TEST');
  console.log('═'.repeat(60));
  console.log(`\nSource: ${SOURCE_FOLDER}`);
  console.log(`Optimized storage: ${OPTIMIZED_FOLDER}`);
  console.log(`Cloudinary folder: ${CLOUDINARY_FOLDER}/`);
  
  // Check source folder
  if (!fs.existsSync(SOURCE_FOLDER)) {
    console.error(`\n❌ Source folder not found: ${SOURCE_FOLDER}`);
    process.exit(1);
  }
  
  // Create optimized folder
  if (!fs.existsSync(OPTIMIZED_FOLDER)) {
    fs.mkdirSync(OPTIMIZED_FOLDER, { recursive: true });
    console.log(`\n✅ Created optimized folder: ${OPTIMIZED_FOLDER}`);
  }
  
  // Get all image files
  const files = fs.readdirSync(SOURCE_FOLDER)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });
  
  console.log(`\n📁 Found ${files.length} images in source folder`);
  
  // STEP 1: Optimize images (if not already optimized)
  console.log('\n' + '─'.repeat(60));
  console.log('🔄 STEP 1: Optimizing images...');
  console.log('─'.repeat(60));
  
  let optimizedCount = 0;
  let skippedCount = 0;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(SOURCE_FOLDER, file);
    const outputFileName = file.replace(/\.(jpeg|png|webp)$/i, '.jpg');
    const outputPath = path.join(OPTIMIZED_FOLDER, outputFileName);
    
    // Skip if already optimized
    if (fs.existsSync(outputPath)) {
      skippedCount++;
      process.stdout.write(`\r   Progress: ${i + 1}/${files.length} (${skippedCount} skipped)`);
      continue;
    }
    
    try {
      await optimizeImage(inputPath, outputPath);
      optimizedCount++;
      process.stdout.write(`\r   Progress: ${i + 1}/${files.length} (${optimizedCount} optimized, ${skippedCount} skipped)`);
    } catch (err) {
      console.error(`\n   ❌ Error optimizing ${file}: ${err.message}`);
    }
  }
  
  console.log(`\n   ✅ Optimized: ${optimizedCount}, Skipped (already done): ${skippedCount}`);
  
  // STEP 2: Upload to Cloudinary
  console.log('\n' + '─'.repeat(60));
  console.log('☁️  STEP 2: Uploading to Cloudinary folder: ' + CLOUDINARY_FOLDER + '/');
  console.log('─'.repeat(60));
  
  const optimizedFiles = fs.readdirSync(OPTIMIZED_FOLDER)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });
  
  console.log(`\n   📁 Found ${optimizedFiles.length} optimized images to upload`);
  
  let uploaded = 0;
  let failed = 0;
  const uploadedIds = [];
  
  for (let i = 0; i < optimizedFiles.length; i++) {
    const file = optimizedFiles[i];
    const filePath = path.join(OPTIMIZED_FOLDER, file);
    const publicId = file.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    
    try {
      // THE KEY: Use folder parameter to create folder structure
      const result = await cloudinary.uploader.upload(filePath, {
        folder: CLOUDINARY_FOLDER,  // Creates/uses the maternity/ folder
        public_id: publicId,        // Just the filename
        overwrite: true,
        resource_type: 'image',
      });
      
      uploaded++;
      uploadedIds.push(result.public_id);
      process.stdout.write(`\r   Progress: ${i + 1}/${optimizedFiles.length} (${uploaded} uploaded)`);
      
      // Log first few uploads for verification
      if (uploaded <= 3) {
        console.log(`\n   ✅ ${result.public_id}`);
      }
    } catch (err) {
      failed++;
      console.error(`\n   ❌ Failed: ${file} - ${err.message}`);
    }
  }
  
  console.log(`\n\n   ✅ Uploaded: ${uploaded}/${optimizedFiles.length}`);
  if (failed > 0) {
    console.log(`   ❌ Failed: ${failed}`);
  }
  
  // STEP 3: Verify folder structure
  console.log('\n' + '─'.repeat(60));
  console.log('📋 STEP 3: Verifying Cloudinary folder structure...');
  console.log('─'.repeat(60));
  
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${CLOUDINARY_FOLDER}/`,
      max_results: 10,
    });
    
    console.log(`\n   📁 ${CLOUDINARY_FOLDER}/ folder contains ${result.resources.length}+ images`);
    console.log('   Sample images:');
    result.resources.slice(0, 5).forEach(r => {
      console.log(`   └── ${r.public_id}`);
    });
  } catch (err) {
    console.error(`\n   ❌ Error verifying: ${err.message}`);
  }
  
  // STEP 4: Update JSON file
  console.log('\n' + '─'.repeat(60));
  console.log('📝 STEP 4: Updating maternity.json...');
  console.log('─'.repeat(60));
  
  const jsonPath = path.join(__dirname, '../src/data/maternity.json');
  
  // Get all images from Cloudinary
  const allPublicIds = [];
  let nextCursor = undefined;
  
  do {
    const res = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${CLOUDINARY_FOLDER}/`,
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
  console.log(`\n   ✅ Saved ${sorted.length} image IDs to maternity.json`);
  console.log(`   Sample IDs: ${sorted.slice(0, 3).join(', ')}`);
  
  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('🎉 COMPLETE!');
  console.log('═'.repeat(60));
  console.log(`\n✅ ${uploaded} images uploaded to ${CLOUDINARY_FOLDER}/ folder`);
  console.log(`✅ Optimized images stored in: ${OPTIMIZED_FOLDER}`);
  console.log(`✅ JSON updated: ${jsonPath}`);
  console.log('\n👉 Check your Cloudinary dashboard to verify the folder structure!');
  console.log('   https://console.cloudinary.com/console/media_library\n');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
