const fs = require('node:fs');
const fsPromise = require('node:fs/promises');
const path = require('node:path');

function copyDir(pathFrom, pathTo) {
  fs.promises
    .mkdir(pathTo, { recursive: true }, () => {})
    .then(() => {
      fs.promises.readdir(pathTo).then((files) => {
        for (let i = 0; i < files.length; i += 1) {
          const pathToFile = path.join(pathTo, files[i]);
          fs.unlink(pathToFile, () => {});
        }
      });
    })
    .then(() => {
      fs.promises.readdir(pathFrom).then((files) => {
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
    });
}

function buildingBundleCss(pathFrom, pathTo) {
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

function createDirectory(pathTo, nameDirectory) {
  const pathToDirectory = path.join(pathTo, nameDirectory);
  fs.mkdir(pathToDirectory, { recursive: true }, () => {});
}

function copyFolder(pathTo, directoryTo, directoryFrom) {
  let pathToNewDirectory = path.join(pathTo, directoryTo);
  createDirectory(pathToNewDirectory, directoryFrom);
  const pathToOldDirectory = path.join(__dirname, directoryFrom);
  pathToNewDirectory = path.join(pathToNewDirectory, directoryFrom);
  readDirectoriesInFolder(pathToOldDirectory, pathToNewDirectory);
}

function readDirectoriesInFolder(pathToOldFolder, pathToNewFolder) {
  fs.readdir(pathToOldFolder, { withFileTypes: true }, (err, files) => {
    for (let i = 0; i < files.length; i += 1) {
      if (files[i].isDirectory()) {
        const pathToOldDirectoryInFolder = path.join(
          pathToOldFolder,
          files[i].name,
        );
        const pathToNewDirectoryInFolder = path.join(
          pathToNewFolder,
          files[i].name,
        );
        copyDir(pathToOldDirectoryInFolder, pathToNewDirectoryInFolder);
      }
    }
  });
}

function createStyles(pathTo, nameDirectory, nameFolderStyles) {
  const pathToFolderStyles = path.join(pathTo, nameFolderStyles);
  const pathToFileStyles = path.join(pathTo, nameDirectory, 'style.css');
  buildingBundleCss(pathToFolderStyles, pathToFileStyles);
}

function createIndexHtml(pathTo, nameDirectory, nameFile) {
  const pathToFile = path.join(pathTo, nameDirectory, nameFile);
  fs.unlink(pathToFile, () => {});
  const file = fs.createWriteStream(pathToFile, 'utf-8');
  buildingBundleHtml(pathTo, 'template.html', file);
}

async function buildingBundleHtml(pathTo, nameFile, fileToWrite) {
  const pathToFile = path.join(pathTo, nameFile);
  const template = await fsPromise.readFile(pathToFile, 'utf-8');
  const pathToComponents = path.join(pathTo, 'components');
  replaceTagsAndWrite(pathToComponents, template, fileToWrite);
}

async function replaceTagsAndWrite(pathTo, template, fileToWrite) {
  let html = template;
  const regexp = /\{\{\w+\}\}/g;
  const tags = template.match(regexp);
  for (let i = 0; i < tags.length; i += 1) {
    const tag = tags[i];
    const tagName = tag.slice(2, -2);
    const fileName = tagName + '.html';
    const pathToFile = path.join(pathTo, fileName);
    const tagDataFile = await fsPromise.readFile(pathToFile, 'utf-8');
    html = html.replace(tag, tagDataFile);
  }
  fileToWrite.write(html);
}

function buildPage() {
  createDirectory(__dirname, 'project-dist');
  copyFolder(__dirname, 'project-dist', 'assets');
  createStyles(__dirname, 'project-dist', 'styles');
  createIndexHtml(__dirname, 'project-dist', 'index.html');
}

buildPage();
