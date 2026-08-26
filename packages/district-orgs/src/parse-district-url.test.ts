import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DistrictUrlError, parseDistrictUrl } from "./parse-district-url.ts";

const BIBIREVO =
    "https://yandex.ru/maps/213/moscow/geo/rayon_bibirevo/53211689/?ll=37.613451%2C55.895195&z=15.27";

describe("parseDistrictUrl", () => {
    it("parses a city-scoped geo URL with ll and zoom", () => {
        const ref = parseDistrictUrl(BIBIREVO);
        assert.equal(ref.geoId, "53211689");
        assert.equal(ref.slug, "rayon_bibirevo");
        assert.equal(ref.cityId, "213");
        assert.equal(ref.citySlug, "moscow");
        assert.deepEqual(ref.coordinates, { lon: 37.613451, lat: 55.895195 });
        assert.equal(ref.zoom, 15.27);
        assert.equal(ref.origin, "https://yandex.ru");
        assert.equal(
            ref.url,
            "https://yandex.ru/maps/213/moscow/geo/rayon_bibirevo/53211689/"
        );
    });

    it("parses a geo URL without city segment", () => {
        const ref = parseDistrictUrl(
            "https://yandex.ru/maps/geo/rayon_bibirevo/53211689/"
        );
        assert.equal(ref.cityId, null);
        assert.equal(ref.slug, "rayon_bibirevo");
        assert.equal(ref.geoId, "53211689");
    });

    it("parses oid query on maps root", () => {
        const ref = parseDistrictUrl(
            "https://yandex.ru/maps/?ol=geo&oid=53211689"
        );
        assert.equal(ref.geoId, "53211689");
        assert.equal(ref.slug, null);
        assert.equal(ref.url, "https://yandex.ru/maps/?ol=geo&oid=53211689");
    });

    it("rejects a non-maps host", () => {
        assert.throws(
            () => parseDistrictUrl("https://example.com/maps/geo/x/1/"),
            DistrictUrlError
        );
    });

    it("rejects an organization URL", () => {
        assert.throws(
            () =>
                parseDistrictUrl(
                    "https://yandex.ru/maps/org/tsentr_gosuslug/1403291512/"
                ),
            DistrictUrlError
        );
    });
});
