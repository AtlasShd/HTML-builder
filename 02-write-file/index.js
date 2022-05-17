const fs = require('fs');
const path = require('path');
const readline = require('readline');

const STOP_WORD = 'exit';
const FILE_NAME = 'text.txt';

const readConsole = readline.createInterface({
  input: process.stdin, 
  output: process.stdout
});

const writableStream = fs.createWriteStream(path.resolve(__dirname, FILE_NAME));
writableStream.on('error', (error) => {
  console.log(error);
});

const writeLine = (text) => {
  const lowerCaseText = text.toLowerCase().trim();
  if (lowerCaseText === STOP_WORD) {
    readConsole.close();
  }
  writableStream.write(String(text));
};

const printLastMessage = () => {
  console.log('Nice to meet you! Go-o-o-dby-y-e');
};

readConsole.question(`Hello, ${process.env.USERNAME}! Do you wanna tell me something interesting?\n`, writeLine);
readConsole.on('line', writeLine);
readConsole.on('close', printLastMessage);
