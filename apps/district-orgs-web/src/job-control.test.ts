import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JobControl, isCancelledError } from "./job-control.ts";

describe("JobControl", () => {
    it("holds checkpoint until resume", async () => {
        const control = new JobControl();
        control.pause();
        let passed = false;
        const pending = control.checkpoint().then(() => {
            passed = true;
        });
        await new Promise((resolve) => setTimeout(resolve, 30));
        assert.equal(passed, false);
        assert.equal(control.resume(), true);
        await pending;
        assert.equal(passed, true);
    });

    it("cancel unblocks a paused checkpoint", async () => {
        const control = new JobControl();
        control.pause();
        const pending = control.checkpoint();
        assert.equal(control.cancel(), true);
        await assert.rejects(pending, isCancelledError);
    });

    it("ignores pause after cancel", () => {
        const control = new JobControl();
        control.cancel();
        assert.equal(control.pause(), false);
        assert.equal(control.resume(), false);
    });
});
