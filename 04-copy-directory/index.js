const fs = require('node:fs');
const path = require('node:path');
const pathToFolder = path.join(__dirname, 'files');
const pathToFolderCopy = path.join(__dirname, 'files-copy');

function copyDir(pathFrom, pathTo) {
  fs.mkdir(pathTo, { recursive: true }, () => {});
  fs.readdir(pathTo, (err, files) => {
    for (let i = 0; i < files.length; i += 1) {
      const pathToFile = path.join(pathTo, files[i]);
      fs.unlink(pathToFile, () => {});
    }
  });
  fs.readdir(pathFrom, (err, files) => {
    for (let i = 0; i < files.length; i += 1) {
      const pathToFile = path.join(pathFrom, files[i]);
      const pathToFileCopy = path.join(pathTo, files[i]);
      fs.copyFile(
        pathToFile,
        pathToFileCopy,
        fs.constants.COPYFILE_FICLONE,
        () => {},
      );
    }
  });
}

copyDir(pathToFolder, pathToFolderCopy);
