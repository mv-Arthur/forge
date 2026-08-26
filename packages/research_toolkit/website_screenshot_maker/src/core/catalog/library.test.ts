import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
    emptyLibrary,
    internAndStamp,
    internItems,
    uniqueInternIds,
    writeLibrary,
} from "./library.js";

function tmpOut(): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-lib-"));
    fs.mkdirSync(path.join(dir, "crops"));
    return dir;
}

function put(dir: string, rel: string, body: string): void {
    const abs = path.join(dir, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, body);
}

test("same default bytes intern to one id; hover stays on that crop", () => {
    const dir = tmpOut();
    put(dir, "crops/home-button-1-default.png", "AAA");
    put(dir, "crops/home-button-1-hover.png", "BBB");
    put(dir, "crops/item-button-1-default.png", "AAA");
    const library = emptyLibrary();
    const ids = internItems(
        [
            {
                kind: "button",
                state: "default",
                file: "crops/home-button-1-default.png",
                layer: "atom",
            },
            {
                kind: "button",
                state: "hover",
                file: "crops/home-button-1-hover.png",
                layer: "atom",
            },
            {
                kind: "button",
                state: "default",
                file: "crops/item-button-1-default.png",
                layer: "atom",
            },
        ],
        dir,
        library,
    );
    assert.equal(ids[0], ids[1]);
    assert.equal(ids[0], ids[2]);
    assert.equal(Object.keys(library.crops).length, 1);
    const crop = library.crops[ids[0]];
    assert.equal(crop.layer, "atom");
    assert.equal(crop.kind, "button");
    assert.ok(crop.states.default);
    assert.ok(crop.states.hover);
    assert.equal(crop.states.default.file, "crops/home-button-1-default.png");
});

test("different default bytes stay distinct; missing file skipped", () => {
    const dir = tmpOut();
    put(dir, "crops/a-button-1-default.png", "AAA");
    put(dir, "crops/b-button-1-default.png", "CCC");
    const library = emptyLibrary();
    const ids = internItems(
        [
            {
                kind: "button",
                state: "default",
                file: "crops/a-button-1-default.png",
                layer: "atom",
            },
            {
                kind: "button",
                state: "default",
                file: "crops/b-button-1-default.png",
                layer: "atom",
            },
            {
                kind: "button",
                state: "default",
                file: "crops/missing-button-1-default.png",
                layer: "atom",
            },
        ],
        dir,
        library,
    );
    assert.notEqual(ids[0], ids[1]);
    assert.equal(ids[2], "");
    assert.equal(Object.keys(library.crops).length, 2);
});

test("same chrome intern even when png bytes differ", () => {
    const dir = tmpOut();
    put(dir, "crops/home-button-1-default.png", "LOOKS-A");
    put(dir, "crops/home-button-2-default.png", "LOOKS-B");
    const library = emptyLibrary();
    const ids = internItems(
        [
            {
                kind: "button",
                state: "default",
                file: "crops/home-button-1-default.png",
                layer: "atom",
                chrome: "pill-green",
            },
            {
                kind: "button",
                state: "default",
                file: "crops/home-button-2-default.png",
                layer: "atom",
                chrome: "pill-green",
            },
        ],
        dir,
        library,
    );
    assert.equal(ids[0], ids[1]);
    assert.equal(Object.keys(library.crops).length, 1);
});

test("internAndStamp writes ids on slots; uniqueInternIds drops empties", () => {
    const dir = tmpOut();
    put(dir, "crops/home-card-1-default.png", "CARD");
    put(dir, "crops/item-card-1-default.png", "CARD");
    const library = emptyLibrary();
    const slots: {
        kind: string;
        state: string;
        file: string;
        id?: string;
    }[] = [
        { kind: "card", state: "default", file: "crops/home-card-1-default.png" },
        { kind: "card", state: "default", file: "crops/item-card-1-default.png" },
    ];
    const ids = internAndStamp(slots, "widget", dir, library);
    assert.equal(ids.length, 1);
    assert.equal(slots[0].id, ids[0]);
    assert.equal(slots[1].id, ids[0]);
    assert.deepEqual(uniqueInternIds(["", ids[0], ids[0]]), [ids[0]]);
    const file = writeLibrary(library, dir);
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.ok(parsed.crops[ids[0]]);
    const written = parsed.crops[ids[0]].states.default.file as string;
    assert.equal(written.startsWith("file:"), true);
    assert.equal(library.crops[ids[0]].states.default.file, "crops/home-card-1-default.png");
});
