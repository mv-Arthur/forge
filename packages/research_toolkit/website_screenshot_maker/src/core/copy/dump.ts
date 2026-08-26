import fs from "fs";
import path from "path";
import type { CopyDump } from "./types.js";

export function writeCopy(dump: CopyDump, outDir: string): string {
    fs.mkdirSync(outDir, { recursive: true });
    const file = path.join(outDir, "copy.json");
    fs.writeFileSync(file, JSON.stringify(dump, null, 2));
    return file;
}
