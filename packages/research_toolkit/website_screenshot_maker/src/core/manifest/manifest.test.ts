import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { CaptureConfig } from "../index.js";
import { writeManifest, type CaptureRow } from "./index.js";

const desktop = {
    id: "desktop",
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    isMobile: false,
};
const mobile = {
    id: "mobile",
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    isMobile: true,
};

function row(partial: Partial<CaptureRow> & Pick<CaptureRow, "index" | "status">): CaptureRow {
    return {
        url: "https://ex.com/a",
        normalizedUrl: "https://ex.com/a",
        slug: "a",
        file: "pages/desktop/a.png",
        fullPage: true,
        deviceId: "desktop",
        viewport: { width: 1440, height: 900 },
        httpStatus: 200,
        scrollHeight: 100,
        bytes: 10,
        skipped: partial.status === "skipped",
        reason: null,
        capturedAt: null,
        ...partial,
    };
}

test("writeManifest counts, dedups and sorts", () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-mf-"));
    const config: CaptureConfig = {
        origin: new URL("https://ex.com"),
        out,
        devices: [desktop, mobile],
        concurrency: 2,
        tabsPerBrowser: 1,
        navTimeout: 1000,
        locale: "ru-RU",
    };
    writeManifest(
        [
            row({ index: 2, status: "ok", url: "https://ex.com/a", deviceId: "desktop" }),
            row({ index: 0, status: "skipped", url: "https://ex.com/b", reason: "http_404" }),
            row({ index: 1, status: "ok", url: "https://ex.com/a", deviceId: "desktop" }),
            row({ index: 3, status: "ok", url: "https://ex.com/a", deviceId: "mobile" }),
        ],
        10,
        true,
        config,
    );
    const m = JSON.parse(fs.readFileSync(path.join(out, "manifest.json"), "utf8"));
    assert.equal(m.site, "https://ex.com");
    assert.equal(m.final, true);
    assert.equal(m.discoveredCount, 10);
    assert.equal(m.capturedCount, 3);
    assert.equal(m.skippedCount, 1);
    assert.equal(m.uniqueOkCount, 2);
    assert.deepEqual(m.devices, ["desktop", "mobile"]);
    assert.deepEqual(m.viewport, { width: 1440, height: 900 });
    assert.deepEqual(m.captures.map((c: { index: number }) => c.index), [0, 1, 2, 3]);
});
