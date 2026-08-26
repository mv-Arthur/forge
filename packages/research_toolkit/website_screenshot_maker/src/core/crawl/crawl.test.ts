import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { crawlPages } from "./index.js";
import { startTestServer, type TestRoute } from "../http/test-server.js";

test("crawlPages multi-hop: / → /a → /e", async () => {
    const routes: Record<string, TestRoute> = {
        "/": { body: `<html><a href="/a">a</a></html>` },
        "/a": { body: `<html><a href="/e">e</a></html>` },
        "/e": { body: `<html>leaf</html>` },
    };
    const srv = await startTestServer(routes);
    try {
        const home = srv.origin.href;
        const found = await crawlPages([home], srv.origin);
        assert.ok(found.has(home));
        assert.ok(found.has(new URL("/a", srv.origin).href));
        assert.ok(found.has(new URL("/e", srv.origin).href));
    } finally {
        await srv.close();
    }
});

test("crawlPages skips foreign host and jpg", async () => {
    const routes: Record<string, TestRoute> = {
        "/": {
            body: `<html><a href="https://other.com/z">z</a><a href="/photo.jpg">img</a><a href="/ok">ok</a></html>`,
        },
        "/ok": { body: `<html>ok</html>` },
    };
    const srv = await startTestServer(routes);
    try {
        const found = await crawlPages([srv.origin.href], srv.origin);
        assert.equal(
            [...found].some((u) => u.includes("other.com")),
            false,
        );
        assert.equal(
            [...found].some((u) => u.includes("photo.jpg")),
            false,
        );
        assert.ok(found.has(new URL("/ok", srv.origin).href));
    } finally {
        await srv.close();
    }
});

test("crawlPages cycle /a ↔ /b terminates with size 2", async () => {
    const routes: Record<string, TestRoute> = {
        "/a": { body: `<html><a href="/b">b</a></html>` },
        "/b": { body: `<html><a href="/a">a</a></html>` },
    };
    const srv = await startTestServer(routes);
    try {
        const a = new URL("/a", srv.origin).href;
        const found = await crawlPages([a], srv.origin);
        assert.equal(found.size, 2);
        assert.ok(found.has(a));
        assert.ok(found.has(new URL("/b", srv.origin).href));
    } finally {
        await srv.close();
    }
});

test("crawlPages does not expand hrefs from HTTP 404 body", async () => {
    const routes: Record<string, TestRoute> = {
        "/": { body: `<html><a href="/gone">g</a></html>` },
        "/gone": {
            status: 404,
            body: `<html><a href="/secret">s</a></html>`,
        },
        "/secret": { body: `<html>nope</html>` },
    };
    const srv = await startTestServer(routes);
    try {
        const found = await crawlPages([srv.origin.href], srv.origin);
        assert.ok(found.has(new URL("/gone", srv.origin).href));
        assert.equal(found.has(new URL("/secret", srv.origin).href), false);
    } finally {
        await srv.close();
    }
});

test("crawlPages drop does not reject", async () => {
    const routes: Record<string, TestRoute> = {
        "/": { body: `<html><a href="/gone">g</a><a href="/ok">ok</a></html>` },
        "/gone": { drop: true },
        "/ok": { body: `<html>ok</html>` },
    };
    const srv = await startTestServer(routes);
    try {
        const found = await crawlPages([srv.origin.href], srv.origin);
        assert.ok(found.has(new URL("/ok", srv.origin).href));
        assert.ok(found.has(new URL("/gone", srv.origin).href));
    } finally {
        await srv.close();
    }
});

test("crawlPages relative href from /catalog/ does not fetch PAGEN_1=3", async () => {
    const hits = new Map<string, number>();
    const server = http.createServer((req, res) => {
        const raw = req.url ?? "/";
        hits.set(raw, (hits.get(raw) ?? 0) + 1);
        if (raw === "/" || raw === "") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`<html><a href="/catalog/">c</a></html>`);
            return;
        }
        if (raw === "/catalog/" || raw === "/catalog") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`<html><a href="?PAGEN_1=2">p2</a></html>`);
            return;
        }
        if (raw === "/catalog/?PAGEN_1=2") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`<html><a href="?PAGEN_1=3">p3</a></html>`);
            return;
        }
        if (raw === "/catalog/?PAGEN_1=3") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`<html>p3</html>`);
            return;
        }
        res.writeHead(404);
        res.end("not found");
    });
    await new Promise<void>((resolve) => {
        server.listen(0, "127.0.0.1", () => resolve());
    });
    const addr = server.address();
    if (!addr || typeof addr === "string") throw new Error("no address");
    const origin = new URL(`http://127.0.0.1:${addr.port}/`);
    try {
        const found = await crawlPages([origin.href], origin);
        const page2 = new URL("/catalog/?PAGEN_1=2", origin).href;
        const page3 = new URL("/catalog/?PAGEN_1=3", origin).href;
        assert.ok(found.has(page2));
        assert.equal(found.has(page3), false);
        assert.equal(hits.get("/catalog/?PAGEN_1=3") ?? 0, 0);
        assert.equal(hits.get("/catalog/?PAGEN_1=2") ?? 0, 0);
    } finally {
        await new Promise<void>((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    }
});
