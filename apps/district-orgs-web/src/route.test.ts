import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { jobPath, parseRoute } from "./route.ts";

describe("parseRoute", () => {
    it("maps home, history and job pages", () => {
        assert.deepEqual(parseRoute("/"), { name: "home" });
        assert.deepEqual(parseRoute("/history"), { name: "history" });
        assert.deepEqual(parseRoute("/history/"), { name: "history" });
        assert.deepEqual(parseRoute("/jobs/abc-1"), { name: "job", id: "abc-1" });
        assert.deepEqual(parseRoute("/other"), { name: "home" });
    });

    it("builds a job path", () => {
        assert.equal(jobPath("job-1"), "/jobs/job-1");
    });
});
