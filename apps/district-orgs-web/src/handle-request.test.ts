import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:http";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import type { DistrictOrgsResult } from "@forge/district-orgs";
import { JobArchive } from "./job-archive.ts";
import { handleRequest } from "./handle-request.ts";
import type { WebDeps } from "./handle-request.ts";
import { JobStore } from "./jobs.ts";

const PUBLIC = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../public"
);

const DUMP: DistrictOrgsResult = {
    district: {
        geoId: "53211689",
        title: "район Бибирево",
        slug: "rayon_bibirevo",
        cityId: "213",
        citySlug: "moscow",
        address: null,
        coordinates: { lon: 37.6, lat: 55.9 },
        bounds: [
            [37.58, 55.88],
            [37.65, 55.92],
        ],
        origin: "https://yandex.ru",
        url: "https://yandex.ru/maps/",
    },
    query: "",
    totalEstimate: 1,
    count: 1,
    organizations: [
        {
            id: "1",
            title: "Кафе внутри",
            address: "ул. Лескова, 1",
            fullAddress: null,
            categories: ["Кафе"],
            phones: [],
            websites: [],
            rating: null,
            reviewCount: null,
            coordinates: { lon: 37.6, lat: 55.9 },
            url: null,
            workingTimeText: null,
            isOpenNow: null,
        },
    ],
};

async function withServer(
    deps: WebDeps,
    fn: (base: string) => Promise<void>
): Promise<void> {
    const server = createServer((req, res) => {
        void handleRequest(req, res, deps);
    });
    await new Promise<void>((resolve) => {
        server.listen({ port: 0, host: "127.0.0.1" }, resolve);
    });
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;
    try {
        await fn(`http://127.0.0.1:${port}`);
    } finally {
        await new Promise<void>((resolve) => {
            server.close(() => resolve());
        });
    }
}

