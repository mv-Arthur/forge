import type { Project } from "@/domain/project";

export function pluralFloors(n: number) {
    if (n === 1) return "этаж";
    if (n >= 2 && n <= 4) return "этажа";
    return "этажей";
}

export function pluralBedrooms(n: number) {
    if (n === 1) return "спальня";
    if (n >= 2 && n <= 4) return "спальни";
    return "спален";
}

export function pluralBathrooms(n: number) {
    if (n === 1) return "санузел";
    if (n >= 2 && n <= 4) return "санузла";
    return "санузлов";
}

export function formatMonthlyMortgage(price: number, ratePct = 14, years = 20) {
    const r = ratePct / 100 / 12;
    const n = years * 12;
    const monthly = (price * r) / (1 - Math.pow(1 + r, -n));
    return Math.round(monthly / 1000) * 1000;
}

export function pickSimilarProjects(
    all: Project[],
    current: Project,
    limit = 3
): Project[] {
    const sameTech = all.filter(
        (p) => p.slug !== current.slug && p.technology === current.technology
    );
    const byArea = sameTech
        .slice()
        .sort(
            (a, b) =>
                Math.abs(a.area - current.area) -
                Math.abs(b.area - current.area)
        );
    if (byArea.length >= limit) return byArea.slice(0, limit);
    const fallback = all
        .filter(
            (p) =>
                p.slug !== current.slug &&
                !byArea.some((x) => x.slug === p.slug)
        )
        .sort(
            (a, b) =>
                Math.abs(a.area - current.area) -
                Math.abs(b.area - current.area)
        );
    return [...byArea, ...fallback].slice(0, limit);
}
