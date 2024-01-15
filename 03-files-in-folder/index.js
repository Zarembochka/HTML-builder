const fs = require('node:fs');
const path = require('node:path');
const pathToFolder = path.join(__dirname, 'secret-folder');

function readFilesInFolder(pathToFolder) {
  fs.readdir(pathToFolder, { withFileTypes: true }, (err, files) => {
    for (let i = 0; i < files.length; i += 1) {
      if (files[i].isDirectory()) {
        const pathToDirectoryInFolder = path.join(pathToFolder, files[i].name);
        readFilesInFolder(pathToDirectoryInFolder);
      }
      if (files[i].isFile()) {
        const pathToFile = path.join(pathToFolder, files[i].name);
        const fileObject = path.parse(pathToFile);
        const fileName = fileObject.name;
        if (fileName === '.gitkeep' || fileName === '.gitignore') {
          continue;
        }
        const fileExtension = fileObject.ext.slice(1);
        //get file size
        fs.stat(pathToFile, (err, stats) => {
          console.log(`${fileName} - ${fileExtension} - ${stats.size} bytes`);
        });
      }
    }
  });
}

readFilesInFolder(pathToFolder);
