import { bedroomsWord } from "./format";

type Floors = "1" | "1.5" | "2" | "mansard";

export function humanizeDisplayName(
    name: string,
    dimensions: string | null,
    area: number | null,
): string {
    let n = name.replace(/\s+/g, " ").trim();
    n = n.replace(/^проект\s+/i, "").trim();
    const houseDim = n.match(
        /^дома?\s+([\d.,]+\s*[xх×]\s*[\d.,]+)(?:\s*метров)?$/i,
    );
    if (houseDim?.[1]) {
        return `Дом ${houseDim[1].replace(/[xх]/gi, "×")}`;
    }
    if (!n) {
        if (dimensions) return `Дом ${dimensions}`;
        if (area) return `Дом ${area} м²`;
        return "Готовый дом";
    }
    const afterDim = n.match(/^[\d.,]+\s*[xх×]\s*[\d.,]+\s+(.+)$/i);
    if (afterDim?.[1]?.trim()) {
        const rest = afterDim[1].trim().replace(/^проект\s+/i, "");
        if (/[A-Za-zА-Яа-яЁё]{3,}/.test(rest)) return rest;
    }
    const dimOnly =
        /^[\d.,]+\s*[xх×]\s*[\d.,]+\s*$/i.test(n) ||
        (/^[\d.,]+\s*[xх×]\s*[\d.,]+/i.test(n) &&
            !/[A-Za-zА-Яа-яЁё]{3,}/.test(n.replace(/[\d.,\sxх×]/gi, "")));
    if (dimOnly) {
        if (dimensions) return `Дом ${dimensions}`;
        if (area) return `Дом ${area} м²`;
        return `Дом ${n}`;
    }
    return n;
}

export function buildSubtitle(project: {
    floors: Floors | null;
    area: number | null;
    bedrooms: number | null;
    dimensions: string | null;
}): string {
    const bits: string[] = [];
    if (project.floors === "1") bits.push("1 этаж");
    else if (project.floors === "2") bits.push("2 этажа");
    else if (project.floors === "1.5") bits.push("1,5 этажа");
    else if (project.floors === "mansard") bits.push("мансарда");
    if (project.area != null && project.area > 0) {
        bits.push(`${project.area} м²`);
    }
    if (project.bedrooms != null && project.bedrooms > 0) {
        bits.push(
            `${project.bedrooms} ${bedroomsWord(project.bedrooms)}`,
        );
    }
    if (project.dimensions) bits.push(project.dimensions);
    return bits.join(" · ") || "Готовый проект";
}

export function inferLocationFromTitle(title: string): string | null {
    const m = title.match(/\s+в\s+(.+)$/i);
    if (!m?.[1]) return null;
    let loc = m[1].trim().replace(/\s+/g, " ");
    loc = loc.replace(/^п\.\s*/i, "пос. ");
    loc = loc.replace(/^дер\.\s*/i, "дер. ");
    return loc || null;
}

export function humanObjectTitle(
    title: string,
    locationLabel: string | null,
    status: "built" | "in-progress",
): string {
    const loc = locationLabel || inferLocationFromTitle(title);
    if (loc) {
        return status === "in-progress" ? `Строим в ${loc}` : `Дом в ${loc}`;
    }
    let t = title.replace(/^СТРОИТСЯ\s*-\s*/i, "").trim();
    t = t.replace(/^проект\s+/i, "").trim();
    t = t.replace(
        /^дом из\s+(газобетона|кирпича|сип(?:-?\s*панелей)?|каркаса)\s*/i,
        "",
    );
    t = t.replace(/^каркасный дом\s*/i, "");
    t = t.replace(/\s+в\s+.+$/i, "").trim();
    if (!t) {
        return status === "in-progress"
            ? "Строящийся дом"
            : "Построенный дом";
    }
    const lower = t.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function stripTechFromName(name: string): string {
    return name
        .replace(/^каркасный\s+/i, "")
        .replace(/^газобетонный\s+/i, "")
        .replace(/^кирпичный\s+/i, "")
        .replace(/^сип-?/i, "")
        .replace(/^фахверковый\s+/i, "")
        .replace(/^дом\s+/i, "")
        .replace(/^проект\s+/i, "")
        .replace(/\s*из\s+кирпича\s*/gi, " ")
        .replace(/\s*из\s+газобетона\s*/gi, " ")
        .replace(/\s*из\s+сип(?:-|\s)?панелей\s*/gi, " ")
        .replace(/\s*из\s+сип\s*/gi, " ")
        .replace(/\s*каркасн(?:ый|ого|ые)?\s*/gi, " ")
        .replace(/\s*фахверков(?:ый|ого|ые)?\s*/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function pickBetterName(a: string, b: string): string {
    const sa = stripTechFromName(a);
    const sb = stripTechFromName(b);
    if (sa.length > 0 && sa.length < a.length) return sa;
    if (sb.length > 0 && sb.length < b.length) return sb;
    const ca = sa || a;
    const cb = sb || b;
    return ca.length <= cb.length ? ca : cb;
}

export function hasUsablePhoto(
    src: string | null | undefined,
): src is string {
    return typeof src === "string" && src.trim().length > 0;
}
