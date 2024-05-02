const fs = require('fs-extra');
const path = require('path');
const Jimp = require('jimp');

// Get directories and sizes from command line arguments
const sourceDir = path.resolve(process.cwd(), process.argv[2]);
const SIZES = {
  sm: process.argv
    .find((_, index) => process.argv[index - 1] === '--sm')
    ?.split(',')
    ?.map(Number) || [30, 30],
  md: process.argv
    .find((_, index) => process.argv[index - 1] === '--md')
    ?.split(',')
    ?.map(Number) || [80, 80],
  lg: process.argv
    .find((_, index) => process.argv[index - 1] === '--lg')
    ?.split(',')
    ?.map(Number) || [120, 120],
};

const walk = async dir => {
  const files = await fs.readdir(dir);

  for (let file of files) {
    const fromPath = path.join(dir, file);
    const stat = await fs.stat(fromPath);

    if (stat.isDirectory()) {
      if (path.basename(fromPath) !== 'dist') {
        // Exclude 'dist' directories
        await walk(fromPath);
      }
    } else if (/(png|jpg|jpeg)$/i.test(file)) {
      Object.entries(SIZES).forEach(([size, [width, height]]) => {
        Jimp.read(fromPath)
          .then(img => {
            const distDir = path.join(dir, 'dist', size);

            fs.ensureDir(distDir).then(() => {
              let callback;
              if (height === 0) {
                callback = img.resize(width, Jimp.AUTO);
              } else {
                callback = img.cover(width, height); // crop with same aspect ratio
              }

              return callback
                .clone() // clone resets exif metadata
                .quality(60) // set JPEG quality
                .write(path.join(distDir, file)); // save
            });
          })
          .catch(err => {
            console.error(err);
          });
      });
    }
  }
};

walk(sourceDir).catch(console.error);
