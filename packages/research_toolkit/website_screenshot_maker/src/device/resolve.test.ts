import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
    loadMatrix,
    parseMatrix,
    resolveDevice,
    resolveDeviceList,
} from "./index.js";

test("parseMatrix fills defaults", () => {
    const [d] = parseMatrix([{ id: "wide", width: 1920, height: 1080 }]);
    assert.equal(d.id, "wide");
    assert.equal(d.width, 1920);
    assert.equal(d.height, 1080);
    assert.equal(d.deviceScaleFactor, 1);
    assert.equal(d.isMobile, false);
    assert.equal(d.userAgent, undefined);
});

test("parseMatrix keeps explicit flags", () => {
    const [d] = parseMatrix([{
        id: "phone",
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        isMobile: true,
        userAgent: "UA",
    }]);
    assert.equal(d.deviceScaleFactor, 3);
    assert.equal(d.isMobile, true);
    assert.equal(d.userAgent, "UA");
});

test("parseMatrix rejects bad catalogs", () => {
    assert.throws(() => parseMatrix([]), /non-empty array/);
    assert.throws(() => parseMatrix({}), /non-empty array/);
    assert.throws(() => parseMatrix(["x"]), /must be an object/);
    assert.throws(() => parseMatrix([{ width: 1, height: 1 }]), /\.id is required/);
    assert.throws(
        () => parseMatrix([
            { id: "a", width: 1, height: 1 },
            { id: "a", width: 2, height: 2 },
        ]),
        /duplicated: a/,
    );
    assert.throws(() => parseMatrix([{ id: "a", width: 0, height: 1 }]), /\.width is required/);
    assert.throws(() => parseMatrix([{ id: "a", width: 1, height: -1 }]), /\.height is required/);
});

test("loadMatrix reads file and missing file", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-mx-"));
    const file = path.join(dir, "matrix.json");
    fs.writeFileSync(file, JSON.stringify([{ id: "d", width: 10, height: 20 }]));
    const [d] = loadMatrix(file);
    assert.equal(d.id, "d");
    assert.equal(d.width, 10);
    assert.throws(() => loadMatrix(path.join(dir, "nope.json")), /device matrix not found/);
});

test("resolveDevice and resolveDeviceList", () => {
    const matrix = parseMatrix([
        { id: "desktop", width: 1440, height: 900 },
        { id: "tablet", width: 768, height: 1024 },
    ]);
    assert.equal(resolveDevice("tablet", matrix).width, 768);
    assert.throws(() => resolveDevice("nope", matrix), /unknown device: nope/);
    assert.deepEqual(
        resolveDeviceList(["tablet", "desktop"], matrix).map((d) => d.id),
        ["tablet", "desktop"],
    );
});
