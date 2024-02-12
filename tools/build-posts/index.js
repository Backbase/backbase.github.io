const fs = require('fs');
const path = require('path');
const { readingTime } = require('reading-time-estimator');

function scanDirectory(directoryPath, filesArray, routesArray) {
  const files = fs.readdirSync(directoryPath);

  files.forEach(async file => {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      scanDirectory(filePath, filesArray, routesArray);
    } else if (file === 'post.md') {
      // If the file is named "meta.json", read its content and add it to the array
      const fileContent = fs.readFileSync(filePath, 'utf8');

      const metaData = fileContent.split('---')[0];
      filesArray.push({
        title: metaData.match(/^# ([^\n]+)/m)?.[1],
        excerpt: metaData.match(/^#[^\n]+\n+([^\n]+)/s)?.[1],
        teaser: metaData.match(/^\!\[[^\(]+\(([^\)]+)/im)?.[1],
        authors: metaData
          .match(/^Authors: ([^\n]+)/im)?.[1]
          ?.split(',')
          .map(n => n.trim()),
        category: metaData.match(/^Category: ([^\n]+)/im)?.[1],
        tags: metaData
          .match(/^Tags: ([^\n]+)/im)?.[1]
          ?.split(',')
          .map(n => n.trim()),
        date: metaData.match(/^Date: ([^\n]+)/im)?.[1],
        readingTime: readingTime(fileContent, 238).text,
      });
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

function main() {
  const startDirectory = 'content/posts'; // Change this to the starting directory path
  const outputFilePath = 'content/posts/posts.json'; // Change this to the desired output file path

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
    '/404'
  );
  fs.writeFileSync('routes.txt', routesArray.join('\r\n'), 'utf8');

  console.log(`Scanning completed. Output written to ${outputFilePath}`);
}

main();
