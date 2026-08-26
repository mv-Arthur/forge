import { test } from "node:test";
import assert from "node:assert/strict";
import {
    acceptPageHref,
    apexHost,
    isPaginationOnly,
    isSkippablePath,
    normalizeUrl,
    sameApexOrigin,
    slugFromUrl,
} from "./index.js";

const origin = new URL("https://www.gwd.ru/");

test("sameApexOrigin treats www as same site", () => {
    assert.equal(sameApexOrigin("https://gwd.ru/x", origin), true);
    assert.equal(sameApexOrigin("https://www.gwd.ru/x", origin), true);
    assert.equal(sameApexOrigin("https://other.com/x.xml", origin), false);
    assert.equal(sameApexOrigin("http://[bad", origin), false);
});

test("apexHost strips only a leading www.", () => {
    assert.equal(apexHost("www.gwd.ru"), "gwd.ru");
    assert.equal(apexHost("WWW.GWD.RU"), "GWD.RU");
    assert.equal(apexHost("gwd.ru"), "gwd.ru");
    assert.equal(apexHost("www2.gwd.ru"), "www2.gwd.ru");
    assert.equal(apexHost("www.www.gwd.ru"), "www.gwd.ru");
});

test("normalizeUrl keeps same site, drops hash and tracking query", () => {
    assert.equal(
        normalizeUrl("https://gwd.ru/catalog/", origin),
        "https://www.gwd.ru/catalog/",
    );
    assert.equal(
        normalizeUrl("http://www.gwd.ru/x#hash", origin),
        "https://www.gwd.ru/x",
    );
    assert.equal(
        normalizeUrl("https://www.gwd.ru/x?utm=1", origin),
        "https://www.gwd.ru/x",
    );
    assert.equal(normalizeUrl("/rel", origin), "https://www.gwd.ru/rel");
    assert.equal(normalizeUrl("https://other.com/x", origin), null);
    assert.equal(normalizeUrl("http://[bad", origin), null);
});

test("normalizeUrl keeps search and pagination query", () => {
    assert.equal(
        normalizeUrl("https://www.gwd.ru/search/?q=дом", origin),
        "https://www.gwd.ru/search/?q=%D0%B4%D0%BE%D0%BC",
    );
    assert.equal(
        normalizeUrl("https://www.gwd.ru/catalog/?PAGEN_1=2", origin),
        "https://www.gwd.ru/catalog/?PAGEN_1=2",
    );
    assert.equal(
        normalizeUrl("https://www.gwd.ru/catalog/?page=3", origin),
        "https://www.gwd.ru/catalog/?page=3",
    );
});

test("slugFromUrl: plus vs hyphen do not collide", () => {
    assert.equal(slugFromUrl("https://ex.com/7+-rooms/"), "7plus-rooms");
    assert.equal(slugFromUrl("https://ex.com/7-rooms/"), "7-rooms");
});

test("slugFromUrl: path, unicode, query", () => {
    assert.equal(slugFromUrl("https://ex.com/"), "home");
    assert.equal(slugFromUrl("https://ex.com/a/b/c"), "a__b__c");
    assert.equal(
        slugFromUrl("https://ex.com/привет"),
        "-D0-BF-D1-80-D0-B8-D0-B2-D0-B5-D1-82",
    );
    assert.notEqual(
        slugFromUrl("https://ex.com/привет"),
        slugFromUrl("https://ex.com/пока"),
    );
    assert.equal(slugFromUrl("https://ex.com/a---b"), "a-b");
    assert.equal(slugFromUrl("https://ex.com/Foo.Bar"), "Foo.Bar");
    assert.equal(
        slugFromUrl("https://ex.com/foo?PAGEN_1=2"),
        "foo__q_PAGEN_1=2",
    );
});

test("isSkippablePath: assets and admin, not html pages", () => {
    for (const p of [
        "/photo.JPG",
        "/a.jpeg",
        "/a.png",
        "/a.gif",
        "/a.webp",
        "/a.svg",
        "/a.pdf",
        "/a.zip",
        "/a.css",
        "/a.js",
        "/a.xml",
        "/a.json",
        "/a.mp4",
        "/a.webm",
        "/api/foo",
        "/admin/",
        "/wp-admin/x",
        "/wp-json/wp/v2",
        "/ws/x",
        "/upload/x",
        "/uploads/a.png",
    ]) {
        assert.equal(isSkippablePath(p), true, p);
    }
    for (const p of ["/catalog", "/about", "/page.html", "/7-rooms/"]) {
        assert.equal(isSkippablePath(p), false, p);
    }
});

test("acceptPageHref resolves query against the page URL", () => {
    const catalog = new URL("https://www.gwd.ru/catalog/");
    assert.equal(
        acceptPageHref("?PAGEN_1=2", catalog, origin),
        "https://www.gwd.ru/catalog/?PAGEN_1=2",
    );
    assert.equal(acceptPageHref("/photo.jpg", catalog, origin), null);
    assert.equal(isPaginationOnly("https://www.gwd.ru/catalog/?PAGEN_1=2"), true);
    assert.equal(isPaginationOnly("https://www.gwd.ru/catalog/"), false);
});
