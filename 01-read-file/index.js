const fs = require('fs');
const path = require('path');

const DEST_FILE = path.resolve(__dirname, 'text.txt');

const readFile = () => {
  const readStream = new fs.ReadStream(DEST_FILE, 'utf-8');
  readStream.on('error', (err) => {
    console.error(err);
  });

  readStream.on('data', (partOfData) => {
    console.log(partOfData);
  });
};

readFile();