// overwrite-assets-with-webp.js
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const SOURCE_FOLDER = 'dist/assets'; // WebP files live here
const TARGET_FOLDER = 'assets';      // Original PNG/JPG files live here

async function overwriteAssets() {
  // Find all WebP files in dist/assets
  const webpFiles = glob.sync(`${SOURCE_FOLDER}/**/*.webp`);

  for (const webpFile of webpFiles) {
    // Determine relative path inside dist/assets
    const relativePath = path.relative(SOURCE_FOLDER, webpFile);

    // Determine corresponding path in root assets folder
    const targetFile = path.join(TARGET_FOLDER, relativePath);

    // Ensure target folder exists
    await fs.ensureDir(path.dirname(targetFile));

    // Copy WebP over original (overwrite)
    await fs.copy(webpFile, targetFile);

    console.log(`Copied ${relativePath} → ${path.relative('.', targetFile)}`);
  }

  console.log('✅ All WebP files from dist/assets have replaced files in assets/');
}

overwriteAssets();