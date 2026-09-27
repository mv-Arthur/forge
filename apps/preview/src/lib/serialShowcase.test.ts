import assert from "node:assert/strict";
import { test } from "node:test";
import {
    buildSerialPage,
    heatEnvelope,
    isAllowedMediaUrl,
    isHandShowcaseSlug,
    isSerialProject,
    parseDims,
    planSvg,
    roomProgram,
    sleepRoomCount,
    storyCount,
    serialCopy,
    type SerialShowcaseInput,
} from "./serialShowcase.ts";

function input(over: Partial<SerialShowcaseInput> = {}): SerialShowcaseInput {
    return {
        slug: "lester",
        name: "Лестер",
        dimensions: "10х12",
        area: 180,
        bedrooms: 4,
        bathrooms: 2,
        floors: "2",
        technologies: ["gas_concrete"],
        features: ["terrace"],
        categories: ["doma-iz-gazobetona"],
        renders: [
            "https://ncottage.ru/app/uploads/lester-1.jpg",
            "https://ncottage.ru/app/uploads/lester-2.jpg",
        ],
        priceFrom: 8_000_000,
        ...over,
    };
}

test("hand slugs stay hand-authored", () => {
    assert.equal(isHandShowcaseSlug("favor"), true);
    assert.equal(isHandShowcaseSlug("lester"), false);
});

test("individual and bath are not serial", () => {
    assert.equal(
        isSerialProject({
            slug: "brig",
            categories: ["doma-originalnie"],
        }),
        false
    );
    assert.equal(isSerialProject({ slug: "banya-levashovo" }), false);
    assert.equal(
        isSerialProject({ slug: "lester", categories: ["doma-iz-gazobetona"] }),
        true
    );
});

test("one-storey program has only floor 1", () => {
    const rooms = roomProgram({
        slug: "lids",
        bedrooms: 2,
        bathrooms: 1,
        floors: "1",
        features: [],
    });
    assert.equal(
        rooms.every((r) => r.floor === "1"),
        true
    );
    assert.equal(storyCount("1"), 1);
    const page = buildSerialPage(
        input({ slug: "lids", floors: "1", bedrooms: 2, bathrooms: 1 })
    );
    assert.equal(
        page.plans.every((p) => p.floor === "1 этаж"),
        true
    );
    assert.equal(new Set(page.plans.map((p) => p.layer)).has("2d"), true);
    assert.equal(new Set(page.plans.map((p) => p.layer)).has("3d"), true);
    assert.equal(new Set(page.plans.map((p) => p.layer)).has("walls"), true);
});

test("serial page has walls, 3d and customer plan alts", () => {
    const page = buildSerialPage(input());
    assert.ok(page.plans.some((p) => p.layer === "walls"));
    assert.ok(page.plans.some((p) => p.layer === "3d"));
    assert.ok((page.customerAlts?.plans.length ?? 0) >= 2);
    assert.match(planSvg(roomProgram(input()), "1", "walls"), /wall-hatch/);
});

test("sleep rooms cover bedrooms", () => {
    const rooms = roomProgram({
        slug: "lester",
        bedrooms: 4,
        bathrooms: 2,
        floors: "2",
        features: ["terrace"],
    });
    assert.ok(sleepRoomCount(rooms) >= 4);
});

test("heat floor grows with area", () => {
    const small = heatEnvelope({
        area: 100,
        floors: "2",
        dimensions: "8х8",
    });
    const large = heatEnvelope({
        area: 400,
        floors: "2",
        dimensions: "16х16",
    });
    assert.ok(large.floor > small.floor);
    assert.ok(large.roof > small.roof);
    assert.ok(large.walls > small.walls);
});

test("lead uses the primary technology, not gas_concrete by default", () => {
    const copy = serialCopy(
        input({
            slug: "a-dom",
            name: "А-дом",
            technologies: ["frame", "gas_concrete", "brick", "sip"],
        })
    );
    assert.match(copy.lead, /Каркас/);
    assert.equal(/газобетон/i.test(copy.lead), false);
    assert.match(copy.about[0].text, /Каркас/);
});

