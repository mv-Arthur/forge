import { test } from "node:test";
import assert from "node:assert/strict";
import {
    isNestedSitemap,
    parseHtmlHrefs,
    parseRobotsSitemaps,
    parseSitemapLocs,
} from "./index.js";

test("parseRobotsSitemaps: Sitemap lines, ignore the rest", () => {
    const robots = [
        "User-agent: *",
        "Disallow: /admin/",
        "Sitemap: https://ex.com/sitemap.xml",
        "  sitemap : https://ex.com/other.xml.gz",
        "# Sitemap: https://ex.com/commented.xml",
        "Sitemap: https://ex.com/paged.xml?from=1",
    ].join("\n");
    assert.deepEqual(parseRobotsSitemaps(robots), [
        "https://ex.com/sitemap.xml",
        "https://ex.com/other.xml.gz",
        "https://ex.com/paged.xml?from=1",
    ]);
});

test("parseRobotsSitemaps: CRLF", () => {
    assert.deepEqual(
        parseRobotsSitemaps("Sitemap: https://a.xml\r\nSitemap: https://b.xml"),
        ["https://a.xml", "https://b.xml"],
    );
});

test("parseSitemapLocs: plain, spaced, CDATA, mixed case", () => {
    const xml = `
      <urlset>
        <loc>https://ex.com/a</loc>
        <LOC>  https://ex.com/b  </LOC>
        <loc><![CDATA[https://ex.com/c]]></loc>
        <loc></loc>
      </urlset>
    `;
    assert.deepEqual(parseSitemapLocs(xml), [
        "https://ex.com/a",
        "https://ex.com/b",
        "https://ex.com/c",
    ]);
});

test("parseSitemapLocs: lastIndex does not leak across calls", () => {
    const xml = "<loc>https://ex.com/a</loc><loc>https://ex.com/b</loc>";
    assert.equal(parseSitemapLocs(xml).length, 2);
    assert.equal(parseSitemapLocs(xml).length, 2);
});

test("isNestedSitemap: xml and xml.gz, not html pages", () => {
    assert.equal(isNestedSitemap("https://ex.com/sitemap.xml"), true);
    assert.equal(isNestedSitemap("https://ex.com/sitemap.XML"), true);
    assert.equal(isNestedSitemap("https://ex.com/sitemap.xml.gz"), true);
    assert.equal(isNestedSitemap("https://ex.com/sitemap.xml?from=1"), true);
    assert.equal(isNestedSitemap("https://ex.com/sitemap.xml.gz?from=1"), true);
    assert.equal(isNestedSitemap("https://ex.com/page.xml.html"), false);
    assert.equal(isNestedSitemap("https://ex.com/foo.xml/bar"), false);
    assert.equal(isNestedSitemap("https://ex.com/catalog"), false);
});

test("parseHtmlHrefs: quotes and spaces around =", () => {
    const html = `
      <a href="/a">a</a>
      <a href='/b'>b</a>
      <a href = "/c">c</a>
      <A HREF="/d">d</A>
      <img src="/e.jpg">
      <a href=/bare>no</a>
    `;
    assert.deepEqual(parseHtmlHrefs(html), ["/a", "/b", "/c", "/d"]);
});

test("parseHtmlHrefs: lastIndex does not leak across calls", () => {
    const html = `<a href="/a"></a><a href="/b"></a>`;
    assert.equal(parseHtmlHrefs(html).length, 2);
    assert.equal(parseHtmlHrefs(html).length, 2);
});
