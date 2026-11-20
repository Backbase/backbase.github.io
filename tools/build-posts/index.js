const fs = require('fs');
const path = require('path');

function scanDirectory(directoryPath, filesArray, routesArray) {
  const files = fs.readdirSync(directoryPath);

  files.forEach(async file => {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      await scanDirectory(filePath, filesArray, routesArray);
    } else if (file === 'post.md') {
      // If the file is named "meta.json", read its content and add it to the array
      const fileContent = fs.readFileSync(filePath, 'utf8');

      const metaData = utils.extractPostMetaData(fileContent, true);
      filesArray.push(metaData);
      routesArray.push(directoryPath.replace('content/posts', ''));
    }
  });

  // Sort the array based on the "date" field
  filesArray.sort((a, b) =>
    a.date && a.date !== 'unpublished'
      ? new Date(b.date) - new Date(a.date)
      : -1
  );
}

async function getAuthorRoutes(source) {
  if (fs.existsSync(source)) {
    const authors = JSON.parse(fs.readFileSync(source, 'utf8'));

    const utils = await loadEsmModule('../../dist/utils/fesm2022/utils.mjs');
    return Object.keys(authors).map(
      name => `/people/${utils.getAuthorPermalink(name)}`
    );
  }
  return [];
}

async function main() {
  const startDirectory = 'content/posts'; // Change this to the starting directory path
  const outputFilePath = 'content/posts/posts.json'; // Change this to the desired output file path
  const authorsFilePath = 'content/authors/authors.json';

  if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath);
  }

  const filesArray = [];
  const routesArray = [];
  scanDirectory(startDirectory, filesArray, routesArray);

  // Write the sorted array to the output file
  const outputContent = JSON.stringify(filesArray);
  fs.writeFileSync(outputFilePath, outputContent, 'utf8');

  routesArray.push(
    '/category/tech-life',
    '/category/devops',
    '/category/backend',
    '/category/career',
    '/category/frontend',
    '/category/sdlc',
    '/404',
    '/principles',
    ...(await getAuthorRoutes(authorsFilePath))
  );
  fs.writeFileSync('dist/routes.txt', routesArray.join('\r\n'), 'utf8');

  console.log(`Scanning completed. Output written to ${outputFilePath}`);
}

async function withUtils() {
  utils = await loadEsmModule('../../dist/utils/fesm2022/utils.mjs');

  main();
}

withUtils();

function loadEsmModule(modulePath) {
  return new Function('modulePath', `return import(modulePath);`)(modulePath);
}
