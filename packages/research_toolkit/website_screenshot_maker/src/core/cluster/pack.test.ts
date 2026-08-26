import { test } from "node:test";
import assert from "node:assert/strict";
import { collapsePath, matchPath, type SitePack } from "./pack.js";

test("exactPaths / matches only home", () => {
    const pack: SitePack = { exactPaths: ["/"], includePathPrefixes: [] };
    assert.equal(matchPath("/", pack), "/");
    assert.equal(matchPath("", pack), "/");
    assert.equal(matchPath("/catalog", pack), null);
    assert.equal(matchPath("/catalog/foo", pack), null);
});

test("prefix /catalog does not match / or /objects/1", () => {
    const pack: SitePack = {
        exactPaths: [],
        includePathPrefixes: ["/catalog"],
    };
    assert.equal(matchPath("/catalog", pack), "/catalog");
    assert.equal(matchPath("/catalog/foo", pack), "/catalog");
    assert.equal(matchPath("/", pack), null);
    assert.equal(matchPath("/objects/1", pack), null);
});

test("slash in prefixes is skipped (not startsWith-all)", () => {
    const pack: SitePack = {
        exactPaths: [],
        includePathPrefixes: ["/"],
    };
    assert.equal(matchPath("/", pack), null);
    assert.equal(matchPath("/catalog", pack), null);
});

test("collapsePath replaces digits and uuid", () => {
    assert.equal(collapsePath("/catalog/20"), "/catalog/:id");
    assert.equal(
        collapsePath("/a/550e8400-e29b-41d4-a716-446655440000"),
        "/a/:id",
    );
    assert.equal(collapsePath("/"), "/");
});

test("without pack uses collapsePath", () => {
    assert.equal(matchPath("/item/12"), "/item/:id");
});
