import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { artifactFileName } from "./artifact-path.ts";

describe("artifactFileName", () => {
    it("uses slug, geoId and json extension by default", () => {
        assert.equal(
            artifactFileName(
                {
                    geoId: "53211689",
                    slug: "rayon_bibirevo",
                    citySlug: "moscow",
                },
                "json",
                ""
            ),
            "district-orgs-rayon-bibirevo-53211689.json"
        );
    });

    it("appends a sanitized query and format extension", () => {
        assert.equal(
            artifactFileName(
                {
                    geoId: "53211689",
                    slug: "rayon_bibirevo",
                    citySlug: "moscow",
                },
                "table",
                "кафе / бар"
            ),
            "district-orgs-rayon-bibirevo-53211689-кафе-бар.txt"
        );
    });

    it("uses html for sheets", () => {
        assert.equal(
            artifactFileName(
                {
                    geoId: "53211689",
                    slug: "rayon_bibirevo",
                    citySlug: "moscow",
                },
                "sheets",
                ""
            ),
            "district-orgs-rayon-bibirevo-53211689.html"
        );
    });
});
