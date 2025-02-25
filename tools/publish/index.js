const fs = require('fs');
const path = require('path');

function updateMetaDate(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Update the "date" field with the current date
    const currentDate = new Date().toISOString();

    // Write the updated content back to the file
    fs.writeFileSync(
      filePath,
      fileContent.replace('Date: unpublished', `Date: ${currentDate}`),
      'utf8'
    );
  } catch (error) {
    console.error(`Error updating meta.json file: ${error.message}`);
  }
}

async function moveUnpublishedDirectory(sourcePath, destinationRoot) {
  if (!fs.existsSync(sourcePath)) {
    return;
  }

  const unpublished = fs.readdirSync(sourcePath);

  unpublished.forEach(async articlePath => {
    const unpublishedPath = path.join(sourcePath, articlePath);
    const filePath = path.join(unpublishedPath, 'post.md');

    const utils = await loadEsmModule(
      '../../dist/utils/esm2022/lib/permalink.mjs'
    );

    if (fs.existsSync(filePath)) {
      updateMetaDate(filePath);

      const fileContent = fs.readFileSync(filePath, 'utf8');
      const metaJsonObject = {
        title: fileContent.match(/^#\s(.+)/m)[1],
        category: fileContent.match(/^Category:\s(.+)/im)[1],
        date: fileContent.match(/^Date:\s(.+)/im)?.[1],
      };

      const destinationPath = path.join(
        destinationRoot,
        utils.getPermalink(
          metaJsonObject.title,
          false,
          metaJsonObject.category,
          metaJsonObject.date
        )
      );

      // Create the destination directory if it doesn't exist
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      // Move the content of "unpublished" to the new destination
      const contents = fs.readdirSync(unpublishedPath);
      contents.forEach(file => {
        const sourceFilePath = path.join(unpublishedPath, file);
        const destinationFilePath = path.join(destinationPath, file);

        fs.renameSync(sourceFilePath, destinationFilePath);
        console.log(`Moved: ${file}`);
      });

      // Remove the "unpublished" directory
      fs.rmdirSync(unpublishedPath);

      if (isDirectoryEmpty(sourcePath)) {
        fs.rmdirSync(sourcePath);
      }

      console.log('Unpublished directory removed.');
    } else {
      console.log('No "unpublished" directory found.');
    }
  });
}

function main() {
  const sourceDirectory = 'content/posts/unpublished';
  const destinationRoot = 'content/posts';

  moveUnpublishedDirectory(sourceDirectory, destinationRoot);

  console.log('Process completed.');
}

main();

function loadEsmModule(modulePath) {
  return new Function('modulePath', `return import(modulePath);`)(modulePath);
}

function isDirectoryEmpty(path) {
  let empty = false;
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path);
    empty = !files?.length;
  }
  return empty;
}
