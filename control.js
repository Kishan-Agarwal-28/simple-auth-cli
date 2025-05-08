#!/usr/bin/env node
import inquirer from "inquirer";
import fcpy from "./fcpy.js";
import chalk from "chalk";
import ora from "ora";
import { fileURLToPath } from "url";
import { dirname } from "path";
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

  // Inside an async function like this:
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
setTimeout(() => {
    
    spinner.succeed("Setup complete!");
}, 1000); 
    } catch (err) {
        spinner.fail("Setup failed.");
        console.error(err);
    }
})();
})
.catch((error) => {
    console.error("Error during setup:", error);
});
