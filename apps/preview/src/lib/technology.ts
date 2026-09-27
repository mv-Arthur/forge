import type { Technology } from "@/types/catalog";

export const TECH_DISPLAY_ORDER: Technology[] = [
    "gas_concrete",
    "brick",
    "frame",
    "sip",
    "fachwerk",
];

export function sortTechnologies(
    techs: Technology[],
    primary?: Technology | null
): Technology[] {
    const unique = [...new Set(techs)];
    return unique.sort((a, b) => {
        if (primary && a === primary) return -1;
        if (primary && b === primary) return 1;
        return TECH_DISPLAY_ORDER.indexOf(a) - TECH_DISPLAY_ORDER.indexOf(b);
    });
}

export function sortByTechnology<T extends { technology: Technology }>(
    items: T[],
    primary?: Technology | null
): T[] {
    return [...items].sort((a, b) => {
        if (primary && a.technology === primary) return -1;
        if (primary && b.technology === primary) return 1;
        return (
            TECH_DISPLAY_ORDER.indexOf(a.technology) -
            TECH_DISPLAY_ORDER.indexOf(b.technology)
        );
    });
}
