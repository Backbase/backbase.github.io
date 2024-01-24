const fs = require('fs');
const { readingTime } = require('reading-time-estimator');
const markdownIt = require('markdown-it')();

/**
 * Calculate the reading time of a Markdown file.
 * @param {string} filePath - The path to the Markdown file.
 * @returns {string} - The estimated reading time.
 */
function calculateReadingTime(filePath) {
  try {
    // Read the content of the Markdown file
    const markdownContent = fs.readFileSync(filePath, 'utf8');

    // Calculate reading time
    const timeInfo = readingTime(markdownContent, 10, 'en');

    return timeInfo;
  } catch (error) {
    console.error(`Error calculating reading time: ${error.message}`);
    return null;
  }
}

module.exports = calculateReadingTime;
