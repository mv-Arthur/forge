import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { writeAtlas, type Atlas } from "./catalog.js";
import { emptyOccupancy } from "../dissect/occupancy.js";

test("writeAtlas round-trip", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-cat-"));
    const atlas: Atlas = {
        site: "https://ex.test",
        labelSource: "heuristic",
        templates: [
            {
                id: "/",
                pathPattern: "/",
                urls: ["https://ex.test/"],
                occupancy: [emptyOccupancy()],
                representatives: ["https://ex.test/"],
                slots: [],
                label: "home",
                page: "",
                widgets: [],
                atoms: [],
                widgetIds: [],
                atomIds: [],
                tokens: { colors: [], fonts: [], radii: [], shadows: [] },
            },
        ],
    };
    atlas.library = { crops: {} };
    const file = writeAtlas(atlas, dir);
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as Atlas;
    assert.equal(parsed.templates.length, 1);
    assert.equal(parsed.templates[0].id, "/");
    assert.deepEqual(parsed.templates[0].widgetIds, []);
    assert.equal("library" in parsed, false);
});
