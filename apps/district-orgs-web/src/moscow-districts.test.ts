import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MOSCOW_DISTRICTS } from "./moscow-districts.ts";

describe("MOSCOW_DISTRICTS", () => {
    it("covers every Moscow okrug with unique ids", () => {
        assert.ok(MOSCOW_DISTRICTS.length >= 120);
        const ids = MOSCOW_DISTRICTS.map((row) => row.id);
        assert.equal(new Set(ids).size, ids.length);
        const okrugs = new Set(MOSCOW_DISTRICTS.map((row) => row.okrug));
        for (const okrug of [
            "ЦАО",
            "САО",
            "СВАО",
            "ВАО",
            "ЮВАО",
            "ЮАО",
            "ЮЗАО",
            "ЗАО",
            "СЗАО",
            "ЗелАО",
            "НАО",
            "ТАО",
        ]) {
            assert.equal(okrugs.has(okrug), true, okrug);
        }
    });
});
