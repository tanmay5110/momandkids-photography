const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function test() {
  console.log('Testing Cloudinary connection...\n');
  
  // Try listing resources
  const res = await cloudinary.api.resources({
    type: 'upload',
    prefix: 'maternity/',
    max_results: 10,
  });
  
  console.log(`Found ${res.resources.length} images in maternity/ folder`);
  console.log('\nFirst 5 images:');
  res.resources.slice(0, 5).forEach(r => console.log(`  - ${r.public_id}`));
}

test().catch(err => console.error('Error:', err));
