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
console.log(files);
    for (const file of files) {
      if (file === 'package.json') {
        continue;
      }

      const srcFilePath = path.join(srcDir, file);
      const destFilePath = path.join(destDir, file);

      const stat = await fs.promises.stat(srcFilePath);
      console.log(stat.isFile());
       if (stat.isFile()) {
        await fs.promises.copyFile(srcFilePath, destFilePath);
      } else if (stat.isDirectory()) {
        await copyFiles(srcFilePath, destFilePath); 
      }
    }
  } catch (err) {
    console.error('Error copying files:', err);
    process.exit(1);
  }
}
async function updatePackageJson(srcDir, destDir) {
  const myPackageJsonPath = path.join(srcDir, '..', 'package.json'); 

  const userPackageJsonPath = path.join(destDir, 'package.json');

  try {
  
    const myPackageData = await fs.promises.readFile(myPackageJsonPath, 'utf-8');
    const myPackageJson = JSON.parse(myPackageData);

    let userPackageJson = {};
    
    try {
      const userPackageData = await fs.promises.readFile(userPackageJsonPath, 'utf-8');
      userPackageJson = JSON.parse(userPackageData);
    } catch (err) {
      console.log("User package.json not found. Creating a new one...");
    }

    const updatedPackageJson = mergeDependencies(userPackageJson, myPackageJson);

    await fs.promises.writeFile(userPackageJsonPath, JSON.stringify(updatedPackageJson, null, 2), 'utf-8');
    console.log('package.json updated successfully!');

  } catch (err) {
    console.error('Error handling package.json:', err);
    process.exit(1);
  }
}

(async () => {
  const srcDirectory = path.resolve(__dirname, 'auth-cli');
  const destDirectory = process.cwd();

  console.log(`Copying files to ${destDirectory}...`);

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
