import type { WalkView } from "@forge/district-orgs";
import { JobControl } from "./job-control.ts";

export type JobStatus =
    | "queued"
    | "running"
    | "paused"
    | "done"
    | "error"
    | "cancelled";

export interface Job {
    id: string;
    status: JobStatus;
    progress: string;
    percent: number | null;
    error: string | null;
    createdAt: string;
    view: WalkView | null;
}

export function isFinished(status: JobStatus): boolean {
    return status === "done" || status === "error" || status === "cancelled";
}

export class JobStore {
    private readonly jobs = new Map<string, Job>();
    private readonly controls = new Map<string, JobControl>();
    private readonly listeners = new Map<string, Set<(job: Job) => void>>();
    private readonly createId: () => string;

    constructor(createId: () => string = () => crypto.randomUUID()) {
        this.createId = createId;
    }

    create(): Job {
        const job: Job = {
            id: this.createId(),
            status: "queued",
            progress: "",
            percent: null,
            error: null,
            createdAt: new Date().toISOString(),
            view: null,
        };
        this.jobs.set(job.id, job);
        this.controls.set(job.id, new JobControl());
        return job;
    }

    get(id: string): Job | undefined {
        return this.jobs.get(id);
    }

    control(id: string): JobControl | undefined {
        return this.controls.get(id);
    }

    patch(id: string, patch: Partial<Job>): Job | undefined {
        const job = this.jobs.get(id);
        if (!job) return undefined;
        Object.assign(job, patch);
        for (const listener of this.listeners.get(id) ?? []) {
            listener(job);
        }
        return job;
    }

    subscribe(id: string, listener: (job: Job) => void): () => void {
        let set = this.listeners.get(id);
        if (!set) {
            set = new Set();
            this.listeners.set(id, set);
        }
        set.add(listener);
        return () => {
            set.delete(listener);
            if (set.size === 0) this.listeners.delete(id);
        };
    }
}
