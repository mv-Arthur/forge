import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import {
    buildWalkView,
    DistrictUrlError,
    listDistrictOrgs,
    parseDistrictUrl,
    resolveDistrictUrl,
} from "@forge/district-orgs";
import { isCancelledError } from "./job-control.ts";
import { jobPercent } from "./job-progress.ts";
import type { JobArchive } from "./job-archive.ts";
import { JobStore, isFinished } from "./jobs.ts";
import type { Job } from "./jobs.ts";
import { MOSCOW_DISTRICTS } from "./moscow-districts.ts";

const MIME: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon",
};

export interface WebDeps {
    publicDir: string;
    jobs: JobStore;
    archive?: JobArchive;
    listDistrictOrgs?: typeof listDistrictOrgs;
    resolveDistrictUrl?: typeof resolveDistrictUrl;
}

export async function handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
    deps: WebDeps
): Promise<void> {
    const host = req.headers.host ?? "localhost";
    const url = new URL(req.url ?? "/", `http://${host}`);
    const method = req.method ?? "GET";

    if (method === "GET" && url.pathname === "/api/health") {
        json(res, 200, { ok: true });
        return;
    }
    if (method === "GET" && url.pathname === "/api/districts") {
        json(res, 200, MOSCOW_DISTRICTS);
        return;
    }
    if (method === "GET" && url.pathname === "/api/jobs") {
        json(res, 200, deps.archive ? await deps.archive.list() : []);
        return;
    }
    if (method === "POST" && url.pathname === "/api/jobs") {
        await createJob(req, res, deps);
        return;
    }
    const actionMatch = url.pathname.match(
        /^\/api\/jobs\/([^/]+)\/(pause|resume|cancel)$/
    );
    if (method === "POST" && actionMatch) {
        await controlJob(
            req,
            res,
            deps,
            decodeURIComponent(actionMatch[1] ?? ""),
            actionMatch[2] as "pause" | "resume" | "cancel"
        );
        return;
    }
    const streamMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/stream$/);
    if (method === "GET" && streamMatch) {
        streamJob(res, req, deps, decodeURIComponent(streamMatch[1] ?? ""));
        return;
    }
    const jobMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)$/);
    if (method === "GET" && jobMatch) {
        const id = decodeURIComponent(jobMatch[1] ?? "");
        const job =
            deps.jobs.get(id) ?? (deps.archive ? await deps.archive.read(id) : null);
        if (!job) {
            json(res, 404, { error: "Job not found" });
            return;
        }
        json(res, 200, job);
        return;
    }
    if (method === "GET") {
        await sendStatic(res, deps.publicDir, url.pathname);
        return;
    }
    json(res, 404, { error: "Not found" });
}

async function createJob(
    req: IncomingMessage,
    res: ServerResponse,
    deps: WebDeps
): Promise<void> {
    let body: { url?: string; districtId?: string } = {};
    try {
        const raw = await readBody(req);
        if (raw) body = JSON.parse(raw) as { url?: string; districtId?: string };
    } catch {
        json(res, 400, { error: "Invalid JSON" });
        return;
    }

    const pasted = (body.url ?? "").trim();
    const districtId = (body.districtId ?? "").trim();
    if (!pasted && !districtId) {
        json(res, 400, { error: "Paste a district URL or pick a district" });
        return;
    }
    if (pasted) {
        try {
            parseDistrictUrl(pasted);
        } catch (error) {
            const message =
                error instanceof DistrictUrlError
                    ? error.message
                    : "District URL is required";
            json(res, 400, { error: message });
            return;
        }
    } else if (!MOSCOW_DISTRICTS.some((row) => row.id === districtId)) {
        json(res, 400, { error: "Unknown district" });
        return;
    }

    const job = deps.jobs.create();
    reportProgress(deps, job.id, "start", { status: "running" });
    json(res, 202, job);
    void runLiveJob(job.id, { pasted, districtId }, deps);
}

