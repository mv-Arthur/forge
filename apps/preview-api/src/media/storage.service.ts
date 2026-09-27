import {
    mkdir,
    readFile,
    rename,
    stat,
    unlink,
    writeFile,
} from "node:fs/promises";
import path from "node:path";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { resolveInside } from "./media-path.js";

@Injectable()
export class StorageService {
    readonly root: string;

    constructor(config: ConfigService) {
        const fromEnv = config.get<string>("MEDIA_ROOT");
        this.root = path.resolve(
            fromEnv && fromEnv.trim()
                ? fromEnv
                : path.join(__dirname, "../../../preview/data/fixtures/media")
        );
    }

    abs(key: string): string {
        return resolveInside(this.root, key);
    }

    async exists(key: string): Promise<boolean> {
        try {
            await stat(this.abs(key));
            return true;
        } catch {
            return false;
        }
    }

    async put(key: string, body: Buffer): Promise<void> {
        const abs = this.abs(key);
        await mkdir(path.dirname(abs), { recursive: true });
        await writeFile(abs, body);
    }

    async read(key: string): Promise<Buffer> {
        return readFile(this.abs(key));
    }

    async remove(key: string): Promise<void> {
        await unlink(this.abs(key));
    }

    async move(fromKey: string, toKey: string): Promise<void> {
        const dest = this.abs(toKey);
        await mkdir(path.dirname(dest), { recursive: true });
        await rename(this.abs(fromKey), dest);
    }
}
