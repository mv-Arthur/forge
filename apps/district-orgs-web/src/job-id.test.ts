import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dropJobId, readJobId, readJobIdFromPath, writeJobId } from "./job-id.ts";

describe("job id in the URL", () => {
    it("reads a job query param", () => {
        assert.equal(readJobId("?job=abc"), "abc");
        assert.equal(readJobId("foo=1&job=abc"), "abc");
        assert.equal(readJobId(""), null);
        assert.equal(readJobId("?job="), null);
    });

    it("reads a job id from the path", () => {
        assert.equal(readJobIdFromPath("/jobs/abc"), "abc");
        assert.equal(readJobIdFromPath("/history"), null);
        assert.equal(readJobIdFromPath("/"), null);
    });

    it("writes and drops the job param without losing the rest", () => {
        assert.equal(writeJobId("/?x=1", "job-1"), "/?x=1&job=job-1");
        assert.equal(dropJobId("/?x=1&job=job-1"), "/?x=1");
        assert.equal(writeJobId("/#sheet", "job-1"), "/?job=job-1#sheet");
    });
});
