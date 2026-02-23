// replace-with-webp.js
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const DIST_FOLDER = 'dist/assets';

async function replaceWithWebP() {
  // Find all PNG/JPG files in dist/assets
  const files = glob.sync(`${DIST_FOLDER}/**/*.{png,jpg,jpeg}`);

  for (const file of files) {
    const webpFile = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');

    // Check if corresponding WebP exists
    if (fs.existsSync(webpFile)) {
      // Overwrite original PNG/JPG with WebP
      await fs.copy(webpFile, file);
      console.log(`Replaced: ${path.relative(DIST_FOLDER, file)} with WebP`);
    } else {
      console.warn(`No WebP found for: ${path.relative(DIST_FOLDER, file)}`);
    }
  }

  console.log('✅ All PNG/JPG files replaced with WebP versions!');
}

replaceWithWebP();