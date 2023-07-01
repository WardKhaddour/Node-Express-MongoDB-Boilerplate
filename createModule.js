const fs = require('fs');
const path = require('path');

// Get the module name from command-line arguments
const moduleName = process.argv[2];

if (!moduleName) {
  console.error('Please provide a module name.');
  process.exit(1);
}

const baseDir = path.join(__dirname, 'src/modules');
const moduleDir = path.join(baseDir, moduleName);

function createClass(fileName, folderPath) {
  const className = fileName.slice(0, -3);
  const classContent = `class ${className} {
  // TODO: Implement ${className} class
}

module.exports = ${className};
`;

  const filePath = path.join(folderPath, fileName);
  fs.writeFileSync(filePath, classContent);
}

function createMongooseModel(fileName, folderPath) {
  const modelName = fileName.slice(0, -3);
  const modelContent = `const mongoose = require('mongoose');

const ${modelName}Schema = new mongoose.Schema({
  // TODO: Define ${modelName} schema fields
});

const ${modelName} = mongoose.model('${modelName}', ${modelName}Schema);

module.exports = ${modelName};
`;

  const filePath = path.join(folderPath, fileName);
  fs.writeFileSync(filePath, modelContent);
}

function createExpressRouter(fileName, folderPath) {
  const routerContent = `const { Router } = require('express');

const router = Router();

// TODO: Implement ${moduleName} router

module.exports = router;
`;

  const filePath = path.join(folderPath, fileName);
  fs.writeFileSync(filePath, routerContent);
}

// Check if the module folder already exists
if (fs.existsSync(moduleDir)) {
  console.error(`Module "${moduleName}" already exists.`);
  process.exit(1);
}

const subFolders = [
  'controllers',
  'models',
  'router',
  'services',
  'DAO',
  'validators',
  'helpers',
];
const dependenciesFile = path.join(moduleDir, 'dependencies.js');

// Create the module directory
fs.mkdirSync(moduleDir);

// Create the subfolders inside the module directory
subFolders.forEach(folder => {
  const folderPath = path.join(moduleDir, folder);
  fs.mkdirSync(folderPath);

  let fileName;
  if (folder === 'models') {
    fileName = `${moduleName}.js`;
    createMongooseModel(fileName, folderPath);
  } else if (folder === 'router') {
    fileName = 'index.js';
    createExpressRouter(fileName, folderPath);
  } else if (folder === 'DAO') {
    fileName = `${
      moduleName + folder.charAt(0).toUpperCase() + folder.slice(1)
    }.js`;
    createClass(fileName, folderPath);
  } else if (folder === 'validators') {
    fileName = '';
  } else {
    fileName = `${
      moduleName + folder.charAt(0).toUpperCase() + folder.slice(1, -1)
    }.js`;
    createClass(fileName, folderPath);
  }

  console.log(`Created file "${fileName}" in "${folder}" folder.`);
});

// Create the dependencies.js file
fs.writeFileSync(dependenciesFile, '');

console.log(`Module "${moduleName}" has been created successfully.`);
