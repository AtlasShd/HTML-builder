const fs = require('fs');
const path = require('path');

const SOURCE_FOLDER = path.resolve(__dirname, 'secret-folder');

const showFilesInFolder = () => {
  fs.promises.readdir(SOURCE_FOLDER, {withFileTypes: true})
  .then((files) => new Promise((resolve, reject) => {
    let data = [];
    
    for (const file of files) {
      if (file.isFile()) {
        const parseName = path.parse(file.name);
        const fileName = parseName.name;
        const fileExt = parseName.ext.substring(1);

        data.push({fileName, fileExt});
      }
    }
    
    resolve(data);
  }))
  .then((data) => new Promise((resolve, reject) => {    
    for (const {fileName, fileExt} of data) {
      fs.stat(path.resolve(SOURCE_FOLDER, `${fileName}.${fileExt}`), (err, stats) => {
        if (err) {
          reject(err);
        }

        const statsSize = stats.size;
        const statsLength = String(statsSize).length;

        let fileSize;
        if (statsLength <= 3) {
          fileSize = `${statsSize}b`;
        } else if (statsLength >= 7) {
          fileSize = `${Math.round(statsSize / 1000) / 1000}mb`;
        } else {
          fileSize = `${statsSize / 1000}kb`;
        }

        console.log(`${fileName} - ${fileExt} - ${fileSize}`);
      });
    }
  }))
  .catch((err) => {
    console.log(err);
  });
};

showFilesInFolder();
