const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

// Get directories and sizes from command line arguments
const sourceDir = path.resolve(process.cwd(), process.argv[2]);
const destDir = path.resolve(process.cwd(), process.argv[3]);
const width = parseInt(process.argv[4]);
const height = parseInt(process.argv[5]);

fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error('Could not list the directory.', err);
    process.exit(1);
  }

  files.forEach((file, index) => {
    const fromPath = path.join(sourceDir, file);

    if (/(png|jpg|jpeg)$/i.test(file)) {
      Jimp.read(fromPath)
        .then(img => {
          const aspectRatio = img.bitmap.width / img.bitmap.height;
          let newWidth = width;
          let newHeight = height;

          if (aspectRatio > width / height) {
            newHeight = Math.round(width / aspectRatio);
          } else {
            newWidth = Math.round(height * aspectRatio);
          }

          return img
            .cover(newWidth, newHeight) // crop with same aspect ratio
            .quality(60) // set JPEG quality
            .write(path.join(destDir, file)); // save
        })
        .catch(err => {
          console.error(err);
        });
    }
  });
});
