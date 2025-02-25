const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, '..', 'build');
const source = path.join(buildPath, 'index.html');
const destination = path.join(buildPath, '404.html');

try {
  if (!fs.existsSync(buildPath)) {
    console.error('Build directory does not exist');
    process.exit(1);
  }

  fs.copyFileSync(source, destination);
  console.log('Successfully copied index.html to 404.html');
} catch (error) {
  console.error('Error copying file:', error);
  process.exit(1);
} 