test("copy names the area and not Favor", () => {
    const copy = serialCopy(input());
    assert.match(copy.lead, /180 м²/);
    assert.match(copy.about[0].text, /180 м²/);
    assert.equal(/фавор/i.test(copy.lead), false);
    assert.equal(/фавор/i.test(copy.about.map((a) => a.text).join(" ")), false);
});

test("videos and timelapse alts appear when files are wired", () => {
    const page = buildSerialPage(input(), {
        videos: {
            timelapse: {
                poster: "/media/detail/lester/video/timelapse.jpg",
                src: "/media/detail/lester/video/timelapse.mp4",
            },
            review: {
                poster: "/media/detail/lester/hero-1.jpg",
                src: "/media/detail/lester/video/review.mp4",
            },
        },
    });
    assert.equal(page.videos?.length, 2);
    assert.equal(page.customerAlts?.timelapses.length, 1);
    assert.equal(page.customerAlts?.timelapses[0]?.src.endsWith(".mp4"), true);
});

test("mosaic tiles appear when interior and layout photos exist", () => {
    const page = buildSerialPage(input(), {
        mosaicInterior: "/media/detail/lester/mosaic-interior.jpg",
        mosaicLayout: "/media/detail/lester/mosaic-layout.jpg",
    });
    assert.ok(page.mosaic);
    assert.equal(page.mosaic?.about.title, "О проекте");
    assert.equal(page.mosaic?.interior.title, "Интерьер и свет");
    assert.equal(page.mosaic?.layout.title, "Планировка");
    assert.match(page.mosaic?.about.text ?? "", /180 м²/);
    assert.equal(page.mosaic?.about.image, page.gallery[0]);
    assert.equal(
        page.mosaic?.interior.image,
        "/media/detail/lester/mosaic-interior.jpg"
    );
});

test("gallery keeps remote renders, plans are local media", () => {
    const page = buildSerialPage(input());
    assert.equal(page.gallery.every(isAllowedMediaUrl), true);
    assert.equal(page.gallery[0]?.startsWith("https://ncottage.ru/"), true);
    assert.equal(
        page.plans.every((p) => p.url.startsWith("/media/detail/lester/")),
        true
    );
    assert.equal(page.facades.length, 0);
    assert.equal(page.mosaic, undefined);
    assert.ok(page.priceHike);
    assert.equal(page.priceHike?.from, "2026-10-01");
    assert.equal(page.heatCalc != null, true);
});

test("local heroes replace remote gallery", () => {
    const page = buildSerialPage(input(), {
        heroes: [
            "/media/detail/lester/hero-1.jpg",
            "/media/detail/lester/hero-2.jpg",
        ],
    });
    assert.deepEqual(page.gallery, [
        "/media/detail/lester/hero-1.jpg",
        "/media/detail/lester/hero-2.jpg",
    ]);
});

test("local interiors unlock mosaic and decor", () => {
    const rooms = roomProgram(input());
    const roomUrls: Record<string, string> = {};
    for (const room of rooms) {
        roomUrls[room.id] = `/media/detail/lester/${room.id}.jpg`;
    }
    const page = buildSerialPage(input(), {
        rooms: roomUrls,
        facades: {
            front: "/media/detail/lester/facade-front.jpg",
            back: "/media/detail/lester/facade-back.jpg",
            left: "/media/detail/lester/facade-left.jpg",
            right: "/media/detail/lester/facade-right.jpg",
        },
    });
    assert.equal(page.facades.length, 4);
    assert.ok(page.mosaic);
    assert.ok((page.decor?.length ?? 0) >= 4);
    assert.ok(
        (page.decor ?? []).filter((d) => /спальн|детск/i.test(d.title))
            .length >= 4
    );
});

test("plan svg labels rooms on 2d and hatches load-bearing walls", () => {
    const rooms = roomProgram(input({ floors: "1", bedrooms: 2 }));
    const twoD = planSvg(rooms, "1", "2d");
    const walls = planSvg(rooms, "1", "walls");
    const threeD = planSvg(rooms, "1", "3d");
    assert.match(twoD, /Гостиная/);
    assert.match(walls, /wall-hatch/);
    assert.match(threeD, /polygon/);
});

test("parseDims reads кириллический х", () => {
    assert.deepEqual(parseDims("10х12"), { w: 10, d: 12 });
    assert.equal(parseDims(null), null);
});
