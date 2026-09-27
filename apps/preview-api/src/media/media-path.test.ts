import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import {
    folderFromKey,
    keyFrom,
    mimeFromExt,
    nextFilename,
    publicUrl,
    resolveInside,
    sanitizeFilename,
    sanitizeFolder,
} from "./media-path.ts";

describe("sanitizeFolder", () => {
    it("keeps nested path and drops traversal", () => {
        assert.equal(
            sanitizeFolder("../Detail/Favor//Hero"),
            "detail/favor/hero"
        );
    });
});

describe("sanitizeFilename", () => {
    it("keeps extension and strips junk", () => {
        assert.equal(sanitizeFilename("Hero 1.JPG"), "hero-1.jpg");
    });

    it("rejects unknown extension", () => {
        assert.throws(() => sanitizeFilename("notes.txt"), /расширение/);
    });
});

describe("keys", () => {
    it("builds preview url", () => {
        assert.equal(keyFrom("lead", "office.jpg"), "lead/office.jpg");
        assert.equal(folderFromKey("lead/office.jpg"), "lead");
        assert.equal(folderFromKey("office.jpg"), null);
        assert.equal(publicUrl("lead/office.jpg"), "/media/lead/office.jpg");
    });
});

describe("resolveInside", () => {
    it("resolves a relative key", () => {
        const root = path.join(os.tmpdir(), "preview-media");
        const abs = resolveInside(root, "lead/office.jpg");
        assert.equal(abs, path.resolve(root, "lead/office.jpg"));
    });

    it("rejects parent segments", () => {
        const root = path.join(os.tmpdir(), "preview-media");
        assert.throws(() => resolveInside(root, "../secret.jpg"));
    });
});

describe("mime and unique names", () => {
    it("maps common types", () => {
        assert.equal(mimeFromExt("a.jpg"), "image/jpeg");
        assert.equal(mimeFromExt("a.mp4"), "video/mp4");
        assert.equal(mimeFromExt("a.svg"), "image/svg+xml");
    });

    it("suffixes collisions from 2", () => {
        assert.equal(nextFilename("hero.jpg", 1), "hero.jpg");
        assert.equal(nextFilename("hero.jpg", 2), "hero-2.jpg");
    });
});
