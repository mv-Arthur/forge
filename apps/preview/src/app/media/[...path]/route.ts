import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const ROOT = path.resolve(process.cwd(), "data/fixtures/media");

const TYPES: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
};

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const { path: segments } = await params;
    if (segments.length === 0) {
        return new NextResponse(null, { status: 404 });
    }
    const abs = path.resolve(ROOT, ...segments);
    const rel = path.relative(ROOT, abs);
    if (rel.startsWith("..") || path.isAbsolute(rel)) {
        return new NextResponse(null, { status: 404 });
    }
    try {
        const buf = await readFile(abs);
        const ext = path.extname(abs).toLowerCase();
        return new NextResponse(buf, {
            headers: {
                "Content-Type": TYPES[ext] ?? "application/octet-stream",
                "Cache-Control": "public, max-age=0, must-revalidate",
            },
        });
    } catch {
        return new NextResponse(null, { status: 404 });
    }
}
