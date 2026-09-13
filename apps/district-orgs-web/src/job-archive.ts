import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Job } from "./jobs.ts";
import type { JobSummary } from "./job-summary.ts";

const INDEX = "index.json";
const MAX_JOBS = 40;
const ID_OK = /^[a-zA-Z0-9_-]+$/;

export class JobArchive {
    private readonly dir: string;

    constructor(dir: string) {
        this.dir = dir;
    }

    async list(): Promise<JobSummary[]> {
        return this.readIndex();
    }

    async read(id: string): Promise<Job | null> {
        if (!ID_OK.test(id)) return null;
        try {
            const raw = await readFile(this.jobPath(id), "utf8");
            const job = JSON.parse(raw) as Job;
            if (!job || job.id !== id) return null;
            return job;
        } catch {
            return null;
        }
    }

    async save(job: Job): Promise<JobSummary | null> {
        if (job.status !== "done" || !job.view) return null;
        await mkdir(this.dir, { recursive: true });
        const finishedAt = new Date().toISOString();
        const stored: Job = { ...job, status: "done" };
        await writeJson(this.jobPath(job.id), stored);
        const summary: JobSummary = {
            id: job.id,
            title: job.view.district.title,
            count: job.view.count,
            sheets: job.view.sheets.length,
            createdAt: job.createdAt,
            finishedAt,
        };
        const previous = await this.readIndex();
        const rows = [
            summary,
            ...previous.filter((row) => row.id !== job.id),
        ].slice(0, MAX_JOBS);
        const keep = new Set(rows.map((row) => row.id));
        const dropped = previous.filter((row) => !keep.has(row.id));
        await writeJson(this.indexPath(), rows);
        await Promise.all(
            dropped.map((row) => unlink(this.jobPath(row.id)).catch(() => undefined))
        );
        return summary;
    }

    private async readIndex(): Promise<JobSummary[]> {
        try {
            const raw = await readFile(this.indexPath(), "utf8");
            const rows = JSON.parse(raw) as JobSummary[];
            return Array.isArray(rows) ? rows : [];
        } catch {
            return [];
        }
    }

    private indexPath(): string {
        return path.join(this.dir, INDEX);
    }

    private jobPath(id: string): string {
        return path.join(this.dir, `${id}.json`);
    }
}

async function writeJson(file: string, data: unknown): Promise<void> {
    const tmp = `${file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(data), "utf8");
    await rename(tmp, file);
}
