import fs from "fs";
import path from "path";
import type { CaptureConfig } from "../index.js";

export type CaptureStatus = "pending" | "ok" | "skipped";

export type CaptureRow = {
    url: string;
    normalizedUrl: string;
    slug: string;
    file: string;
    fullPage: boolean;
    deviceId: string;
    viewport: { width: number; height: number };
    status: CaptureStatus;
    httpStatus: number | null;
    scrollHeight: number | null;
    bytes: number | null;
    skipped: boolean;
    reason: string | null;
    capturedAt: string | null;
    index: number;
    title?: string;
};

type Manifest = {
    site: string;
    generatedAt: string;
    final: boolean;
    devices: string[];
    viewport: { width: number; height: number };
    fullPage: boolean;
    discoveredCount: number;
    capturedCount: number;
    skippedCount: number;
    uniqueOkCount: number;
    captures: CaptureRow[];
};

/** Записать в out `manifest.json`. */
export function writeManifest(
    results: CaptureRow[],
    discovered: number,
    final: boolean,
    config: CaptureConfig,
): void {
    const ok = results.filter((r) => r.status === "ok");
    const skipped = results.filter((r) => r.status === "skipped");
    const byKey = new Map<string, CaptureRow>();
    for (const r of ok) {
        const key = `${r.url}\t${r.deviceId}`;
        if (!byKey.has(key)) byKey.set(key, r);
    }
    const first = config.devices[0];
    const manifest: Manifest = {
        site: config.origin.origin,
        generatedAt: new Date().toISOString(),
        final,
        devices: config.devices.map((d) => d.id),
        viewport: { width: first.width, height: first.height },
        fullPage: true,
        discoveredCount: discovered,
        capturedCount: ok.length,
        skippedCount: skipped.length,
        uniqueOkCount: byKey.size,
        captures: results.sort((a, b) => a.index - b.index),
    };
    fs.writeFileSync(
        path.join(config.out, "manifest.json"),
        JSON.stringify(manifest, null, 2),
    );
}
