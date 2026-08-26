import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { dropIfDuplicatePng, isBlankPng, isNearDuplicatePair } from "./blank-png.js";

function writePng(abs: string, w: number, h: number, extra: number): void {
    const buf = Buffer.alloc(24 + extra);
    buf.write("\u0089PNG\r\n\u001a\n", 0, "binary");
    buf.writeUInt32BE(w, 16);
    buf.writeUInt32BE(h, 20);
    fs.writeFileSync(abs, buf);
}

function crc32(buf: Buffer): number {
    let c = ~0;
    for (let i = 0; i < buf.length; i++) {
        c ^= buf[i];
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    return ~c >>> 0;
}

function chunk(typ: string, data: Buffer): Buffer {
    const head = Buffer.alloc(8);
    head.writeUInt32BE(data.length, 0);
    head.write(typ, 4);
    const crcBuf = Buffer.concat([Buffer.from(typ), data]);
    const tail = Buffer.alloc(4);
    tail.writeUInt32BE(crc32(crcBuf), 0);
    return Buffer.concat([head, data, tail]);
}

function rgbPng(abs: string, w: number, h: number, px: (x: number, y: number) => [number, number, number]): void {
    const stride = w * 3;
    const raw = Buffer.alloc((stride + 1) * h);
    for (let y = 0; y < h; y++) {
        raw[y * (stride + 1)] = 0;
        for (let x = 0; x < w; x++) {
            const [r, g, b] = px(x, y);
            const i = y * (stride + 1) + 1 + x * 3;
            raw[i] = r;
            raw[i + 1] = g;
            raw[i + 2] = b;
        }
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr[8] = 8;
    ihdr[9] = 2;
    const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const out = Buffer.concat([
        sig,
        chunk("IHDR", ihdr),
        chunk("IDAT", zlib.deflateSync(raw)),
        chunk("IEND", Buffer.alloc(0)),
    ]);
    fs.writeFileSync(abs, out);
}

test("isBlankPng: 3081B 600x822 is blank, 35k 636x571 is not", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-blank-"));
    const white = path.join(dir, "white.png");
    const real = path.join(dir, "real.png");
    writePng(white, 600, 822, 3081 - 24);
    writePng(real, 636, 571, 35875 - 24);
    assert.equal(isBlankPng(white), true);
    assert.equal(isBlankPng(real), false);
});

test("isBlankPng: solid white is blank, 5% black text is not", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-luma-"));
    const solid = path.join(dir, "solid.png");
    const text = path.join(dir, "text.png");
    rgbPng(solid, 40, 20, () => [255, 255, 255]);
    rgbPng(text, 40, 20, (x, y) => (y < 2 ? [0, 0, 0] : [255, 255, 255]));
    assert.equal(isBlankPng(solid), true);
    assert.equal(isBlankPng(text), false);
});

test("dropIfDuplicatePng unlinks the second copy", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-dup-"));
    const a = path.join(dir, "a.png");
    const b = path.join(dir, "b.png");
    rgbPng(a, 8, 8, () => [10, 20, 30]);
    fs.copyFileSync(a, b);
    assert.equal(dropIfDuplicatePng(b), true);
    assert.equal(fs.existsSync(b), false);
    assert.equal(fs.existsSync(a), true);
    assert.equal(dropIfDuplicatePng(a), false);
});

test("isNearDuplicatePair: 1px jitter same picture, not two different pictures", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-near-"));
    const a = path.join(dir, "a.png");
    const b = path.join(dir, "b.png");
    const c = path.join(dir, "c.png");
    rgbPng(a, 20, 20, (x, y) => [x * 10, y * 10, 40]);
    rgbPng(b, 20, 21, (x, y) => [x * 10, Math.min(y, 19) * 10, 40]);
    rgbPng(c, 20, 20, (x, y) => [255 - x * 10, 255 - y * 10, 200]);
    assert.equal(isNearDuplicatePair(a, b), true);
    assert.equal(isNearDuplicatePair(a, c), false);
    assert.equal(fs.existsSync(a) && fs.existsSync(c), true);
});
