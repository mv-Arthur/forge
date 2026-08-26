import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runCli } from "./run-cli.ts";

const DISTRICT_URL =
    "https://yandex.ru/maps/213/moscow/geo/rayon_bibirevo/53211689/";

const PAGE_STATE = {
    config: { csrfToken: "csrf-token:1" },
    stack: [
        {
            response: {
                items: [
                    {
                        type: "toponym",
                        id: "53211689",
                        title: "район Бибирево",
                        address: "Москва, район Бибирево",
                        coordinates: [37.607673, 55.894495],
                        bounds: [
                            [37.586643, 55.879339],
                            [37.644001, 55.913631],
                        ],
                        displayGeometry: {
                            type: "Polygon",
                            coordinates: [
                                [
                                    [37.58, 55.88],
                                    [37.65, 55.88],
                                    [37.65, 55.92],
                                    [37.58, 55.92],
                                    [37.58, 55.88],
                                ],
                            ],
                        },
                    },
                ],
            },
        },
    ],
};

const staticMapUrls: string[] = [];

function mockFetch(input: RequestInfo | URL): Promise<Response> {
    const url = String(input);
    if (url.includes("static-maps.yandex.ru")) {
        staticMapUrls.push(url);
        return Promise.resolve(
            new Response(Buffer.from("png"), {
                status: 200,
                headers: { "content-type": "image/png" },
            })
        );
    }
    if (url.includes("/geo/")) {
        return Promise.resolve(
            new Response(
                `<script type="application/json">${JSON.stringify(PAGE_STATE)}</script>`,
                { status: 200 }
            )
        );
    }
    return Promise.resolve(
        new Response(
            JSON.stringify({
                data: {
                    totalResultCount: 1,
                    items: [
                        {
                            type: "business",
                            id: "1",
                            title: "Кафе внутри",
                            address: "ул. Лескова, 1",
                            coordinates: [37.6, 55.9],
                            categories: [{ name: "Кафе" }],
                            phones: [{ number: "+7 (495) 000-00-00" }],
                            seoname: "kafe",
                        },
                    ],
                },
            }),
            { status: 200 }
        )
    );
}

describe("runCli", () => {
    it("prints help and exits 0", async () => {
        let stdout = "";
        const code = await runCli(["--help"], {
            stdout: { write: (chunk) => (stdout += chunk) },
            stderr: { write: () => undefined },
        });
        assert.equal(code, 0);
        assert.match(stdout, /Usage: district-orgs/);
    });

    it("exits 2 without a URL", async () => {
        let stderr = "";
        const code = await runCli([], {
            stdout: { write: () => undefined },
            stderr: { write: (chunk) => (stderr += chunk) },
        });
        assert.equal(code, 2);
        assert.match(stderr, /District URL is required/);
    });

    it("prints a table to stdout with -o -", async () => {
        let stdout = "";
        const code = await runCli(
            [DISTRICT_URL, "-f", "table", "-o", "-", "--delay-ms", "0"],
            {
                stdout: { write: (chunk) => (stdout += chunk) },
                stderr: { write: () => undefined },
                fetch: mockFetch,
            }
        );
        assert.equal(code, 0);
        assert.match(stdout, /район Бибирево/);
        assert.match(stdout, /Кафе внутри/);
    });

    it("writes JSON to cwd by default", async () => {
        const files = new Map<string, string>();
        let stderr = "";
        const code = await runCli([DISTRICT_URL, "--delay-ms", "0"], {
            stdout: { write: () => undefined },
            stderr: { write: (chunk) => (stderr += chunk) },
            fetch: mockFetch,
            cwd: "/tmp/district-out",
            writeFile: async (filePath, data) => {
                files.set(filePath, data);
            },
        });
        assert.equal(code, 0);
        const outPath =
            "/tmp/district-out/district-orgs-rayon-bibirevo-53211689.json";
        const parsed = JSON.parse(files.get(outPath) ?? "{}");
        assert.equal(parsed.count, 1);
        assert.match(stderr, new RegExp(`Wrote 1 organizations to ${outPath}`));
    });

    it("writes JSON to --out", async () => {
        const files = new Map<string, string>();
        let stderr = "";
        const code = await runCli(
            [DISTRICT_URL, "-o", "/tmp/orgs.json", "--delay-ms", "0"],
            {
                stdout: { write: () => undefined },
                stderr: { write: (chunk) => (stderr += chunk) },
                fetch: mockFetch,
                writeFile: async (filePath, data) => {
                    files.set(filePath, data);
                },
            }
        );
        assert.equal(code, 0);
        const parsed = JSON.parse(files.get("/tmp/orgs.json") ?? "{}");
        assert.equal(parsed.count, 1);
        assert.match(stderr, /Wrote 1 organizations to \/tmp\/orgs.json/);
    });

    it("writes a sheets HTML file", async () => {
        staticMapUrls.length = 0;
        const files = new Map<string, string>();
        let stderr = "";
        const code = await runCli(
            [DISTRICT_URL, "-f", "sheets", "--no-densify", "--delay-ms", "0"],
            {
                stdout: { write: () => undefined },
                stderr: { write: (chunk) => (stderr += chunk) },
                fetch: mockFetch,
                cwd: "/tmp/district-out",
                writeFile: async (filePath, data) => {
                    files.set(filePath, data);
                },
            }
        );
        assert.equal(code, 0);
        const outPath =
            "/tmp/district-out/district-orgs-rayon-bibirevo-53211689.html";
        const html = files.get(outPath) ?? "";
        assert.match(html, /class="sheet"/);
        assert.match(html, /Кафе внутри/);
        assert.match(html, /лист 1\/1/);
        assert.doesNotMatch(html, /<svg/);
        assert.match(stderr, /on sheets to/);
        assert.ok(staticMapUrls.length >= 1);
        const mapUrl = new URL(staticMapUrls[0] ?? "");
        assert.match(mapUrl.searchParams.get("pt") ?? "", /pmrds1/);
    });
});
