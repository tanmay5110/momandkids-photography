const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function deleteFolder() {
  console.log('Deleting all images from maternity/ folder in Cloudinary...\n');
  
  try {
    const result = await cloudinary.api.delete_resources_by_prefix('maternity/');
    console.log(`✅ Deleted ${Object.keys(result.deleted).length} images`);
    
    // Also delete the folder
    await cloudinary.api.delete_folder('maternity');
    console.log('✅ Deleted maternity folder\n');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

deleteFolder();
