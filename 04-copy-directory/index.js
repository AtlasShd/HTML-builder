const fsPromises = require('fs/promises');
const path = require('path');

const SOURCE_FOLDER = path.resolve(__dirname, 'files');
const DEST_FOLDER = path.resolve(__dirname, 'files-copy');

const copyDirectory = async () => {
  try {
    await fsPromises.mkdir(DEST_FOLDER, {recursive: true});

    const listOfFiles = await fsPromises.readdir(SOURCE_FOLDER);

    for (const file of listOfFiles) {
      const sourceFilePath = path.resolve(SOURCE_FOLDER, file);
      const destFilePath = path.resolve(DEST_FOLDER, file);

      await fsPromises.copyFile(sourceFilePath, destFilePath);
    }

  } catch(e) {
    console.error(e);
  }
};

copyDirectory();
