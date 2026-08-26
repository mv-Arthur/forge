import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import zlib from "zlib";

const MIN_BPP = 0.03;
const WHITE_FRAC = 0.99;
const WHITE_LUMA = 245;

function paeth(a: number, b: number, c: number): number {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
}

function whiteFrac(buf: Buffer): number | null {
    if (buf.length < 24 || buf[0] !== 0x89) return null;
    let pos = 8;
    const idat: Buffer[] = [];
    let w = 0;
    let h = 0;
    let bit = 0;
    let color = 0;
    let inter = 0;
    while (pos + 8 <= buf.length) {
        const ln = buf.readUInt32BE(pos);
        const typ = buf.toString("ascii", pos + 4, pos + 8);
        const chunk = buf.subarray(pos + 8, pos + 8 + ln);
        pos += 12 + ln;
        if (typ === "IHDR") {
            w = chunk.readUInt32BE(0);
            h = chunk.readUInt32BE(4);
            bit = chunk[8];
            color = chunk[9];
            inter = chunk[12];
        } else if (typ === "IDAT") {
            idat.push(chunk);
        } else if (typ === "IEND") {
            break;
        }
    }
    if (w <= 0 || h <= 0 || bit !== 8 || inter !== 0) return null;
    const bpp = color === 6 ? 4 : color === 2 ? 3 : color === 0 ? 1 : 0;
    if (bpp === 0) return null;
    let raw: Buffer;
    try {
        raw = zlib.inflateSync(Buffer.concat(idat));
    } catch {
        return null;
    }
    const stride = w * bpp;
    const rowBytes = stride + 1;
    if (raw.length < rowBytes * h) return null;
    let prev = Buffer.alloc(stride);
    let white = 0;
    let n = 0;
    for (let y = 0; y < h; y++) {
        const f = raw[y * rowBytes];
        const row = Buffer.from(raw.subarray(y * rowBytes + 1, y * rowBytes + 1 + stride));
        if (f === 1) {
            for (let x = 0; x < stride; x++) {
                row[x] = (row[x] + (x >= bpp ? row[x - bpp] : 0)) & 255;
            }
        } else if (f === 2) {
            for (let x = 0; x < stride; x++) {
                row[x] = (row[x] + prev[x]) & 255;
            }
        } else if (f === 3) {
            for (let x = 0; x < stride; x++) {
                const a = x >= bpp ? row[x - bpp] : 0;
                row[x] = (row[x] + ((a + prev[x]) >> 1)) & 255;
            }
        } else if (f === 4) {
            for (let x = 0; x < stride; x++) {
                const a = x >= bpp ? row[x - bpp] : 0;
                const b = prev[x];
                const c = x >= bpp ? prev[x - bpp] : 0;
                row[x] = (row[x] + paeth(a, b, c)) & 255;
            }
        } else if (f !== 0) {
            return null;
        }
        prev = Buffer.from(row);
        if (color === 6) {
            for (let x = 0; x < stride; x += 4) {
                const yv = (row[x] + row[x + 1] + row[x + 2]) / 3;
                n++;
                if (yv >= WHITE_LUMA && row[x + 3] >= 200) white++;
            }
        } else if (color === 2) {
            for (let x = 0; x < stride; x += 3) {
                const yv = (row[x] + row[x + 1] + row[x + 2]) / 3;
                n++;
                if (yv >= WHITE_LUMA) white++;
            }
        } else {
            for (let x = 0; x < stride; x++) {
                n++;
                if (row[x] >= WHITE_LUMA) white++;
            }
        }
    }
    return n > 0 ? white / n : null;
}

export function isBlankPng(abs: string): boolean {
    if (!fs.existsSync(abs)) return true;
    const bytes = fs.statSync(abs).size;
    const buf = fs.readFileSync(abs);
    if (buf.length < 24) return true;
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    const area = Math.max(1, w * h);
    if (bytes / area < MIN_BPP) return true;
    const frac = whiteFrac(buf);
    if (frac != null && frac >= WHITE_FRAC) return true;
    return false;
}

export function dropIfDuplicatePng(abs: string): boolean {
    if (!fs.existsSync(abs)) return true;
    const dir = path.dirname(abs);
    const base = path.basename(abs);
    const buf = fs.readFileSync(abs);
    const h = createHash("md5").update(buf).digest("hex");
    for (const n of fs.readdirSync(dir)) {
        if (n === base || !n.endsWith(".png")) continue;
        const other = fs.readFileSync(path.join(dir, n));
        if (other.length !== buf.length) continue;
        if (createHash("md5").update(other).digest("hex") === h) {
            try {
                fs.unlinkSync(abs);
            } catch {
                /* */
            }
            return true;
        }
    }
    return false;
}

