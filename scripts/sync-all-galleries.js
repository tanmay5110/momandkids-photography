/* eslint-disable no-console */
/**
 * Sync All Galleries with Cloudinary
 * - Fetches all images from each Cloudinary folder
 * - Sorts them in DESCENDING order by number (newest first)
 * - Updates JSON files for each gallery
 */

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
    name: 'Maternity',
    cloudinaryFolder: 'maternity',
    jsonFile: 'maternity.json',
  },
  {
    name: 'Newborn',
    cloudinaryFolder: 'newborn',
    jsonFile: 'newborn.json',
  },
  {
    name: '6-9 Months',
    cloudinaryFolder: '6-9-months',
    jsonFile: '6-9-months.json',
  },
  {
    name: 'Cake Smash',
    cloudinaryFolder: 'cake-smash',
    jsonFile: 'cake-smash.json',
  },
  {
    name: 'Pre-Birthday',
    cloudinaryFolder: 'pre-birthday',
    jsonFile: 'pre-birthday.json',
  },
  {
    name: 'Kids Above 2 (Indoor)',
    cloudinaryFolder: 'kids-above-2-indoor',
    jsonFile: 'kids-above-2-indoor.json',
  },
  {
    name: 'Kids Above 2 (Outdoor)',
    cloudinaryFolder: 'kids-above-2-outdoor',
    jsonFile: 'kids-above-2-outdoor.json',
  },
  {
    name: 'Birthday Events',
    cloudinaryFolder: 'birthday-events',
    jsonFile: 'birthday-events.json',
  },
  {
    name: 'Baby Shower',
    cloudinaryFolder: 'baby-shower',
    jsonFile: 'baby-shower.json',
  },
];

const DATA_DIR = path.join(__dirname, '../src/data');

// Extract number from public_id for sorting
function extractNumber(publicId) {
  const match = publicId.match(/\d+$/);
  return match ? parseInt(match[0], 10) : 0;
}

// Fetch all images from a Cloudinary folder
async function fetchFolderImages(folder) {
  const allImages = [];
  let nextCursor = undefined;

  do {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${folder}/`,
      max_results: 500,
      next_cursor: nextCursor,
    });

    allImages.push(...result.resources.map(r => r.public_id));
    nextCursor = result.next_cursor;
  } while (nextCursor);

  return allImages;
}

// Sync a single gallery
async function syncGallery(gallery) {
  console.log(`\n   📁 ${gallery.name}...`);

  try {
    // Fetch images from Cloudinary
    const images = await fetchFolderImages(gallery.cloudinaryFolder);

    if (images.length === 0) {
      console.log(`      ⚠️  No images found in ${gallery.cloudinaryFolder}/`);
      return { name: gallery.name, count: 0, status: 'empty' };
    }

    // Sort in DESCENDING order by number
    const sorted = images.sort((a, b) => {
      return extractNumber(b) - extractNumber(a);
    });

    // Save to JSON file
    const jsonPath = path.join(DATA_DIR, gallery.jsonFile);
    fs.writeFileSync(jsonPath, JSON.stringify(sorted, null, 2), 'utf8');

    console.log(`      ✅ ${sorted.length} images (sorted descending)`);
    console.log(`         First: ${sorted[0]}`);
    console.log(`         Last:  ${sorted[sorted.length - 1]}`);

    return { name: gallery.name, count: sorted.length, status: 'synced' };
  } catch (err) {
    console.error(`      ❌ Error: ${err.message}`);
    return { name: gallery.name, count: 0, status: 'error', error: err.message };
  }
}

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('🔄 SYNCING ALL GALLERIES WITH CLOUDINARY');
  console.log('═'.repeat(60));
  console.log('\nFetching images from Cloudinary folders...');
  console.log('Sorting in DESCENDING order (newest/highest number first)');

  const results = [];

  for (const gallery of galleries) {
    const result = await syncGallery(gallery);
    results.push(result);
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 SYNC SUMMARY');
  console.log('═'.repeat(60));

  let totalImages = 0;
  for (const r of results) {
    const icon = r.status === 'synced' ? '✅' : r.status === 'empty' ? '⚠️' : '❌';
    console.log(`   ${icon} ${r.name}: ${r.count} images`);
    totalImages += r.count;
  }

  console.log('\n   ' + '─'.repeat(40));
  console.log(`   📷 Total images synced: ${totalImages}`);
  console.log('\n✅ All galleries synced with Cloudinary!');
  console.log('   JSON files updated in src/data/\n');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
