const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const { exec } = require('child_process');

const SOURCE_FOLDER = 'assets'; // Your scattered videos live here
const OUTPUT_FOLDER = 'dist';   // Compressed videos will go here

// Match common video formats (MP4, MOV, WebM, AVI)
const videoExtensions = ['mp4', 'mov', 'webm', 'avi'];

// Create a glob pattern to find all videos recursively
const globPattern = `${SOURCE_FOLDER}/**/*.{${videoExtensions.join(',')}}`;

const videos = glob.sync(globPattern);

async function compressVideos() {
  if (videos.length === 0) {
    console.log('No videos found.');
    return;
  }

  for (const video of videos) {
    const relativePath = path.relative(SOURCE_FOLDER, video);
    const outputPath = path.join(OUTPUT_FOLDER, relativePath);

    await fs.ensureDir(path.dirname(outputPath));

    // FFmpeg command: compress using H.264 for video, AAC for audio
    const cmd = `ffmpeg -i "${video}" -c:v libx264 -preset slow -crf 28 -c:a aac -b:a 128k "${outputPath}"`;

    console.log(`Compressing: ${relativePath}`);

    await new Promise((resolve, reject) => {
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          console.error(`Error compressing ${relativePath}:`, stderr);
          return reject(err);
        }
        resolve();
      });
    });
  }

  console.log('✅ All videos compressed!');
}

compressVideos();