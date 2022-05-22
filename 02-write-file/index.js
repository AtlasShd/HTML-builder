const fs = require('fs');
const path = require('path');
const readline = require('readline');

const STOP_WORD = 'exit';
const FILE_NAME = path.resolve(__dirname, 'text.txt');

const writeFile = () => {
  const readConsole = readline.createInterface({
    input: process.stdin, 
    output: process.stdout
  });
   
  const writableStream = fs.createWriteStream(FILE_NAME);
  writableStream.on('error', (error) => {
    console.log(error);
  });

  const writeLine = (text) => {
    console.log('Anything else?');

    const lowerCaseText = text.toLowerCase().trim();
    if (lowerCaseText === STOP_WORD) {
      readConsole.close();
    } else {
      writableStream.write(String(text));
    }
  };
  
  const printLastMessage = () => {
    console.log('Go-o-o-dby-y-e!');
  };
  
  readConsole.question(`Hello, ${process.env.USERNAME || 'User'}! Do you wanna tell me something interesting?\n`, writeLine);
  readConsole.on('line', writeLine);
  readConsole.on('close', printLastMessage);
};

writeFile();
