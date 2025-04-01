const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const env = process.env.NODE_ENV || 'dev';

let configSourcePath;

if (env === 'prod') {
  configSourcePath = 'dist/config.prod.js';
} else {
  configSourcePath = 'dist/config.dev.js';
}

try {
  if (fs.existsSync(configSourcePath)) {
    fs.copyFileSync(configSourcePath, 'dist/config.js');
    console.log(`Successfully copied ${env} config to config.js.`);
  } else {
    console.error(`Config file ${configSourcePath} not found.`);
    process.exit(1);
  }

  fs.copyFileSync('package.json', 'dist/package.json');

  if (fs.existsSync('package-lock.json')) {
    fs.copyFileSync('package-lock.json', 'dist/package-lock.json');
  }

  execSync('npm install --omit=dev', {
    cwd: path.join(__dirname, 'dist'),
    stdio: 'inherit',
  });

  console.log('Post-build actions completed successfully.');
} catch (err) {
  console.error('Error during post-build step: ', err);
  process.exit(1);
}
