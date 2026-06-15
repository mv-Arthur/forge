import { expect, test } from "@playwright/test";

import { routes } from "./routes";

// Console / network noise that is not an app defect.
const IGNORED_MESSAGES = [
    "Download the React DevTools",
    "favicon.ico",
    "[Fast Refresh]",
];

const IGNORED_REQUESTS = ["/favicon.ico", "/_next/static/webpack/"];

function isIgnored(text: string, list: string[]): boolean {
    return list.some((needle) => text.includes(needle));
}

// localhost and 127.0.0.1 are the same host for our purposes; normalize so a
// stray absolute link to the other form isn't dropped as "cross-origin".
function normalizeHost(host: string): string {
    return host === "127.0.0.1" ? "localhost" : host;
}

function isSameOrigin(url: string, base: string): boolean {
    try {
        const a = new URL(url);
        const b = new URL(base);
        return (
            a.protocol === b.protocol &&
            a.port === b.port &&
            normalizeHost(a.hostname) === normalizeHost(b.hostname)
        );
    } catch {
        return false;
    }
}

test.describe("smoke: every route renders cleanly", () => {
    for (const route of routes) {
        test(`route ${route}`, async ({ page, baseURL }, testInfo) => {
            const consoleErrors: string[] = [];
            const pageErrors: string[] = [];
            const failedRequests: string[] = [];

            page.on("console", (msg) => {
                if (msg.type() !== "error") return;
                const text = msg.text();
                if (!isIgnored(text, IGNORED_MESSAGES)) consoleErrors.push(text);
            });
            page.on("pageerror", (err) => {
                pageErrors.push(err.message);
            });
            page.on("response", (res) => {
                const status = res.status();
                const url = res.url();
                if (status < 400) return;
                if (baseURL && !isSameOrigin(url, baseURL)) return; // only same-origin
                if (isIgnored(url, IGNORED_REQUESTS)) return;
                failedRequests.push(`${status} ${url}`);
            });

            const response = await page.goto(route, { waitUntil: "load" });
            expect(response, `no response for ${route}`).not.toBeNull();
            expect(
                response!.status(),
                `${route} returned ${response!.status()}`,
            ).toBeLessThan(400);

            // `networkidle` never settles under Next dev (HMR socket), so give
            // lazy assets a short, bounded settle instead.
            await page.waitForTimeout(1200);

            // Scroll through the page so `loading="lazy"` images below the fold
            // actually start loading before we inspect them, then return to top.
            await page.evaluate(async () => {
                const step = window.innerHeight;
                for (let y = 0; y < document.body.scrollHeight; y += step) {
                    window.scrollTo(0, y);
                    await new Promise((r) => requestAnimationFrame(() => r(null)));
                }
                window.scrollTo(0, 0);
            });
            await page.waitForTimeout(800);

            // Broken images: rendered <img> that failed to decode. Skip images
            // still in flight (complete === false) to avoid false positives.
            const brokenImages = await page.evaluate(() =>
                Array.from(document.querySelectorAll("img"))
                    .filter(
                        (img) =>
                            img.currentSrc &&
                            img.complete &&
                            img.naturalWidth === 0,
                    )
                    .map((img) => img.currentSrc),
            );

            await testInfo.attach("screenshot", {
                body: await page.screenshot({ fullPage: true }),
                contentType: "image/png",
            });

            expect(pageErrors, `uncaught JS errors on ${route}`).toEqual([]);
            expect(consoleErrors, `console errors on ${route}`).toEqual([]);
            expect(failedRequests, `failed requests on ${route}`).toEqual([]);
            expect(brokenImages, `broken images on ${route}`).toEqual([]);
        });
    }
});
