import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HOME_SLOTS } from "./home-slots.ts";

describe("HOME_SLOTS", () => {
    it("has unique slot ids", () => {
        const ids = HOME_SLOTS.map((row) => row.slot);
        assert.equal(ids.length, new Set(ids).size);
    });

    it("has unique default keys", () => {
        const keys = HOME_SLOTS.map((row) => row.defaultKey).filter(
            (key): key is string => Boolean(key)
        );
        assert.equal(keys.length, new Set(keys).size);
    });
});
