import { test } from "node:test";
import assert from "node:assert/strict";
import { errMsg } from "./index.js";

test("errMsg reads Error.message and stringifies the rest", () => {
    assert.equal(errMsg(new Error("boom")), "boom");
    assert.equal(errMsg("plain"), "plain");
    assert.equal(errMsg(42), "42");
});