describe("handleRequest", () => {
    it("serves health", async () => {
        await withServer(
            {
                publicDir: PUBLIC,
                jobs: new JobStore(),
            },
            async (base) => {
                const health = await fetch(`${base}/api/health`);
                assert.equal(health.status, 200);
                assert.deepEqual(await health.json(), { ok: true });
            }
        );
    });

    it("lists Moscow districts for the select", async () => {
        await withServer(
            {
                publicDir: PUBLIC,
                jobs: new JobStore(),
            },
            async (base) => {
                const response = await fetch(`${base}/api/districts`);
                assert.equal(response.status, 200);
                const rows = await response.json();
                assert.ok(rows.length > 100);
                assert.equal(
                    rows.some((row: { name: string }) => row.name === "Арбат"),
                    true
                );
                assert.equal(
                    rows.filter((row: { name: string }) => row.name === "Бибирево")
                        .length,
                    1
                );
            }
        );
    });

    it("rejects a job without url or district", async () => {
        await withServer(
            {
                publicDir: PUBLIC,
                jobs: new JobStore(),
            },
            async (base) => {
                const response = await fetch(`${base}/api/jobs`, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({}),
                });
                assert.equal(response.status, 400);
            }
        );
    });

    it("rejects a bad district URL", async () => {
        await withServer(
            {
                publicDir: PUBLIC,
                jobs: new JobStore(),
            },
            async (base) => {
                const response = await fetch(`${base}/api/jobs`, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ url: "https://example.com/" }),
                });
                assert.equal(response.status, 400);
            }
        );
    });

    it("starts a job from a selected Moscow district", async () => {
        const jobs = new JobStore(() => "job-2");
        let listed = "";
        await withServer(
            {
                publicDir: PUBLIC,
                jobs,
                resolveDistrictUrl: async () =>
                    "https://yandex.ru/maps/?ol=geo&oid=53000001",
                listDistrictOrgs: async (url) => {
                    listed = url;
                    return DUMP;
                },
            },
            async (base) => {
                const created = await fetch(`${base}/api/jobs`, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ districtId: "цао-арбат" }),
                });
                assert.equal(created.status, 202);
                for (let i = 0; i < 20; i += 1) {
                    const current = await fetch(`${base}/api/jobs/job-2`).then(
                        (res) => res.json()
                    );
                    if (current.status === "done") {
                        assert.equal(
                            listed,
                            "https://yandex.ru/maps/?ol=geo&oid=53000001"
                        );
                        return;
                    }
                    if (current.status === "error") {
                        assert.fail(current.error);
                    }
                    await new Promise((resolve) => setTimeout(resolve, 20));
                }
                assert.fail("job did not finish");
            }
        );
    });

    it("runs a live job through the injected Maps client", async () => {
        const jobs = new JobStore(() => "job-1");
        await withServer(
            {
                publicDir: PUBLIC,
                jobs,
                listDistrictOrgs: async () => DUMP,
            },
            async (base) => {
                const created = await fetch(`${base}/api/jobs`, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        url: "https://yandex.ru/maps/213/moscow/geo/rayon_bibirevo/53211689/",
                    }),
                });
                assert.equal(created.status, 202);
                const job = await created.json();
                assert.equal(job.id, "job-1");
                for (let i = 0; i < 20; i += 1) {
                    const current = await fetch(`${base}/api/jobs/job-1`).then(
                        (res) => res.json()
                    );
                    if (current.status === "done") {
                        assert.equal(current.view.count, 1);
                        return;
                    }
                    await new Promise((resolve) => setTimeout(resolve, 20));
                }
                assert.fail("job did not finish");
            }
        );
    });

    it("archives a finished job and lists it without the view", async () => {
        const dir = await mkdtemp(path.join(os.tmpdir(), "jobs-web-"));
        const jobs = new JobStore(() => "job-hist");
        try {
            await withServer(
                {
                    publicDir: PUBLIC,
                    jobs,
                    archive: new JobArchive(dir),
                    listDistrictOrgs: async () => DUMP,
                },
                async (base) => {
                    const created = await fetch(`${base}/api/jobs`, {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                            url: "https://yandex.ru/maps/213/moscow/geo/rayon_bibirevo/53211689/",
                        }),
                    });
                    assert.equal(created.status, 202);
                    let rows: { id: string; title: string; view?: unknown }[] =
                        [];
                    for (let i = 0; i < 30; i += 1) {
                        rows = await fetch(`${base}/api/jobs`).then((res) =>
                            res.json()
                        );
                        if (rows.length === 1) break;
                        await new Promise((resolve) => setTimeout(resolve, 20));
                    }
                    assert.equal(rows.length, 1);
                    assert.equal(rows[0].id, "job-hist");
                    assert.equal(rows[0].title, "район Бибирево");
                    assert.equal(rows[0].view, undefined);
                    const stored = await fetch(`${base}/api/jobs/job-hist`).then(
                        (res) => res.json()
                    );
                    assert.equal(stored.view.count, 1);
                }
            );
        } finally {
            await rm(dir, { recursive: true, force: true });
        }
    });

    it("streams job progress over SSE", async () => {
        const jobs = new JobStore(() => "job-stream");
        let release: () => void = () => undefined;
        const gate = new Promise<void>((resolve) => {
            release = resolve;
        });
        await withServer(
            {
                publicDir: PUBLIC,
                jobs,
                listDistrictOrgs: async (_url, options) => {
                    options?.onProgress?.("search 10/100");
                    await gate;
                    return DUMP;
                },
            },
            async (base) => {
                const created = await fetch(`${base}/api/jobs`, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        url: "https://yandex.ru/maps/213/moscow/geo/rayon_bibirevo/53211689/",
                    }),
                });
                assert.equal(created.status, 202);
                const stream = await fetch(`${base}/api/jobs/job-stream/stream`);
                assert.equal(stream.status, 200);
                assert.match(
                    stream.headers.get("content-type") ?? "",
                    /text\/event-stream/
                );
                const reader = stream.body?.getReader();
                assert.ok(reader);
                const decoder = new TextDecoder();
                let buf = "";
                const readJob = async () => {
                    for (;;) {
                        const chunk = await reader.read();
                        if (chunk.done) throw new Error("stream ended");
                        buf += decoder.decode(chunk.value, { stream: true });
                        const split = buf.indexOf("\n\n");
                        if (split < 0) continue;
                        const event = buf.slice(0, split);
                        buf = buf.slice(split + 2);
                        const line = event
                            .split("\n")
                            .find((row) => row.startsWith("data: "));
                        if (line) return JSON.parse(line.slice(6));
                    }
                };
                const first = await readJob();
                assert.equal(typeof first.percent, "number");
                release();
                let last = first;
                for (let i = 0; i < 20; i += 1) {
                    last = await readJob();
                    if (last.status === "done") break;
                }
                assert.equal(last.status, "done");
                assert.equal(last.percent, 100);
            }
        );
    });

    it("pauses and resumes a running job", async () => {
        const jobs = new JobStore(() => "job-pause");
        let release: () => void = () => undefined;
        const gate = new Promise<void>((resolve) => {
            release = resolve;
        });
        await withServer(
            {
                publicDir: PUBLIC,
                jobs,
                listDistrictOrgs: async (_url, options) => {
                    options?.onProgress?.("search 10/100");
                    await gate;
                    return DUMP;
                },
            },
            async (base) => {
                const created = await fetch(`${base}/api/jobs`, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        url: "https://yandex.ru/maps/213/moscow/geo/rayon_bibirevo/53211689/",
                    }),
                });
                assert.equal(created.status, 202);
                const paused = await fetch(`${base}/api/jobs/job-pause/pause`, {
                    method: "POST",
                });
                assert.equal(paused.status, 200);
                assert.equal((await paused.json()).status, "paused");
                const resumed = await fetch(
                    `${base}/api/jobs/job-pause/resume`,
                    { method: "POST" }
                );
                assert.equal(resumed.status, 200);
                assert.equal((await resumed.json()).status, "running");
                release();
                for (let i = 0; i < 20; i += 1) {
                    const current = await fetch(
                        `${base}/api/jobs/job-pause`
                    ).then((res) => res.json());
                    if (current.status === "done") return;
                    await new Promise((resolve) => setTimeout(resolve, 20));
                }
                assert.fail("job did not finish after resume");
            }
        );
    });

    it("cancels a running job", async () => {
        const jobs = new JobStore(() => "job-cancel");
        let release: () => void = () => undefined;
        const gate = new Promise<void>((resolve) => {
            release = resolve;
        });
        await withServer(
            {
                publicDir: PUBLIC,
                jobs,
                listDistrictOrgs: async (_url, options) => {
                    await new Promise<void>((resolve, reject) => {
                        const onAbort = () => {
                            reject(
                                Object.assign(new Error("cancelled"), {
                                    name: "AbortError",
                                })
                            );
                        };
                        options?.signal?.addEventListener("abort", onAbort);
                        void gate.then(() => {
                            options?.signal?.removeEventListener(
                                "abort",
                                onAbort
                            );
                            resolve();
                        });
                    });
                    return DUMP;
                },
            },
            async (base) => {
                const created = await fetch(`${base}/api/jobs`, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        url: "https://yandex.ru/maps/213/moscow/geo/rayon_bibirevo/53211689/",
                    }),
                });
                assert.equal(created.status, 202);
                const cancelled = await fetch(
                    `${base}/api/jobs/job-cancel/cancel`,
                    { method: "POST" }
                );
                assert.equal(cancelled.status, 200);
                assert.equal((await cancelled.json()).status, "cancelled");
                release();
                await new Promise((resolve) => setTimeout(resolve, 30));
                const current = await fetch(
                    `${base}/api/jobs/job-cancel`
                ).then((res) => res.json());
                assert.equal(current.status, "cancelled");
            }
        );
    });
});
