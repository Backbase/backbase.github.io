const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

// Get directories and sizes from command line arguments
const sourceDir = path.resolve(process.cwd(), process.argv[2]);
const destDir = path.resolve(process.cwd(), process.argv[3]);
const SIZES = {
  sm: process.argv.find((_, index) => process.argv[index-1] === '--sm')?.split(',')?.map(Number) || [30, 30],
  md: process.argv.find((_, index) => process.argv[index-1] === '--md')?.split(',')?.map(Number) || [80, 80],
  lg: process.argv.find((_, index) => process.argv[index-1] === '--lg')?.split(',')?.map(Number) || [120, 120],
};

fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error('Could not list the directory.', err);
    process.exit(1);
  }

  files.forEach((file) => {
    const fromPath = path.join(sourceDir, file);

    if (/(png|jpg|jpeg)$/i.test(file)) {
      Object.entries(SIZES).forEach(([size, [width, height]]) => {
        Jimp.read(fromPath)
          .then(img => {
            return img
              .cover(width, height) // crop with same aspect ratio
              .quality(60) // set JPEG quality
              .write(path.join(`${destDir}/${size}`, file)); // save
          })
          .catch(err => {
            console.error(err);
          });
      });
    }
  });
});
