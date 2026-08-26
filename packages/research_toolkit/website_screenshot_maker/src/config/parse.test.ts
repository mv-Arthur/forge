import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadConfig, parseConfigFile, parseOrigin } from "./index.js";
import { parseMatrix } from "../device/index.js";

const cwd = process.cwd();
const matrix = parseMatrix([
    { id: "desktop", width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false },
    { id: "tablet", width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true },
]);

function tmp(): string {
    return fs.mkdtempSync(path.join(os.tmpdir(), "wsm-cfg-"));
}

test("parseConfigFile defaults to desktop and .out", () => {
    const c = parseConfigFile({ origin: "https://ex.com" }, cwd, matrix);
    assert.equal(c.devices.length, 1);
    assert.equal(c.devices[0].id, "desktop");
    assert.equal(c.devices[0].width, 1440);
    assert.equal(c.devices[0].height, 900);
    assert.equal(c.concurrency, 2);
    assert.equal(c.tabsPerBrowser, 1);
    assert.equal(c.navTimeout, 45000);
    assert.equal(c.locale, "ru-RU");
    assert.equal(c.out, path.resolve(cwd, ".out"));
});

test("parseConfigFile resolves device ids from matrix", () => {
    const c = parseConfigFile(
        { origin: "https://ex.com", devices: ["tablet"] },
        cwd,
        matrix,
    );
    assert.equal(c.devices[0].id, "tablet");
    assert.equal(c.devices[0].width, 768);
});

test("parseConfigFile rejects unknown device id", () => {
    assert.throws(
        () => parseConfigFile({ origin: "https://ex.com", devices: ["nope"] }, cwd, matrix),
        /unknown device:/,
    );
});

test("parseConfigFile rejects inline device objects", () => {
    assert.throws(
        () => parseConfigFile(
            { origin: "https://ex.com", devices: [{ id: "wide", width: 1280, height: 720 }] },
            cwd,
            matrix,
        ),
        /must be a string id/,
    );
});

test("parseConfigFile rejects viewport", () => {
    assert.throws(
        () => parseConfigFile(
            { origin: "https://ex.com", viewport: { width: 1280, height: 720 } },
            cwd,
            matrix,
        ),
        /use devices only/,
    );
});

test("parseConfigFile accepts consumer matrix ids", () => {
    const custom = parseMatrix([{ id: "wide", width: 1920, height: 1080 }]);
    const c = parseConfigFile(
        { origin: "https://ex.com", devices: ["wide"] },
        cwd,
        custom,
    );
    assert.equal(c.devices[0].id, "wide");
    assert.equal(c.devices[0].width, 1920);
});

test("parseConfigFile rejects bad input", () => {
    assert.throws(() => parseConfigFile([], cwd, matrix), /config must be a JSON object/);
    assert.throws(() => parseConfigFile({}, cwd, matrix), /origin is required/);
    assert.throws(
        () => parseConfigFile({ origin: "   " }, cwd, matrix),
        /origin must be a non-empty string/,
    );
    assert.throws(
        () => parseConfigFile({ origin: "https://ex.com", devices: [] }, cwd, matrix),
        /devices must be a non-empty array/,
    );
    assert.throws(
        () => parseConfigFile({ origin: "https://ex.com", concurrency: 0 }, cwd, matrix),
        /concurrency must be a positive number/,
    );
    assert.throws(
        () => parseConfigFile({ origin: "https://ex.com", locale: "" }, cwd, matrix),
        /locale must be a non-empty string/,
    );
});

test("parseConfigFile resolves relative and absolute out", () => {
    const base = tmp();
    const absDir = tmp();
    const rel = parseConfigFile({ origin: "https://ex.com", out: "shots" }, base, matrix);
    assert.equal(rel.out, path.join(base, "shots"));
    const abs = parseConfigFile(
        { origin: "https://ex.com", out: absDir },
        base,
        matrix,
    );
    assert.equal(abs.out, absDir);
});

test("parseOrigin keeps http(s), strips hash and search", () => {
    const u = parseOrigin("https://ex.com/foo?x=1#h");
    assert.equal(u.protocol, "https:");
    assert.equal(u.pathname, "/foo");
    assert.equal(u.search, "");
    assert.equal(u.hash, "");
    assert.equal(parseOrigin("http://ex.com").protocol, "http:");
    assert.throws(() => parseOrigin("ftp://ex.com"), /origin must be http\(s\)/);
});

test("loadConfig reads file and missing file", () => {
    const dir = tmp();
    const file = path.join(dir, "config.json");
    fs.writeFileSync(
        file,
        JSON.stringify({
            origin: "https://ex.com",
            devices: ["desktop"],
            concurrency: 3,
            navTimeout: 1000,
            locale: "en-US",
        }),
    );
    const c = loadConfig(file, matrix);
    assert.equal(c.origin.origin, "https://ex.com");
    assert.equal(c.out, path.join(dir, ".out"));
    assert.equal(c.concurrency, 3);
    assert.equal(c.navTimeout, 1000);
    assert.equal(c.locale, "en-US");
    assert.throws(() => loadConfig(path.join(dir, "nope.json"), matrix), /config not found/);
});
