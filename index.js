#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import process from 'process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function mergeDependencies(userPackageJson, myPackageJson) {
  if (!userPackageJson.dependencies) {
    userPackageJson.dependencies = myPackageJson.dependencies;
  } else {
    userPackageJson.dependencies = {
      ...userPackageJson.dependencies,
      ...myPackageJson.dependencies,
    };
  }
  return userPackageJson;
}

async function copyFiles(srcDir, destDir) {
  try {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const files = await fs.promises.readdir(srcDir);

    for (const file of files) {
      if (file === 'package.json') {
        continue;
      }

      const srcFilePath = path.join(srcDir, file);
      const destFilePath = path.join(destDir, file);

      const stat = await fs.promises.stat(srcFilePath);
      if (stat.isFile()) {
        await fs.promises.copyFile(srcFilePath, destFilePath);
      }
    }
  } catch (err) {
    console.error('Error copying files:', err);
    process.exit(1);
  }
}

function updatePackageJson(srcDir, destDir) {
  const myPackageJsonPath = path.join(srcDir, 'package.json');
  const userPackageJsonPath = path.join(destDir, 'package.json');

  fs.promises.readFile(myPackageJsonPath, 'utf-8')
    .then((myPackageData) => {
      const myPackageJson = JSON.parse(myPackageData);

      return fs.promises.readFile(userPackageJsonPath, 'utf-8')
        .then((userPackageData) => {
          const userPackageJson = JSON.parse(userPackageData);

          const updatedPackageJson = mergeDependencies(userPackageJson, myPackageJson);

          fs.promises.writeFile(userPackageJsonPath, JSON.stringify(updatedPackageJson, null, 2), 'utf-8')
            .then(() => {
              console.log('User package.json updated with merged dependencies.');
            })
            .catch((err) => {
              console.error('Error writing to user package.json:', err);
              process.exit(1);
            });
        })
        .catch(() => {
          fs.promises.copyFile(myPackageJsonPath, userPackageJsonPath)
            .then(() => {
              console.log('My package.json copied to the user\'s directory.');
            })
            .catch((err) => {
              console.error('Error copying package.json:', err);
              process.exit(1);
            });
        });
    })
    .catch((err) => {
      console.error('Error reading my package.json:', err);
      process.exit(1);
    });
}

(async () => {
  const srcDirectory = path.resolve(__dirname, 'auth-cli');
  const destDirectory = process.cwd();

  console.log(`Copying files from ${srcDirectory} to ${destDirectory}...`);

  await copyFiles(srcDirectory, destDirectory);

  updatePackageJson(srcDirectory, destDirectory);
  console.log("installing dependencies ....");
  exec('npm install', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${err}`);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      return;
    }
    console.log(`stdout: ${stdout}`);
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
  });
})();