type RgbImg = { w: number; h: number; rgb: Buffer };

function decodeRgb(buf: Buffer): RgbImg | null {
    if (buf.length < 24 || buf[0] !== 0x89) return null;
    let pos = 8;
    const idat: Buffer[] = [];
    let w = 0;
    let h = 0;
    let bit = 0;
    let color = 0;
    let inter = 0;
    while (pos + 8 <= buf.length) {
        const ln = buf.readUInt32BE(pos);
        const typ = buf.toString("ascii", pos + 4, pos + 8);
        const chunk = buf.subarray(pos + 8, pos + 8 + ln);
        pos += 12 + ln;
        if (typ === "IHDR") {
            w = chunk.readUInt32BE(0);
            h = chunk.readUInt32BE(4);
            bit = chunk[8];
            color = chunk[9];
            inter = chunk[12];
        } else if (typ === "IDAT") {
            idat.push(chunk);
        } else if (typ === "IEND") {
            break;
        }
    }
    if (w <= 0 || h <= 0 || bit !== 8 || inter !== 0) return null;
    const bpp = color === 6 ? 4 : color === 2 ? 3 : color === 0 ? 1 : 0;
    if (bpp === 0) return null;
    let raw: Buffer;
    try {
        raw = zlib.inflateSync(Buffer.concat(idat));
    } catch {
        return null;
    }
    const stride = w * bpp;
    const rowBytes = stride + 1;
    if (raw.length < rowBytes * h) return null;
    const rgb = Buffer.alloc(w * h * 3);
    let prev = Buffer.alloc(stride);
    for (let y = 0; y < h; y++) {
        const f = raw[y * rowBytes];
        const row = Buffer.from(raw.subarray(y * rowBytes + 1, y * rowBytes + 1 + stride));
        if (f === 1) {
            for (let x = 0; x < stride; x++) {
                row[x] = (row[x] + (x >= bpp ? row[x - bpp] : 0)) & 255;
            }
        } else if (f === 2) {
            for (let x = 0; x < stride; x++) {
                row[x] = (row[x] + prev[x]) & 255;
            }
        } else if (f === 3) {
            for (let x = 0; x < stride; x++) {
                const a = x >= bpp ? row[x - bpp] : 0;
                row[x] = (row[x] + ((a + prev[x]) >> 1)) & 255;
            }
        } else if (f === 4) {
            for (let x = 0; x < stride; x++) {
                const a = x >= bpp ? row[x - bpp] : 0;
                const b = prev[x];
                const c = x >= bpp ? prev[x - bpp] : 0;
                row[x] = (row[x] + paeth(a, b, c)) & 255;
            }
        } else if (f !== 0) {
            return null;
        }
        prev = Buffer.from(row);
        for (let x = 0; x < w; x++) {
            const o = (y * w + x) * 3;
            if (color === 6 || color === 2) {
                const i = x * bpp;
                rgb[o] = row[i];
                rgb[o + 1] = row[i + 1];
                rgb[o + 2] = row[i + 2];
            } else {
                rgb[o] = rgb[o + 1] = rgb[o + 2] = row[x];
            }
        }
    }
    return { w, h, rgb };
}

function pixelDist(a: RgbImg, b: RgbImg): number {
    const w = Math.min(a.w, b.w);
    const h = Math.min(a.h, b.h);
    if (w <= 0 || h <= 0) return 1;
    let s = 0;
    const n = w * h * 3;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const ia = (y * a.w + x) * 3;
            const ib = (y * b.w + x) * 3;
            s += Math.abs(a.rgb[ia] - b.rgb[ib]);
            s += Math.abs(a.rgb[ia + 1] - b.rgb[ib + 1]);
            s += Math.abs(a.rgb[ia + 2] - b.rgb[ib + 2]);
        }
    }
    return s / (n * 255);
}

export function isNearDuplicatePair(aPath: string, bPath: string): boolean {
    if (!fs.existsSync(aPath) || !fs.existsSync(bPath)) return false;
    const a = decodeRgb(fs.readFileSync(aPath));
    const b = decodeRgb(fs.readFileSync(bPath));
    if (!a || !b) return false;
    if (Math.abs(a.w - b.w) > 4 || Math.abs(a.h - b.h) > 4) return false;
    return pixelDist(a, b) < 0.03;
}
