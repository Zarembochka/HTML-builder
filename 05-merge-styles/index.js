const fs = require('node:fs');
const path = require('node:path');
const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const pathToFiles = path.join(__dirname, 'styles');

function buildingBundle(pathFrom, pathTo) {
  fs.unlink(pathTo, () => {});
  const file = fs.createWriteStream(pathTo, 'utf-8');
  fs.readdir(pathFrom, { withFileTypes: true }, (err, files) => {
    for (let i = 0; i < files.length; i += 1) {
      if (files[i].isFile()) {
        const fileExtension = path.extname(files[i].name).slice(1);
        if (fileExtension === 'css') {
          const pathToFile = path.join(pathFrom, files[i].name);
          const read = fs.createReadStream(pathToFile, 'utf-8');
          read.on('data', (data) => file.write(data));
        }
      }
    }
  });
}

buildingBundle(pathToFiles, pathToBundle);
