const fs = require('node:fs');
const path = require('node:path');
const pathFull = path.join(__dirname, 'text.txt');
const file = fs.createWriteStream(pathFull, 'utf-8');
const process = require('node:process');
console.log('Write the text, please!');
process.stdin.on('data', (data) => {
  if (data.toString().trim().toLowerCase() === 'exit') {
    console.log('Good bye!');
    process.exit();
  }
  file.write(data);
  console.log('Write the text, please!');
});
process.on('SIGINT', () => {
  console.log('Good bye!');
  process.exit();
});
