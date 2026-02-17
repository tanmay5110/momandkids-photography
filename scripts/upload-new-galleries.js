/* eslint-disable no-console */
/**
 * Upload New Galleries to Cloudinary
 * - Kids Above 2 Years (Indoor)
 * - Kids Above 2 Years (Outdoor)
 * - Birthday Events
 * - Baby Shower
 * - Category Thumbnails
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;

require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const BASE_PATH = path.join(__dirname, '../new web site photo');
const DATA_DIR = path.join(__dirname, '../src/data');
const TEMP_DIR = path.join(__dirname, '../temp-optimized');

// Gallery configurations
const galleries = [
  {
    name: 'Kids Above 2 Years (Indoor)',
    sourcePath: '1 A INDDOR kids above 2 year for web UPLOAD',
    cloudinaryFolder: 'kids-above-2-indoor',
    jsonFile: 'kids-above-2-indoor.json',
  },
  {
    name: 'Kids Above 2 Years (Outdoor)',
    sourcePath: '1 Akids above 2 year OUT DOOR for web UPLOAD',
    cloudinaryFolder: 'kids-above-2-outdoor',
    jsonFile: 'kids-above-2-outdoor.json',
  },
  {
    name: 'Birthday Events',
    sourcePath: '7 birth day event shoot',
    cloudinaryFolder: 'birthday-events',
    jsonFile: 'birthday-events.json',
    hasSubfolders: true,
  },
  {
    name: 'Baby Shower',
    sourcePath: '8 baby shower',
    cloudinaryFolder: 'baby-shower',
    jsonFile: 'baby-shower.json',
    hasSubfolders: true,
  },
];

// Category thumbnails to upload
const categoryThumbnails = [
  { file: 'maternity.jpg', folder: 'thumbnails', publicId: 'maternity' },
  { file: 'maternity 1.jpg', folder: 'thumbnails', publicId: 'maternity-alt' },
  { file: 'new born.jpg', folder: 'thumbnails', publicId: 'newborn' },
  { file: '6 to 9.jpg', folder: 'thumbnails', publicId: '6-to-9-months' },
  { file: 'pre birthday.jpg', folder: 'thumbnails', publicId: 'pre-birthday' },
  { file: 'cacke smash.jpg', folder: 'thumbnails', publicId: 'cake-smash' },
  { file: 'kids above 2 year.jpg', folder: 'thumbnails', publicId: 'kids-above-2' },
  { file: 'kids aove 2 year out door.jpg', folder: 'thumbnails', publicId: 'kids-above-2-outdoor' },
  { file: 'kids obove 2 year studio.jpg', folder: 'thumbnails', publicId: 'kids-above-2-indoor' },
];

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// Extract number from filename for sorting
function extractNumber(filename) {
  const match = filename.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// Get all image files from a directory (including subfolders)
function getImageFiles(dirPath, hasSubfolders = false) {
  const images = [];
  
  if (hasSubfolders) {
    const subfolders = fs.readdirSync(dirPath).filter(f => 
      fs.statSync(path.join(dirPath, f)).isDirectory()
    );
    
    for (const subfolder of subfolders) {
      const subPath = path.join(dirPath, subfolder);
      const files = fs.readdirSync(subPath).filter(f => 
        /\.(jpg|jpeg|png|webp)$/i.test(f)
      );
      
      for (const file of files) {
        images.push({
          fullPath: path.join(subPath, file),
          filename: file,
          subfolder: subfolder,
        });
      }
    }
  } else {
    const files = fs.readdirSync(dirPath).filter(f => 
      /\.(jpg|jpeg|png|webp)$/i.test(f)
    );
    
    for (const file of files) {
      images.push({
        fullPath: path.join(dirPath, file),
        filename: file,
        subfolder: null,
      });
    }
  }
  
  return images;
}

// Optimize image
async function optimizeImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toFile(outputPath);
    return true;
  } catch (err) {
    console.error(`   ❌ Failed to optimize: ${path.basename(inputPath)}`);
    return false;
  }
}

// Upload to Cloudinary
async function uploadToCloudinary(filePath, folder, publicId) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
    });
    return result.public_id;
  } catch (err) {
    console.error(`   ❌ Upload failed: ${err.message}`);
    return null;
  }
}

// Process a gallery
async function processGallery(gallery) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📁 Processing: ${gallery.name}`);
  console.log('═'.repeat(60));

  const sourcePath = path.join(BASE_PATH, gallery.sourcePath);
  
  if (!fs.existsSync(sourcePath)) {
    console.log(`   ⚠️ Source folder not found: ${sourcePath}`);
    return { name: gallery.name, count: 0, status: 'not-found' };
  }

  const images = getImageFiles(sourcePath, gallery.hasSubfolders);
  console.log(`   Found ${images.length} images`);

  const uploadedIds = [];
  let counter = 1;

  for (const image of images) {
    const tempPath = path.join(TEMP_DIR, `temp-${counter}.jpg`);
    
    // Optimize
    const optimized = await optimizeImage(image.fullPath, tempPath);
    if (!optimized) continue;

    // Upload with sequential numbering
    const publicId = await uploadToCloudinary(
      tempPath,
      gallery.cloudinaryFolder,
      String(counter)
    );

    if (publicId) {
      uploadedIds.push(publicId);
      process.stdout.write(`\r   Uploaded: ${counter}/${images.length}`);
    }

    // Clean up temp file
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    counter++;
  }

  console.log(`\n   ✅ Uploaded ${uploadedIds.length} images`);

  // Sort in descending order (highest number first)
  uploadedIds.sort((a, b) => extractNumber(b) - extractNumber(a));

  // Save JSON
  const jsonPath = path.join(DATA_DIR, gallery.jsonFile);
  fs.writeFileSync(jsonPath, JSON.stringify(uploadedIds, null, 2), 'utf8');
  console.log(`   📄 Saved: ${gallery.jsonFile}`);

  return { name: gallery.name, count: uploadedIds.length, status: 'success' };
}

// Upload category thumbnails
async function uploadThumbnails() {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🖼️  Uploading Category Thumbnails`);
  console.log('═'.repeat(60));

  const uploaded = [];

  for (const thumb of categoryThumbnails) {
    const sourcePath = path.join(BASE_PATH, thumb.file);
    
    if (!fs.existsSync(sourcePath)) {
      console.log(`   ⚠️ Not found: ${thumb.file}`);
      continue;
    }

    const tempPath = path.join(TEMP_DIR, `thumb-${thumb.publicId}.jpg`);
    
    // Optimize thumbnail
    await sharp(sourcePath)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90, progressive: true })
      .toFile(tempPath);

    // Upload
    const publicId = await uploadToCloudinary(tempPath, thumb.folder, thumb.publicId);
    
    if (publicId) {
      uploaded.push({ file: thumb.file, publicId });
      console.log(`   ✅ ${thumb.file} → ${publicId}`);
    }

    // Clean up
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }

  // Save thumbnails JSON
  const thumbnailsData = {};
  for (const t of uploaded) {
    thumbnailsData[t.publicId.replace('thumbnails/', '')] = t.publicId;
  }
  
  const jsonPath = path.join(DATA_DIR, 'thumbnails.json');
  fs.writeFileSync(jsonPath, JSON.stringify(thumbnailsData, null, 2), 'utf8');
  console.log(`\n   📄 Saved: thumbnails.json`);

  return uploaded.length;
}

// Main
async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('🚀 UPLOADING NEW GALLERIES TO CLOUDINARY');
  console.log('═'.repeat(60));

  const results = [];

  // Process each gallery
  for (const gallery of galleries) {
    const result = await processGallery(gallery);
    results.push(result);
  }

  // Upload thumbnails
  const thumbCount = await uploadThumbnails();

  // Clean up temp directory
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 UPLOAD SUMMARY');
  console.log('═'.repeat(60));

  let totalImages = 0;
  for (const r of results) {
    const icon = r.status === 'success' ? '✅' : '⚠️';
    console.log(`   ${icon} ${r.name}: ${r.count} images`);
    totalImages += r.count;
  }
  console.log(`   🖼️  Thumbnails: ${thumbCount}`);

  console.log('\n   ' + '─'.repeat(40));
  console.log(`   📷 Total images uploaded: ${totalImages + thumbCount}`);
  console.log('\n✅ All new galleries uploaded to Cloudinary!');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
