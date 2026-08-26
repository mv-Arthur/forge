import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { writeCopy } from "./dump.js";
import type { CopyDump } from "./types.js";

test("writeCopy round-trip", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-copy-"));
    const dump: CopyDump = {
        site: "https://ex.test",
        generatedAt: "2026-01-01T00:00:00.000Z",
        deviceId: "desktop",
        pages: [
            {
                url: "https://ex.test/",
                slug: "home",
                templateId: "/",
                title: "Home",
                status: "ok",
                reason: null,
                blocks: [
                    {
                        role: "h1",
                        text: "Готовые проекты",
                        slot: "hero",
                        selector: "[data-wsm-copy=\"0\"]",
                        nearbyHeading: null,
                        href: null,
                        source: "visible",
                    },
                ],
            },
        ],
    };
    const file = writeCopy(dump, dir);
    assert.equal(path.basename(file), "copy.json");
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as CopyDump;
    assert.equal(parsed.pages[0].blocks[0].role, "h1");
    assert.equal(parsed.deviceId, "desktop");
});
