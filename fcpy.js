import fs from "fs/promises";
import path from "path";

/**
 * Merges dependencies from source package.json into destination package.json
 */
const mergeDependencies = async (srcPath, destPath) => {
    try {
        const srcContent = JSON.parse(await fs.readFile(srcPath, 'utf8'));
        const destContent = await fs.readFile(destPath, 'utf8').then(JSON.parse).catch(() => ({}));

        // Merge dependencies and devDependencies
        const sections = ['dependencies', 'devDependencies'];
        sections.forEach(section => {
            if (srcContent[section]) {
                destContent[section] = {
                    ...(destContent[section] || {}),
                    ...srcContent[section]
                };
            }
        });

        // Write merged package.json
        await fs.writeFile(destPath, JSON.stringify(destContent, null, 2));
    } catch (error) {
        console.error('Error merging package.json:', error);
        throw error;
    }
};

/**
 * Asynchronously copies files and folders from src to dest recursively.
 */
const fcpy = async (src, dest) => {
    const stats = await fs.stat(src);

    if (stats.isDirectory()) {
        await fs.mkdir(dest, { recursive: true });
        const entries = await fs.readdir(src, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.name === "node_modules") continue;

            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.name === "package.json") {
                // Special handling for package.json
                const destExists = await fs.access(destPath).then(() => true).catch(() => false);
                if (destExists) {
                    await mergeDependencies(srcPath, destPath);
                } else {
                    await fs.copyFile(srcPath, destPath);
                }
                continue;
            }

            await fcpy(srcPath, destPath);
        }
    } else {
        await fs.copyFile(src, dest);
    }
};

export default fcpy;
