const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/data/maternity');
const outputDir = path.join(__dirname, '../public/data/maternity-optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  const files = fs.readdirSync(inputDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  console.log(`\nOptimizing ${files.length} images...\n`);

  let processed = 0;
  const skipped = [];
  const optimized = [];

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.jpg'));
    
    try {
      const stats = fs.statSync(inputPath);
      const sizeMB = stats.size / (1024 * 1024);

      // If under 8MB, just copy (leave margin for Cloudinary)
      if (sizeMB < 8) {
        fs.copyFileSync(inputPath, outputPath);
        skipped.push(file);
      } else {
        // Optimize large images
        await sharp(inputPath)
          .jpeg({ quality: 85, progressive: true })
          .resize(3000, 3000, { fit: 'inside', withoutEnlargement: true })
          .toFile(outputPath);
        optimized.push(file);
      }

      processed++;
      process.stdout.write(`\rProcessed: ${processed}/${files.length}`);
    } catch (err) {
      console.error(`\n❌ Error: ${file} - ${err.message}`);
    }
  }

  console.log(`\n\n✅ Done!`);
  console.log(`   Copied: ${skipped.length} files (already small enough)`);
  console.log(`   Optimized: ${optimized.length} files (reduced size)`);
  console.log(`\nOutput: ${outputDir}`);
}

optimizeImages();
