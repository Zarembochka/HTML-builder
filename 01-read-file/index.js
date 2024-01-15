const fs = require('node:fs');
const path = require('node:path');
const pathFull = path.join(__dirname, 'text.txt');
const read = fs.createReadStream(pathFull, 'utf-8');
read.on('data', (data) => console.log(data));
