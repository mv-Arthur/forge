import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { jobPercent, parseJobProgress } from "./job-progress.ts";

describe("parseJobProgress", () => {
    it("maps lookup to the district stage", () => {
        const view = parseJobProgress("lookup Бибирево");
        assert.equal(view.active, "district");
        assert.deepEqual(view.completed, []);
        assert.equal(view.detail, "Бибирево");
        assert.equal(view.determinate, true);
        assert.equal(jobPercent("lookup Бибирево"), 5);
    });

    it("maps search counts to orgs", () => {
        const empty = parseJobProgress("search 0");
        assert.equal(empty.active, "orgs");
        assert.deepEqual(empty.completed, ["district"]);
        assert.equal(empty.detail, "Ищем точки на карте");

        const filled = parseJobProgress("search 1420");
        assert.match(filled.detail, /1\s420 организаций/u);
        assert.equal(filled.determinate, true);
        assert.ok(filled.ratio > empty.ratio);

        const withTotal = parseJobProgress("search 180/1060");
        assert.match(withTotal.detail, /180 из 1\s060 организаций/u);
        assert.ok(withTotal.ratio < 0.5);
        assert.ok(jobPercent("search 180/1060") > jobPercent("search 0/1060"));
    });

    it("maps house lookups to addresses", () => {
        const view = parseJobProgress("house 86");
        assert.equal(view.active, "houses");
        assert.deepEqual(view.completed, ["district", "orgs"]);
        assert.equal(view.detail, "86 домов");
        assert.ok(view.ratio > 0.5);

        const withTotal = parseJobProgress("house 86/400");
        assert.equal(withTotal.detail, "86 из 400 домов");
        assert.ok(withTotal.ratio > parseJobProgress("search 1060/1060").ratio);
        assert.ok(jobPercent("house 400/400") > jobPercent("house 86/400"));
    });

    it("treats start and unknown as opening maps", () => {
        assert.equal(parseJobProgress("start").active, "district");
        assert.equal(parseJobProgress("Готовлю запрос…").detail, "Открываем Карты");
        assert.equal(parseJobProgress("").detail, "Открываем Карты");
    });

    it("completes every stage on done", () => {
        const view = parseJobProgress("done");
        assert.equal(view.active, "sheets");
        assert.deepEqual(view.completed, [
            "district",
            "orgs",
            "houses",
            "sheets",
        ]);
        assert.equal(view.ratio, 1);
    });
});
