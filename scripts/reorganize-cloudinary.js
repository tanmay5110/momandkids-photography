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

// Gallery configurations - maps local folders to Cloudinary folders
const galleries = [
  {
    name: 'Maternity',
    localFolder: 'maternity',
    cloudinaryFolder: 'maternity',
    jsonFile: 'maternity.json',
  },
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

// Step 1: Delete ALL existing images from Cloudinary
async function deleteAllImages() {
  console.log('\n' + '='.repeat(60));
  console.log('🗑️  STEP 1: Deleting ALL existing images from Cloudinary...');
  console.log('='.repeat(60));

  try {
    // Delete from root folder (images without folder prefix)
    console.log('\n   Deleting images from root...');
    let deleted = 0;
    let nextCursor = undefined;

    do {
      const result = await cloudinary.api.resources({
        type: 'upload',
        max_results: 500,
        next_cursor: nextCursor,
      });

      if (result.resources.length > 0) {
        const publicIds = result.resources.map(r => r.public_id);
        await cloudinary.api.delete_resources(publicIds);
        deleted += publicIds.length;
        console.log(`   Deleted ${deleted} images...`);
      }

      nextCursor = result.next_cursor;
    } while (nextCursor);

    // Also try to delete by known prefixes
    const prefixes = ['maternity', 'newborn', '6-9-months', 'cake-smash', 'pre-birthday'];
    for (const prefix of prefixes) {
      try {
        await cloudinary.api.delete_resources_by_prefix(prefix + '/');
        console.log(`   Cleaned folder: ${prefix}/`);
      } catch (err) {
        // Folder might not exist, that's ok
      }
    }

    console.log(`\n   ✅ Deleted ${deleted} images from Cloudinary`);
  } catch (err) {
    console.error('   ❌ Error deleting images:', err.message);
  }
}

// Optimize a single image - must be under 10MB for Cloudinary free tier
async function optimizeImage(inputPath, outputPath) {
  const stats = fs.statSync(inputPath);
  const sizeMB = stats.size / (1024 * 1024);

  // Cloudinary free tier has 10MB limit, so we need to optimize anything over 8MB to be safe
  if (sizeMB < 8) {
    // Copy small files but still convert to jpg for consistency
    await sharp(inputPath)
      .jpeg({ quality: 90, progressive: true })
      .toFile(outputPath);
    
    const newStats = fs.statSync(outputPath);
    const newSizeMB = newStats.size / (1024 * 1024);
    return { optimized: false, originalSize: sizeMB, newSize: newSizeMB };
  } else {
    // Optimize large images - reduce quality and size to stay under 10MB
    let quality = 85;
    let maxDimension = 3000;
    
    // For very large files, be more aggressive
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
      
      const finalStats = fs.statSync(outputPath);
      return { optimized: true, originalSize: sizeMB, newSize: finalStats.size / (1024 * 1024) };
    }
    
    return { optimized: true, originalSize: sizeMB, newSize: newSizeMB };
  }
}

// Upload a single image to Cloudinary with folder
async function uploadImage(filePath, cloudinaryFolder, fileName) {
  // Use folder parameter to create folder structure
  // public_id should be just the filename (without extension)
  const publicId = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: cloudinaryFolder,  // This creates/uses the folder
      public_id: publicId,       // Just the filename, folder is prepended
      overwrite: true,
      resource_type: 'image',
    });
    return { success: true, publicId: result.public_id };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Process a single gallery
