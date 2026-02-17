/* eslint-disable no-console */
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function cleanup() {
  console.log('🧹 Cleaning up test folders...\n');
  
  const testFolders = ['test-folder-1', 'test-folder-2', 'test-folder-3', 'test-folder-4', 'test-folder-5'];
  
  for (const folder of testFolders) {
    try {
      await cloudinary.api.delete_resources_by_prefix(`${folder}/`);
      console.log(`   ✅ Deleted: ${folder}/`);
    } catch (err) {
      console.log(`   ⚠️ ${folder}/ - ${err.message}`);
    }
  }
  
  console.log('\n✅ Cleanup complete!');
}

cleanup().catch(console.error);
