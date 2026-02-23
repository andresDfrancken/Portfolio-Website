const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const SOURCE_FOLDER = 'dist/assets'; // Where the WebP files are
const TARGET_FOLDER = 'assets';      // Your original assets folder

async function overwriteAndRename() {
  // Find all WebP files in dist/assets
  const webpFiles = glob.sync(`${SOURCE_FOLDER}/**/*.webp`);

  for (const webpFile of webpFiles) {
    // Determine the relative path
    const relativePath = path.relative(SOURCE_FOLDER, webpFile);

    // Guess original filename: replace .webp with .png or .jpg
    let targetFilePng = path.join(TARGET_FOLDER, relativePath.replace(/\.webp$/i, '.png'));
    let targetFileJpg = path.join(TARGET_FOLDER, relativePath.replace(/\.webp$/i, '.jpg'));

    let targetFile;

    if (fs.existsSync(targetFilePng)) targetFile = targetFilePng;
    else if (fs.existsSync(targetFileJpg)) targetFile = targetFileJpg;
    else {
      console.warn(`No matching PNG/JPG found for: ${relativePath}, skipping`);
      continue;
    }

    // Copy WebP content over original file (overwrite)
    await fs.copy(webpFile, targetFile);
    console.log(`Replaced ${path.relative('.', targetFile)} with WebP content`);
  }

  console.log('✅ All PNG/JPG files replaced with WebP content!');
}

overwriteAndRename();