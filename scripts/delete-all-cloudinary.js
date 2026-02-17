/* eslint-disable no-console */
/**
 * Delete ALL images from Cloudinary to start fresh
 */

const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function deleteAll() {
  console.log('\n🗑️  Deleting ALL images from Cloudinary...\n');
  
  let totalDeleted = 0;
  let nextCursor = undefined;
  
  do {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        max_results: 100,
        next_cursor: nextCursor,
      });
      
      if (result.resources.length > 0) {
        const publicIds = result.resources.map(r => r.public_id);
        console.log(`   Deleting ${publicIds.length} images...`);
        publicIds.forEach(id => console.log(`     - ${id}`));
        
        await cloudinary.api.delete_resources(publicIds);
        totalDeleted += publicIds.length;
      }
      
      nextCursor = result.next_cursor;
    } catch (err) {
      console.error('Error:', err.message);
      break;
    }
  } while (nextCursor);
  
  console.log(`\n✅ Total deleted: ${totalDeleted} images`);
  console.log('   Cloudinary is now empty!\n');
}

deleteAll().catch(console.error);