async function runLiveJob(
    id: string,
    input: { pasted: string; districtId: string },
    deps: WebDeps
): Promise<void> {
    const list = deps.listDistrictOrgs ?? listDistrictOrgs;
    const resolve = deps.resolveDistrictUrl ?? resolveDistrictUrl;
    const control = deps.jobs.control(id);
    if (!control) return;
    try {
        let mapsUrl = input.pasted;
        if (!mapsUrl) {
            const row = MOSCOW_DISTRICTS.find(
                (district) => district.id === input.districtId
            );
            if (!row) {
                throw new Error("Unknown district");
            }
            reportProgress(deps, id, `lookup ${row.name}`);
            mapsUrl = await resolve(row.query, {
                fetch: control.fetch,
                signal: control.abort.signal,
            });
        }
        parseDistrictUrl(mapsUrl);
        const result = await list(mapsUrl, {
            query: "",
            limit: 5000,
            delayMs: 80,
            densify: true,
            fetch: control.fetch,
            signal: control.abort.signal,
            onProgress: (message) => {
                reportProgress(deps, id, message);
            },
        });
        if (stopped(deps, id, control)) return;
        const view = buildWalkView(result);
        if (stopped(deps, id, control)) return;
        reportProgress(deps, id, "done", { status: "done", view });
        const saved = deps.jobs.get(id);
        if (saved && deps.archive) await deps.archive.save(saved);
    } catch (error) {
        if (stopped(deps, id, control) || isCancelledError(error)) {
            deps.jobs.patch(id, {
                status: "cancelled",
                error: null,
                view: null,
            });
            return;
        }
        const message =
            error instanceof DistrictUrlError
                ? error.message
                : errorMessage(error);
        deps.jobs.patch(id, {
            status: "error",
            error: message,
        });
    }
}

function stopped(
    deps: WebDeps,
    id: string,
    control: { abort: AbortController }
): boolean {
    const job = deps.jobs.get(id);
    return job?.status === "cancelled" || control.abort.signal.aborted;
}

async function controlJob(
    req: IncomingMessage,
    res: ServerResponse,
    deps: WebDeps,
    id: string,
    action: "pause" | "resume" | "cancel"
): Promise<void> {
    await readBody(req);
    const job = deps.jobs.get(id);
    const control = deps.jobs.control(id);
    if (!job || !control) {
        json(res, 404, { error: "Job not found" });
        return;
    }
    if (action === "pause") {
        if (job.status !== "running" || !control.pause()) {
            json(res, 409, { error: "Job is not running" });
            return;
        }
        json(res, 200, deps.jobs.patch(id, { status: "paused" }));
        return;
    }
    if (action === "resume") {
        if (job.status !== "paused" || !control.resume()) {
            json(res, 409, { error: "Job is not paused" });
            return;
        }
        json(res, 200, deps.jobs.patch(id, { status: "running" }));
        return;
    }
    if (job.status !== "running" && job.status !== "paused") {
        json(res, 409, { error: "Job cannot be cancelled" });
        return;
    }
    control.cancel();
    json(
        res,
        200,
        deps.jobs.patch(id, { status: "cancelled", error: null, view: null })
    );
}

async function sendStatic(
    res: ServerResponse,
    publicDir: string,
    pathname: string
): Promise<void> {
    const relative =
        pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const filePath = path.resolve(publicDir, relative);
    const root = path.resolve(publicDir);
    if (!filePath.startsWith(root + path.sep) && filePath !== root) {
        json(res, 404, { error: "Not found" });
        return;
    }
    try {
        await access(filePath);
        const info = await stat(filePath);
        if (info.isFile()) {
            const type = MIME[path.extname(filePath)] ?? "application/octet-stream";
            res.writeHead(200, { "content-type": type });
            createReadStream(filePath).pipe(res);
            return;
        }
    } catch {
        /* SPA fallback below */
    }
    if (path.extname(relative) === "") {
        const indexPath = path.join(root, "index.html");
        try {
            await access(indexPath);
            res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
            createReadStream(indexPath).pipe(res);
            return;
        } catch {
            /* fall through */
        }
    }
    json(res, 404, { error: "Not found" });
}

function reportProgress(
    deps: WebDeps,
    id: string,
    progress: string,
    extra: Partial<Job> = {}
): void {
    deps.jobs.patch(id, {
        progress,
        percent: jobPercent(progress),
        ...extra,
    });
}

function streamJob(
    res: ServerResponse,
    req: IncomingMessage,
    deps: WebDeps,
    id: string
): void {
    const job = deps.jobs.get(id);
    if (!job) {
        json(res, 404, { error: "Job not found" });
        return;
    }
    res.writeHead(200, {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-transform",
        connection: "keep-alive",
        "x-accel-buffering": "no",
    });
    const send = (current: Job) => {
        res.write(`data: ${JSON.stringify(current)}\n\n`);
    };
    send(job);
    if (isFinished(job.status)) {
        res.end();
        return;
    }
    const unsub = deps.jobs.subscribe(id, (current) => {
        send(current);
        if (isFinished(current.status)) {
            unsub();
            res.end();
        }
    });
    req.on("close", unsub);
}

function json(res: ServerResponse, status: number, body: unknown): void {
    const payload = JSON.stringify(body);
    res.writeHead(status, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
    });
    res.end(payload);
}

function readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        req.on("error", reject);
    });
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
