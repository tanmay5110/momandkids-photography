/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadFolder(localFolder, cloudinaryFolder) {
  const files = fs.readdirSync(localFolder)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });

  console.log(`\nFound ${files.length} images in ${localFolder}`);
  console.log(`Uploading to Cloudinary folder: ${cloudinaryFolder}\n`);

  let uploaded = 0;
  for (const file of files) {
    const filePath = path.join(localFolder, file);
    const publicId = `${cloudinaryFolder}/${file.replace(/\.(jpg|jpeg|png|webp)$/i, '')}`;
    
    try {
      await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: false,
        resource_type: 'image',
      });
      uploaded++;
      process.stdout.write(`\rUploaded: ${uploaded}/${files.length} - ${file}`);
    } catch (err) {
      if (err.http_code === 409) {
        // Already exists, skip
        uploaded++;
        process.stdout.write(`\rSkipped (exists): ${uploaded}/${files.length} - ${file}`);
      } else {
        console.error(`\n❌ Error uploading ${file}:`, err.message);
      }
    }
  }

  console.log(`\n✅ Upload complete: ${uploaded}/${files.length} images\n`);
}

async function main() {
  const maternityFolder = path.join(__dirname, '../public/data/maternity-optimized');
  
  if (!fs.existsSync(maternityFolder)) {
    console.error(`❌ Folder not found: ${maternityFolder}`);
    process.exit(1);
  }

  await uploadFolder(maternityFolder, 'maternity');
}

main().catch(err => {
  console.error('❌ Upload failed:', err);
  process.exit(1);
});
