import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { JobArchive } from "./job-archive.ts";
import type { Job } from "./jobs.ts";
import type { WalkView } from "@forge/district-orgs";

const VIEW = {
    district: { title: "район Бибирево" },
    query: "",
    count: 12,
    sheets: [{ index: 1 }, { index: 2 }],
} as unknown as WalkView;

function job(id: string, title = "район Бибирево"): Job {
    return {
        id,
        status: "done",
        progress: "done",
        percent: 100,
        error: null,
        createdAt: "2026-08-30T10:00:00.000Z",
        view: {
            ...VIEW,
            district: { ...VIEW.district, title },
        } as WalkView,
    };
}

describe("JobArchive", () => {
    it("saves a done job and lists a compact summary", async () => {
        const dir = await mkdtemp(path.join(os.tmpdir(), "job-archive-"));
        try {
            const archive = new JobArchive(dir);
            await archive.save(job("job-a"));
            const rows = await archive.list();
            assert.equal(rows.length, 1);
            assert.equal(rows[0]?.id, "job-a");
            assert.equal(rows[0]?.title, "район Бибирево");
            assert.equal(rows[0]?.count, 12);
            assert.equal(rows[0]?.sheets, 2);
            assert.equal("view" in rows[0]!, false);
            const stored = await archive.read("job-a");
            assert.equal(stored?.view?.count, 12);
        } finally {
            await rm(dir, { recursive: true, force: true });
        }
    });

    it("keeps newest first and ignores path traversal", async () => {
        const dir = await mkdtemp(path.join(os.tmpdir(), "job-archive-"));
        try {
            const archive = new JobArchive(dir);
            await archive.save(job("job-a", "Арбат"));
            await archive.save(job("job-b", "Бибирево"));
            const rows = await archive.list();
            assert.deepEqual(
                rows.map((row) => row.id),
                ["job-b", "job-a"]
            );
            assert.equal(await archive.read("../secret"), null);
        } finally {
            await rm(dir, { recursive: true, force: true });
        }
    });
});
