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

function extractLastNumber(str) {
  const matches = str.match(/\d+/g);
  if (!matches) return NaN;
  return parseInt(matches[matches.length - 1], 10);
}

function sortNumericDesc(ids) {
  return ids.sort((a, b) => {
    const nameA = a.split('/').pop();
    const nameB = b.split('/').pop();
    const numA = extractLastNumber(nameA);
    const numB = extractLastNumber(nameB);

    if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
      return numB - numA; // descending: 200, 199, 198...
    }
    return nameA < nameB ? 1 : nameA > nameB ? -1 : 0;
  });
}

async function listFolder(folder) {
  const publicIds = [];
  let nextCursor = undefined;

  do {
    const res = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${folder}/`,
      max_results: 500,
      next_cursor: nextCursor,
    });

    publicIds.push(...res.resources.map((r) => r.public_id));
    nextCursor = res.next_cursor;
  } while (nextCursor);

  return sortNumericDesc(publicIds);
}

async function main() {
  const folders = ['maternity'];

  const outDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const folder of folders) {
    console.log(`Syncing folder: ${folder}`);
    const ids = await listFolder(folder);
    const outPath = path.join(outDir, `${folder}.json`);
    fs.writeFileSync(outPath, JSON.stringify(ids, null, 2), 'utf8');
    console.log(`✅ Wrote ${ids.length} images to ${path.basename(outPath)}`);
  }

  console.log('\n✅ Sync complete!');
}

main().catch((err) => {
  console.error('❌ Sync failed:', err);
  process.exit(1);
});
