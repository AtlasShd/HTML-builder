const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const SOURCE_FOLDER = path.resolve(__dirname, 'styles');
const DEST_FILE = path.resolve(__dirname, 'project-dist/bundle.css');

(async () => {
  try {
    const writableStream = fs.createWriteStream(DEST_FILE);
    writableStream.on('error', (error) => {
      console.error(`Error: ${error}`);
    });

    const listOfFiles = await fsPromises.readdir(SOURCE_FOLDER, {withFileTypes: true});

    for (const file of listOfFiles) {
      if (file.isDirectory() || path.parse(file.name).ext !== '.css') {
        continue;
      }

      const readStream = fs.createReadStream(path.resolve(SOURCE_FOLDER, file.name), {encoding: 'utf-8'});
      readStream.on('data', (chunk) => {
        writableStream.write(chunk);
      });
    }
  } catch(e) {
    console.error(e);
  }
})();