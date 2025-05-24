import fs from "fs/promises";
import path from "path";

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

            await fcpy(srcPath, destPath);
        }
    } else {
        await fs.copyFile(src, dest);
    }
};

export default fcpy;
