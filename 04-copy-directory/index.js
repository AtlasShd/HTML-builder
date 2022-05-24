const fsPromises = require('fs/promises');
const path = require('path');

const SOURCE_FOLDER = path.resolve(__dirname, 'files');
const DEST_FOLDER = path.resolve(__dirname, 'files-copy');

const copyDirectory = async () => {
  try {
    const recursiveRm = async (dirPath) => {
      const files = await fsPromises.readdir(dirPath, {withFileTypes: true});

      for (const file of files) {
          if (file.isFile()) {
            await fsPromises.unlink(path.resolve(dirPath, file.name));
          } else {
            await recursiveRm(path.resolve(dirPath, file.name));
            await fsPromises.rmdir(path.resolve(dirPath, file.name));
          }
      }
    };

    const coreDir = await fsPromises.readdir(path.dirname(DEST_FOLDER), {withFileTypes: true});

    for (const file of coreDir) {
      if (file.name !== path.basename(DEST_FOLDER)) {
        continue;
      }
      
      if (file.isDirectory()) {
        await recursiveRm(DEST_FOLDER);
      } else {
        console.error(`I can\'n create folder with name ${path.basename(DEST_FOLDER)} because file with this name already exist!`);
      }
    }
    // Всё что выше - процесс актуализации

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
