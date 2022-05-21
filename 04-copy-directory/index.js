const fs = require('fs/promises');
const path = require('path');

const SOURCE_FOLDER = path.resolve(__dirname, 'files');
const DEST_FOLDER = path.resolve(__dirname, 'files-copy');

(async () => {
  try {
    await fs.mkdir(DEST_FOLDER, {recursive: true});

    const listOfFiles = await fs.readdir(SOURCE_FOLDER);

    for (const file of listOfFiles) {
      const sourceFilePath = path.resolve(SOURCE_FOLDER, file);
      const destFilePath = path.resolve(DEST_FOLDER, file);

      await fs.copyFile(sourceFilePath, destFilePath);
    }

  } catch(e) {
    console.error(e);
  }
})();
