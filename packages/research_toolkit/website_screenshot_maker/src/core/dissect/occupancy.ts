import type { Page } from "playwright";

export type Occupancy = {
    has_form: boolean;
    has_gallery: boolean;
    has_tabs: boolean;
    has_nav: boolean;
    card_bucket: "0" | "1-3" | "4+";
};

export function emptyOccupancy(): Occupancy {
    return {
        has_form: false,
        has_gallery: false,
        has_tabs: false,
        has_nav: false,
        card_bucket: "0",
    };
}

export function occupancyKey(o: Occupancy): string {
    return [
        o.has_form ? "1" : "0",
        o.has_gallery ? "1" : "0",
        o.has_tabs ? "1" : "0",
        o.has_nav ? "1" : "0",
        o.card_bucket,
    ].join(",");
}

export const SLOT_SELECTORS: Record<string, string> = {
    header: "header",
    footer: "footer",
    nav: "nav",
    form: "form",
    dialog: "[role=dialog]",
    tabs: "[role=tablist]",
    gallery: '[class*="gallery"], [data-gallery]',
};

export async function sampleOccupancy(page: Page): Promise<Occupancy> {
    return (await page.evaluate(
        new Function(`
            const vis = (sel) => {
                const els = [...document.querySelectorAll(sel)];
                return els.some((el) => {
                    const r = el.getBoundingClientRect();
                    return r.width * r.height > 1;
                });
            };
            let maxCards = 0;
            for (const parent of document.querySelectorAll("ul, ol, div, main, section")) {
                const kids = [...parent.children].filter(
                    (c) => c.tagName === "ARTICLE" || c.tagName === "LI",
                );
                if (kids.length > maxCards) maxCards = kids.length;
            }
            const card_bucket = maxCards === 0 ? "0" : maxCards <= 3 ? "1-3" : "4+";
            return {
                has_form: vis("form"),
                has_gallery: vis('[class*="gallery"], [data-gallery]'),
                has_tabs: vis("[role=tab]"),
                has_nav: vis("nav"),
                card_bucket: card_bucket,
            };
        `) as () => Occupancy,
    )) as Occupancy;
}
