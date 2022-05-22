const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const SOURCE_FOLDER = path.resolve(__dirname);
const DEST_FOLDER = path.resolve(__dirname, 'project-dist');

const paths = {
  src: {
    assets: path.resolve(SOURCE_FOLDER, 'assets/'),
    css: path.resolve(SOURCE_FOLDER, 'styles'),
    htmlCore: path.resolve(SOURCE_FOLDER, 'template.html'),
    htmlComp: path.resolve(SOURCE_FOLDER, 'components/'),
  },
  build: {
    assets: path.resolve(DEST_FOLDER, 'assets/'),
    css: path.resolve(DEST_FOLDER, 'style.css'),
    html: path.resolve(DEST_FOLDER, 'index.html'),
  },
};

const replaceAssets = async (pathFrom, pathTo) => {
  await fsPromises.mkdir(pathTo, {recursive: true});

  const listOfFiles = await fsPromises.readdir(pathFrom, {withFileTypes: true});

  for (const file of listOfFiles) {
    const exactPathFrom = path.resolve(pathFrom, file.name);
    const exactPathTo = path.resolve(pathTo, file.name);

    if (file.isDirectory()) {
      await replaceAssets(exactPathFrom, exactPathTo);
    } else {
      await fsPromises.copyFile(exactPathFrom, exactPathTo);
    }
  }
};


const putStylesTogether = async (pathFrom, pathTo) => {
  const writableStream = fs.createWriteStream(pathTo);
  writableStream.on('error', (err) => {
    console.error(err);
  });

  const listOfFiles = await fsPromises.readdir(pathFrom, {withFileTypes: true});

  for (const file of listOfFiles) {
    if (path.parse(file.name).ext !== '.css') {
      continue;
    }

    const exactPathFrom = path.resolve(pathFrom, file.name);

    if (file.isDirectory()) {
      await putStylesTogether(exactPathFrom, pathTo);
    } else {
      const readableStream = fs.createReadStream(exactPathFrom, {encoding: 'utf-8'});
      readableStream.pipe(writableStream);
    }
  }
};


const putComponentsTogether = async (pathCoreFrom, pathCompsFrom, pathTo) => {
  const writableStream = fs.createWriteStream(pathTo);

  let readCoreFile = await fsPromises.readFile(pathCoreFrom, {encoding: 'utf-8'});
  const listOfComps = await fsPromises.readdir(pathCompsFrom, {withFileTypes: true});

  for (const file of listOfComps) {
    const parseName = path.parse(file.name);

    if (file.isDirectory() || parseName.ext !== '.html') {
      continue;
    }

    const regExp = new RegExp(`\{\{${parseName.name}\}\}`, 'g');
    const readCompFile = await fsPromises.readFile(path.resolve(pathCompsFrom, file.name), {encoding: 'utf-8'});

    readCoreFile = readCoreFile.replaceAll(regExp, readCompFile);  
  }

  writableStream.write(readCoreFile);
};


(async () => {
  await fsPromises.mkdir(DEST_FOLDER, {recursive: true});

  await replaceAssets(paths.src.assets, paths.build.assets);
  await putStylesTogether(paths.src.css, paths.build.css);
  await putComponentsTogether(paths.src.htmlCore, paths.src.htmlComp, paths.build.html);
})();
