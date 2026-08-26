import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { withAssetFileUrls } from "./href.js";

export type LibraryStateFile = {
    file: string;
    hash: string;
};

export type LibraryCrop = {
    id: string;
    kind: string;
    layer: "widget" | "atom";
    chrome?: string;
    states: Record<string, LibraryStateFile>;
};

export type CropLibrary = {
    crops: Record<string, LibraryCrop>;
};

export type LibraryItem = {
    kind: string;
    state: string;
    file: string;
    layer: "widget" | "atom";
    chrome?: string;
};

const WIDGET_KINDS = new Set([
    "hero",
    "card",
    "section",
    "form",
    "header",
    "nav",
    "footer",
    "gallery",
    "filters",
    "dialog",
    "tabs",
]);

function hashFile(outDir: string, rel: string): string | null {
    const abs = path.join(outDir, rel);
    if (!fs.existsSync(abs)) return null;
    return createHash("md5").update(fs.readFileSync(abs)).digest("hex");
}

function hashStr(s: string): string {
    return createHash("md5").update(s).digest("hex");
}

function cropStem(file: string, state: string): string {
    const dir = path.dirname(file);
    const base = path.basename(file);
    const suffix = `-${state}.png`;
    const stem = base.endsWith(suffix) ? base.slice(0, -suffix.length) : base;
    return dir === "." ? stem : path.join(dir, stem);
}

export function emptyLibrary(): CropLibrary {
    return { crops: {} };
}

export function uniqueInternIds(ids: string[]): string[] {
    const out: string[] = [];
    const seen = new Set<string>();
    for (const id of ids) {
        if (!id || seen.has(id)) continue;
        seen.add(id);
        out.push(id);
    }
    return out;
}

export function writeLibrary(library: CropLibrary, outDir: string): string {
    fs.mkdirSync(outDir, { recursive: true });
    const file = path.join(outDir, "library.json");
    fs.writeFileSync(file, JSON.stringify(withAssetFileUrls(library, outDir), null, 2));
    return file;
}

export function internItems(
    items: LibraryItem[],
    outDir: string,
    library: CropLibrary,
): string[] {
    const groupKeys = items.map(
        (it) => `${it.layer}|${it.kind}|${cropStem(it.file, it.state)}`,
    );
    const groups = new Map<string, LibraryItem[]>();
    for (let i = 0; i < items.length; i++) {
        const k = groupKeys[i];
        const g = groups.get(k) ?? [];
        g.push(items[i]);
        groups.set(k, g);
    }
    const keyToId = new Map<string, string>();
    for (const c of Object.values(library.crops)) {
        if (c.chrome) {
            keyToId.set(`${c.layer}:${c.kind}:c:${c.chrome}`, c.id);
            continue;
        }
        const def = c.states.default ?? Object.values(c.states)[0];
        if (def) keyToId.set(`${c.layer}:${c.kind}:${def.hash}`, c.id);
    }
    const groupId = new Map<string, string>();
    for (const [gkey, group] of groups) {
        const states: Record<string, LibraryStateFile> = {};
        for (const it of group) {
            const h = hashFile(outDir, it.file);
            if (!h) continue;
            if (!states[it.state]) states[it.state] = { file: it.file, hash: h };
        }
        const hashes = Object.values(states);
        if (hashes.length === 0) continue;
        const defHash = (states.default ?? hashes[0]).hash;
        const layer = group[0].layer;
        const kind = group[0].kind;
        const defItem = group.find((g) => g.state === "default") ?? group[0];
        const chrome = defItem.chrome ? hashStr(defItem.chrome) : undefined;
        const internKey = chrome
            ? `${layer}:${kind}:c:${chrome}`
            : `${layer}:${kind}:${defHash}`;
        const digest = chrome ?? defHash;
        let id = keyToId.get(internKey);
        if (!id) {
            id = `${layer === "atom" ? "a" : "w"}_${kind}_${digest.slice(0, 8)}`;
            keyToId.set(internKey, id);
            library.crops[id] = { id, kind, layer, states, ...(chrome ? { chrome } : {}) };
        } else {
            const cur = library.crops[id];
            for (const [st, val] of Object.entries(states)) {
                if (!cur.states[st]) cur.states[st] = val;
            }
        }
        groupId.set(gkey, id);
    }
    return groupKeys.map((k) => groupId.get(k) ?? "");
}

export function internAndStamp<
    T extends { kind: string; state: string; file: string; id?: string; chrome?: string },
>(
    slots: T[],
    layer: "widget" | "atom",
    outDir: string,
    library: CropLibrary,
): string[] {
    const ids = internItems(
        slots.map((s) => ({
            kind: s.kind,
            state: s.state,
            file: s.file,
            layer,
            chrome: s.chrome,
        })),
        outDir,
        library,
    );
    for (let i = 0; i < slots.length; i++) {
        if (ids[i]) slots[i].id = ids[i];
    }
    return uniqueInternIds(ids);
}

export function internTree(
    node: {
        kind: string;
        state?: string;
        file: string;
        id?: string;
        chrome?: string;
        children?: unknown[];
    },
    outDir: string,
    library: CropLibrary,
): void {
    if (node.kind !== "page" && node.file) {
        const layer = WIDGET_KINDS.has(node.kind) ? "widget" : "atom";
        const slot = {
            kind: node.kind,
            state: node.state ?? "default",
            file: node.file,
            chrome: node.chrome,
            id: node.id,
        };
        internAndStamp([slot], layer, outDir, library);
        if (slot.id) node.id = slot.id;
    }
    const kids = node.children;
    if (!Array.isArray(kids)) return;
    for (const ch of kids) {
        internTree(
            ch as {
                kind: string;
                state?: string;
                file: string;
                id?: string;
                chrome?: string;
                children?: unknown[];
            },
            outDir,
            library,
        );
    }
}
