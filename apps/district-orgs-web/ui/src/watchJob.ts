export type JobSnapshot = {
    id: string;
    status: string;
    progress?: string;
    percent?: number | null;
    error?: string | null;
    view?: unknown;
};

export async function fetchJob(id: string): Promise<JobSnapshot> {
    const response = await fetch(`/api/jobs/${encodeURIComponent(id)}`);
    const job = (await response.json()) as JobSnapshot;
    if (!response.ok) throw new Error(job.error || response.statusText);
    return job;
}

export async function watchJob(
    id: string,
    onJob: (job: JobSnapshot) => void,
    signal?: AbortSignal
): Promise<JobSnapshot> {
    if (signal?.aborted) throw abortError();
    try {
        return await watchStream(id, onJob, signal);
    } catch (error) {
        if (isAbort(error) || signal?.aborted) throw abortError();
        return watchPoll(id, onJob, signal);
    }
}

function watchStream(
    id: string,
    onJob: (job: JobSnapshot) => void,
    signal?: AbortSignal
): Promise<JobSnapshot> {
    return new Promise((resolve, reject) => {
        const source = new EventSource(
            `/api/jobs/${encodeURIComponent(id)}/stream`
        );
        let last: JobSnapshot | null = null;
        let settled = false;
        const finish = (fn: () => void) => {
            if (settled) return;
            settled = true;
            signal?.removeEventListener("abort", onAbort);
            source.close();
            fn();
        };
        const onAbort = () => finish(() => reject(abortError()));
        signal?.addEventListener("abort", onAbort);
        if (signal?.aborted) {
            onAbort();
            return;
        }
        source.onmessage = (event) => {
            last = JSON.parse(event.data) as JobSnapshot;
            onJob(last);
            if (last.status === "done" || last.status === "cancelled") {
                finish(() => resolve(last as JobSnapshot));
            } else if (last.status === "error") {
                finish(() => reject(new Error(last?.error || "Не собралось")));
            }
        };
        source.onerror = () => {
            finish(() => {
                if (last?.status === "done" || last?.status === "cancelled") {
                    resolve(last);
                } else if (last?.status === "error") {
                    reject(new Error(last.error || "Не собралось"));
                } else reject(new Error("sse"));
            });
        };
    });
}

async function watchPoll(
    id: string,
    onJob: (job: JobSnapshot) => void,
    signal?: AbortSignal
): Promise<JobSnapshot> {
    for (;;) {
        if (signal?.aborted) throw abortError();
        const job = await fetchJob(id);
        onJob(job);
        if (job.status === "done" || job.status === "cancelled") return job;
        if (job.status === "error") {
            throw new Error(job.error || "Не собралось");
        }
        await wait(400, signal);
    }
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(abortError());
            return;
        }
        const timer = setTimeout(resolve, ms);
        signal?.addEventListener(
            "abort",
            () => {
                clearTimeout(timer);
                reject(abortError());
            },
            { once: true }
        );
    });
}

function abortError(): Error {
    return new DOMException("aborted", "AbortError");
}

export function isAbort(error: unknown): boolean {
    return error instanceof DOMException
        ? error.name === "AbortError"
        : error instanceof Error && error.name === "AbortError";
}
