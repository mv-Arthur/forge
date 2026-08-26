import fs from "fs";
import path from "path";
import type { Occupancy } from "../dissect/occupancy.js";
import type { TokenSet } from "../dissect/tokens.js";
import type { CropLibrary } from "./library.js";
import type { CropNode } from "../dissect/tree.js";
import { withAssetFileUrls } from "./href.js";

export type AtlasSlot = {
    id?: string;
    kind: string;
    state: string;
    file: string;
    label: string;
};

export type AtlasTemplate = {
    id: string;
    pathPattern: string;
    urls: string[];
    occupancy: Occupancy[];
    representatives: string[];
    slots: AtlasSlot[];
    label: string;
    page: string;
    widgets: AtlasSlot[];
    atoms: AtlasSlot[];
    widgetIds: string[];
    atomIds: string[];
    tokens: TokenSet;
    tree?: CropNode;
};

export type Atlas = {
    site: string;
    labelSource: "heuristic" | "custom";
    templates: AtlasTemplate[];
    library?: CropLibrary;
};

export function writeAtlas(atlas: Atlas, outDir: string): string {
    fs.mkdirSync(outDir, { recursive: true });
    const file = path.join(outDir, "atlas.json");
    const { library: _library, ...doc } = atlas;
    fs.writeFileSync(file, JSON.stringify(withAssetFileUrls(doc, outDir), null, 2));
    return file;
}
