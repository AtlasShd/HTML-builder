const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';

const readStream = fs.createReadStream(path.resolve(__dirname, fileName), {encoding: 'utf-8'});

readStream.on('data', (partOfData) => {
  console.log(partOfData);
});