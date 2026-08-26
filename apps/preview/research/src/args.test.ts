import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCliArgs } from "./args.ts";

test('["atlas"] → atlas + default config', () => {
    assert.deepEqual(parseCliArgs(["atlas"]), {
        mode: "atlas",
        configPath: "",
    });
});

test('["atlas","./x.json"] → atlas x.json', () => {
    assert.deepEqual(parseCliArgs(["atlas", "./x.json"]), {
        mode: "atlas",
        configPath: "./x.json",
    });
});

test('["copy"] → copy + default config', () => {
    assert.deepEqual(parseCliArgs(["copy"]), {
        mode: "copy",
        configPath: "",
    });
});

test('["copy","./x.json"] → copy x.json', () => {
    assert.deepEqual(parseCliArgs(["copy", "./x.json"]), {
        mode: "copy",
        configPath: "./x.json",
    });
});

test('["./x.json"] and [] → capture', () => {
    assert.deepEqual(parseCliArgs(["./x.json"]), {
        mode: "capture",
        configPath: "./x.json",
    });
    assert.deepEqual(parseCliArgs([]), { mode: "capture", configPath: "" });
});
