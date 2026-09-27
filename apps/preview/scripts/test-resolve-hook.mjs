import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const srcRoot = fileURLToPath(new URL("../src/", import.meta.url));

function resolveFile(abs) {
    if (existsSync(abs)) return abs;
    if (existsSync(`${abs}.ts`)) return `${abs}.ts`;
    if (existsSync(`${abs}.tsx`)) return `${abs}.tsx`;
    if (existsSync(path.join(abs, "index.ts"))) return path.join(abs, "index.ts");
    return null;
}

export async function resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
        const file = resolveFile(path.join(srcRoot, specifier.slice(2)));
        if (file) return nextResolve(pathToFileURL(file).href, context);
    }
    if (
        (specifier.startsWith("./") || specifier.startsWith("../")) &&
        context.parentURL &&
        !path.extname(specifier)
    ) {
        const file = resolveFile(fileURLToPath(new URL(specifier, context.parentURL)));
        if (file) return nextResolve(pathToFileURL(file).href, context);
    }
    return nextResolve(specifier, context);
}
