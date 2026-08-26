import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchText } from "./index.js";
import { startTestServer } from "./test-server.js";

test("fetchText returns body", async () => {
    const srv = await startTestServer({
        "/": { body: "hello", type: "text/plain" },
    });
    try {
        const res = await fetchText(srv.origin.href);
        assert.equal(res.body, "hello");
        assert.equal(res.status, 200);
    } finally {
        await srv.close();
    }
});

test("fetchText follows one redirect", async () => {
    const srv = await startTestServer({
        "/go": { status: 302, location: "/next" },
        "/next": { body: "landed", type: "text/plain" },
    });
    try {
        const res = await fetchText(new URL("/go", srv.origin).href);
        assert.equal(res.body, "landed");
        assert.equal(res.status, 200);
    } finally {
        await srv.close();
    }
});

test("fetchText still returns 404 body", async () => {
    const srv = await startTestServer({});
    try {
        const res = await fetchText(new URL("/missing", srv.origin).href);
        assert.equal(res.body, "not found");
        assert.equal(res.status, 404);
    } finally {
        await srv.close();
    }
});

test("fetchText rejects redirect loops", async () => {
    const srv = await startTestServer({
        "/a": { status: 302, location: "/b" },
        "/b": { status: 302, location: "/a" },
    });
    try {
        await assert.rejects(
            () => fetchText(new URL("/a", srv.origin).href),
            /too many redirects/,
        );
    } finally {
        await srv.close();
    }
});

test("fetchText does not follow off-origin redirect", async () => {
    const srv = await startTestServer({
        "/go": { status: 302, location: "https://other.com/x" },
    });
    try {
        await assert.rejects(
            () => fetchText(new URL("/go", srv.origin).href),
            /redirect off origin/,
        );
    } finally {
        await srv.close();
    }
});
