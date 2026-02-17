/* eslint-disable no-console */
/**
 * TEST SCRIPT: Upload hero images to 5 different Cloudinary folders
 * This tests that folder creation and organization works properly
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

// Test folders to create
const testFolders = [
  'test-folder-1',
  'test-folder-2',
  'test-folder-3',
  'test-folder-4',
  'test-folder-5',
];

async function testFolderUpload() {
  console.log('\n' + '═'.repeat(60));
  console.log('🧪 TESTING CLOUDINARY FOLDER UPLOAD');
  console.log('═'.repeat(60));
  
  const heroDir = path.join(__dirname, '../public/hero-slider');
  const heroFiles = fs.readdirSync(heroDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  
  console.log(`\n📁 Found ${heroFiles.length} hero images`);
  console.log('   Will upload each to a different test folder\n');
  
  // Upload each image to a different folder
  for (let i = 0; i < Math.min(5, heroFiles.length); i++) {
    const file = heroFiles[i];
    const folderName = testFolders[i];
    const filePath = path.join(heroDir, file);
    const fileName = file.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    
    console.log(`\n${'─'.repeat(50)}`);
    console.log(`📤 Uploading: ${file}`);
    console.log(`   To folder: ${folderName}/`);
    console.log(`   Public ID: ${folderName}/${fileName}`);
    
    try {
      // Method 1: Using folder parameter (recommended for creating folders)
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folderName,  // This creates the folder and puts image inside
        public_id: fileName, // Just the filename, folder is prepended automatically
        overwrite: true,
        resource_type: 'image',
      });
      
      console.log(`   ✅ SUCCESS!`);
      console.log(`   Final public_id: ${result.public_id}`);
      console.log(`   URL: ${result.secure_url}`);
    } catch (err) {
      console.error(`   ❌ FAILED: ${err.message}`);
    }
  }
  
  // Verify the folder structure
  console.log('\n' + '═'.repeat(60));
  console.log('📋 VERIFICATION: Checking folder structure');
  console.log('═'.repeat(60));
  
  for (const folder of testFolders) {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: `${folder}/`,
        max_results: 10,
      });
      
      console.log(`\n📁 ${folder}/`);
      if (result.resources.length > 0) {
        result.resources.forEach(r => {
          console.log(`   └── ${r.public_id}`);
        });
      } else {
        console.log(`   (empty)`);
      }
    } catch (err) {
      console.log(`   ❌ Error checking: ${err.message}`);
    }
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('🏁 TEST COMPLETE');
  console.log('═'.repeat(60));
  console.log('\nIf you see images in each folder above, folder upload works!');
  console.log('You can delete these test folders from Cloudinary console.\n');
}

testFolderUpload().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
