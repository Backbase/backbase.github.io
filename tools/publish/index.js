const fs = require('fs');
const path = require('path');

function updateMetaDate(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const jsonObject = JSON.parse(fileContent);

        if (jsonObject.date) { return; }

        // Update the "date" field with the current date
        const currentDate = new Date();
        jsonObject.date = currentDate.toISOString();

        // Write the updated content back to the file
        fs.writeFileSync(filePath, JSON.stringify(jsonObject, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error updating meta.json file: ${error.message}`);
    }
}

async function moveUnpublishedDirectory(sourcePath, destinationRoot) {
    const unpublished = fs.readdirSync(sourcePath);

    unpublished.forEach(async (articlePath) => {
        const unpublishedPath = path.join(sourcePath, articlePath);
        const metaFilePath = path.join(unpublishedPath, 'meta.json');

        const utils = await loadEsmModule('../../dist/utils/esm2022/lib/permalink.mjs');

        if (fs.existsSync(metaFilePath)) {
            updateMetaDate(metaFilePath);
    
            const metaFileContent = fs.readFileSync(metaFilePath, 'utf8');
            const metaJsonObject = JSON.parse(metaFileContent);
    
            const destinationPath = path.join(destinationRoot, utils.getPermalink(
                metaJsonObject.title,
                new Date(metaJsonObject.date),
                metaJsonObject.category,
                metaJsonObject.article,
            ));
    
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
