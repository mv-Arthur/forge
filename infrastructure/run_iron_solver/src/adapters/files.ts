import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";

import type { FilePort } from "@forge/iron-solver";

export function createFileAdapter(root: string): FilePort {
    return {
        ensureDir: (path) => {
            mkdirSync(path, { recursive: true });
        },
        readText: (path) => readFileSync(path, "utf8"),
        writeText: (path, content) => {
            writeFileSync(path, content, "utf8");
        },
        repoPath: (...parts) => {
            const [first, ...rest] = parts;

            if (first && isAbsolute(first)) {
                return join(first, ...rest);
            }

            return join(root, ...parts);
        },
    };
}
