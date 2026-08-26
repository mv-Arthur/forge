import { type Browser, type BrowserContext, type Page } from "playwright";
import type { Device } from "../../device/index.js";

export const DEFAULT_UA =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export function skipReason(httpStatus: number | null, contentType: string): string | null {
    if (httpStatus && httpStatus >= 400) return `http_${httpStatus}`;
    const ct = contentType.split(";")[0].trim();
    if (ct && !ct.includes("text/html") && !ct.includes("application/xhtml")) {
        return `content_type_${ct}`;
    }
    return null;
}

export async function dismissCookies(page: Page): Promise<boolean> {
    const selectors = [
        'button:has-text("Понятно")',
        'button:has-text("Принять")',
        'button:has-text("Согласен")',
        'button:has-text("Accept")',
        'button:has-text("OK")',
        '[class*="cookie"] button',
        ".cookie-accept",
    ];
    for (const sel of selectors) {
        try {
            const el = page.locator(sel).first();
            if (await el.isVisible({ timeout: 800 })) {
                await el.click({ timeout: 1000 });
                await page.waitForTimeout(300);
                return true;
            }
        } catch {
            /* ignore */
        }
    }
    return false;
}

export async function settleLazy(page: Page): Promise<void> {
    try {
        await page.evaluate(async () => {
            await new Promise<void>((r) => {
                let y = 0;
                const step = () => {
                    const h = document.documentElement.scrollHeight;
                    y += Math.min(800, h);
                    window.scrollTo(0, y);
                    if (y < h) requestAnimationFrame(step);
                    else {
                        window.scrollTo(0, 0);
                        r();
                    }
                };
                step();
            });
        });
        await page.waitForTimeout(400);
    } catch {
        /* ignore scroll settle */
    }
}

export type Visit = {
    page: Page;
    context: BrowserContext;
    skip: string | null;
    httpStatus: number | null;
    close: () => Promise<void>;
};

export async function visitPage(
    browser: Browser,
    url: string,
    device: Device,
    opts: { navTimeout: number; locale: string },
): Promise<Visit> {
    const context = await browser.newContext({
        viewport: { width: device.width, height: device.height },
        deviceScaleFactor: device.deviceScaleFactor,
        isMobile: device.isMobile,
        locale: opts.locale,
        userAgent: device.userAgent ?? DEFAULT_UA,
    });
    const page = await context.newPage();
    const close = async () => {
        await context.close();
    };
    try {
        const resp = await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: opts.navTimeout,
        });
        const httpStatus = resp ? resp.status() : null;
        const skip = skipReason(httpStatus, resp?.headers()?.["content-type"] || "");
        if (!skip) {
            await dismissCookies(page);
            await page.waitForTimeout(600);
            await settleLazy(page);
        }
        return { page, context, skip, httpStatus, close };
    } catch (e) {
        await close();
        throw e;
    }
}