async function processGallery(gallery) {
  const baseDir = path.join(__dirname, '../public/data');
  const inputDir = path.join(baseDir, gallery.localFolder);
  const tempDir = path.join(baseDir, `${gallery.cloudinaryFolder}-temp`);

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📸 Processing: ${gallery.name}`);
  console.log(`   Local: ${gallery.localFolder}`);
  console.log(`   Cloudinary: ${gallery.cloudinaryFolder}/`);
  console.log(`${'─'.repeat(60)}`);

  if (!fs.existsSync(inputDir)) {
    console.error(`   ❌ Folder not found: ${inputDir}`);
    return { uploaded: 0, failed: 0 };
  }

  // Create temp directory for optimized images
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  // Get all image files (exclude subfolders)
  const files = fs.readdirSync(inputDir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });

  console.log(`\n   📁 Found ${files.length} images`);

  if (files.length === 0) {
    return { uploaded: 0, failed: 0 };
  }

  // Step A: Optimize images
  console.log(`\n   🔄 Optimizing images...`);
  let optimizedCount = 0;
  let copiedCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(tempDir, file.replace(/\.(jpeg|png|webp)$/i, '.jpg'));

    try {
      const result = await optimizeImage(inputPath, outputPath);
      if (result.optimized) optimizedCount++;
      else copiedCount++;
      process.stdout.write(`\r   Progress: ${i + 1}/${files.length}`);
    } catch (err) {
      console.error(`\n   ❌ Error optimizing ${file}: ${err.message}`);
    }
  }
  console.log(`\n   ✅ Optimized: ${optimizedCount}, Copied: ${copiedCount}`);

  // Step B: Upload to Cloudinary with folder structure
  console.log(`\n   ☁️  Uploading to Cloudinary folder: ${gallery.cloudinaryFolder}/`);
  const optimizedFiles = fs.readdirSync(tempDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < optimizedFiles.length; i++) {
    const file = optimizedFiles[i];
    const filePath = path.join(tempDir, file);

    const result = await uploadImage(filePath, gallery.cloudinaryFolder, file);
    if (result.success) {
      uploaded++;
    } else {
      failed++;
      console.error(`\n   ❌ Failed: ${file} - ${result.error}`);
    }
    process.stdout.write(`\r   Progress: ${i + 1}/${optimizedFiles.length} (${uploaded} uploaded, ${failed} failed)`);
  }

  console.log(`\n   ✅ Uploaded: ${uploaded}/${optimizedFiles.length} to ${gallery.cloudinaryFolder}/`);

  // Cleanup temp folder
  fs.rmSync(tempDir, { recursive: true });

  return { uploaded, failed };
}

// Sync all galleries from Cloudinary to JSON files
async function syncAllGalleries() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📥 STEP 3: Syncing all galleries from Cloudinary...`);
  console.log(`${'='.repeat(60)}`);

  const outDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const gallery of galleries) {
    console.log(`\n   Syncing: ${gallery.cloudinaryFolder}/`);
    
    const publicIds = [];
    let nextCursor = undefined;

    do {
      const res = await cloudinary.api.resources({
        type: 'upload',
        prefix: `${gallery.cloudinaryFolder}/`,
        max_results: 500,
        next_cursor: nextCursor,
      });

      publicIds.push(...res.resources.map((r) => r.public_id));
      nextCursor = res.next_cursor;
    } while (nextCursor);

    // Sort descending by number
    const sorted = publicIds.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/g)?.pop() || '0', 10);
      const numB = parseInt(b.match(/\d+/g)?.pop() || '0', 10);
      return numB - numA;
    });

    const outPath = path.join(outDir, gallery.jsonFile);
    fs.writeFileSync(outPath, JSON.stringify(sorted, null, 2), 'utf8');
    console.log(`   ✅ ${sorted.length} images → ${gallery.jsonFile}`);
  }
}

// Main function
async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('🚀 CLOUDINARY REORGANIZATION SCRIPT');
  console.log('═'.repeat(60));
  console.log('\nThis script will:');
  console.log('  1. Delete ALL existing images from Cloudinary');
  console.log('  2. Optimize images locally (reduce >8MB files)');
  console.log('  3. Upload to organized folders:');
  galleries.forEach(g => console.log(`     - ${g.cloudinaryFolder}/`));
  console.log('  4. Sync JSON files with new structure\n');

  // Step 1: Delete all existing images
  await deleteAllImages();

  // Step 2: Process each gallery
  console.log('\n' + '='.repeat(60));
  console.log('📤 STEP 2: Uploading images to organized folders...');
  console.log('='.repeat(60));

  const results = [];
  for (const gallery of galleries) {
    const result = await processGallery(gallery);
    results.push({ name: gallery.name, ...result });
  }

  // Step 3: Sync all galleries
  await syncAllGalleries();

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(60));
  console.log('\nCloudinary Folder Structure:');
  console.log('┌─────────────────────────────────────────────────────────┐');
  results.forEach(r => {
    console.log(`│  📁 ${r.name.padEnd(20)} → ${r.uploaded} images uploaded`);
  });
  console.log('└─────────────────────────────────────────────────────────┘');
  
  const totalUploaded = results.reduce((sum, r) => sum + r.uploaded, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
  
  console.log(`\n✅ Total: ${totalUploaded} images uploaded`);
  if (totalFailed > 0) {
    console.log(`❌ Failed: ${totalFailed} images`);
  }
  console.log('\n🎉 REORGANIZATION COMPLETE!\n');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
