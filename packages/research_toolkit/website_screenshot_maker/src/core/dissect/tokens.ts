import type { Page } from "playwright";

export type TokenSet = {
    colors: string[];
    fonts: string[];
    radii: string[];
    shadows: string[];
};

export function emptyTokens(): TokenSet {
    return { colors: [], fonts: [], radii: [], shadows: [] };
}

function dropJunk(v: string): boolean {
    const s = v.trim().toLowerCase();
    if (!s || s === "none" || s === "transparent" || s === "0px") return false;
    if (s === "rgba(0, 0, 0, 0)" || s === "rgba(0,0,0,0)") return false;
    return true;
}

function uniq(xs: string[]): string[] {
    return [...new Set(xs.filter(dropJunk))];
}

const SAMPLE_SRC = `const sels = arg.sels;
const nodes = [];
for (const s of sels) {
    try { nodes.push(...document.querySelectorAll(s)); } catch (e) {}
}
const colors = [];
const fonts = [];
const radii = [];
const shadows = [];
for (const el of nodes) {
    const st = getComputedStyle(el);
    colors.push(st.color, st.backgroundColor, st.borderColor);
    fonts.push([st.fontFamily, st.fontSize, st.fontWeight, st.lineHeight].join("|"));
    radii.push(st.borderRadius);
    shadows.push(st.boxShadow);
}
return { colors, fonts, radii, shadows };`;

/** export function sampleTokens */
export async function sampleTokens(
    page: Page,
    widgetSelectors: string[] = [],
): Promise<TokenSet> {
    const sels = [
        ":root",
        "html",
        "body",
        "h1",
        "h2",
        "header",
        "footer",
        "button",
        "a",
        "input",
        ...widgetSelectors,
    ];
    const raw = (await page.evaluate(
        new Function("arg", SAMPLE_SRC) as (arg: { sels: string[] }) => TokenSet,
        { sels },
    )) as TokenSet;
    return {
        colors: uniq(raw.colors),
        fonts: uniq(raw.fonts),
        radii: uniq(raw.radii),
        shadows: uniq(raw.shadows),
    };
}

export function mergeTokens(parts: TokenSet[]): TokenSet {
    return {
        colors: uniq(parts.flatMap((p) => p.colors)),
        fonts: uniq(parts.flatMap((p) => p.fonts)),
        radii: uniq(parts.flatMap((p) => p.radii)),
        shadows: uniq(parts.flatMap((p) => p.shadows)),
    };
}
