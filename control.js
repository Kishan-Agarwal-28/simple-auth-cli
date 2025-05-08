#!/usr/bin/env node
import inquirer from "inquirer";
import fcpy from "./fcpy.js";
import chalk from "chalk";
import ora from "ora";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";

// Check if being run as an installed package
if (process.env.npm_config_global || process.env.npm_lifecycle_event === 'install' ||process.env.npm_lifecycle_event==='i') {
    console.log(chalk.yellow("\n⚠️  Note: This package is meant to be used with npx."));
    console.log(chalk.cyan("Please use:"));
    console.log(chalk.green("\nnpx simple-auth-cli\n"));
    process.exit(0);
}

const __dirname = dirname(fileURLToPath(import.meta.url));

inquirer.prompt([
    {
        type: "select",
        name: "language",
        message: "Do you want JS/TS?",
        choices: ["JavaScript", "TypeScript"],
        default: "JavaScript",
    },
    {
        type: "confirm",
        name: "oauth",
        message: "Do you want OAuth in your project (y/n)?",
        default: true,
    },
    {
        type: "confirm",
        name: "webauthn",
        message: "Do you want WebAuthn in your project (y/n)?",
        default: true,
    },
    {
        type: "confirm",
        name: "confirm",
        message: "Do you want to continue?",
    },
])
.then((answers) => {
    if (!answers.confirm) {
        console.log(chalk.red("⚠️  Note: You chose not to continue. Exiting..."));
        return;
    }

    if (answers.webauthn && !answers.oauth) {
        console.log(chalk.green("⚠️  Note: WebAuthn requires OAuth. OAuth will be included automatically."));
        answers.oauth = true; 
    }
    const currentVersion=fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8');
    const currentVersionJson = JSON.parse(currentVersion);

    const authConfig = {
        language: answers.language,
        features: {
            oauth: answers.oauth,
            webauthn: answers.webauthn
        },
        attribution:{
            package:"simple-auth-cli",
            version:currentVersionJson.version,
            license:"MIT",
            author:"Cosmology is fun!"
        },
        timestamp: new Date().toISOString(),
        template: answers.oauth && answers.webauthn ? 'web-authn' :
                 answers.oauth ? 'oauth' : 'simple'
    };
fs.writeFileSync('.auth', JSON.stringify(authConfig, null, 2), 'utf8');

const spinner = ora("Setting up your auth system...").start();

(async () => {
    try {
        if (answers.language === "JavaScript") {
            console.log("\nSetting up an auth system for you in JavaScript...\n");
            if (answers.oauth && !answers.webauthn) {
                await fcpy(path.resolve(__dirname, 'js', 'oauth'), process.cwd());
            }
            if (answers.webauthn) {
                await fcpy(path.resolve(__dirname, 'js', 'web-authn'), process.cwd());
            }
            if (!answers.oauth && !answers.webauthn) {
                await fcpy(path.resolve(__dirname, 'js', 'simple'), process.cwd());
            }
        } else {
            console.log("\nSetting up an auth system for you in TypeScript...\n");
            if (answers.oauth && !answers.webauthn) {
                await fcpy(path.resolve(__dirname, 'ts', 'oauth'), process.cwd());
            }
            if (answers.webauthn) {
                await fcpy(path.resolve(__dirname, 'ts', 'web-authn'), process.cwd());
            }
            if (!answers.oauth && !answers.webauthn) {
                await fcpy(path.resolve(__dirname, 'ts', 'simple'), process.cwd());
            }
        }

        spinner.text = "Installing dependencies...";
        const { execSync } = await import('child_process');
        try {
            execSync('npm install', { stdio: 'inherit' });
            spinner.succeed("Setup complete! Dependencies installed successfully.");
        } catch (error) {
            spinner.warn("Files copied but npm install failed. Please run 'npm install' manually.");
            console.error("npm install error:", error);
        }
    } catch (err) {
        spinner.fail("Setup failed.");
        console.error(err);
    }
})();
})
.catch((error) => {
    console.error("Error during setup:", error);
});
