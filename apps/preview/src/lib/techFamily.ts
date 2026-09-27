import type { Technology } from "@/types/catalog";

export type TechFamily = "wood" | "stone";

export const TECH_FAMILY_TECHS: Record<TechFamily, Technology[]> = {
    wood: ["frame", "sip", "fachwerk"],
    stone: ["gas_concrete", "brick"],
};

const ALL_TECH: Technology[] = [
    "gas_concrete",
    "brick",
    "frame",
    "sip",
    "fachwerk",
];

export function isTechFamily(value: string): value is TechFamily {
    return value === "wood" || value === "stone";
}

export function isCatalogTechnology(value: string): value is Technology {
    return (ALL_TECH as string[]).includes(value);
}

export function techsForFamily(family: TechFamily): Technology[] {
    return TECH_FAMILY_TECHS[family];
}

export function projectInFamily(
    project: { technologies: string[] },
    family: TechFamily
): boolean {
    const set = TECH_FAMILY_TECHS[family];
    return project.technologies.some((tech) =>
        set.includes(tech as Technology)
    );
}

export function parseCatalogTechs(raw: string | null): Technology[] {
    if (!raw) return [];
    const out: Technology[] = [];
    const seen = new Set<Technology>();
    for (const part of raw.split(",")) {
        const value = part.trim();
        if (!value) continue;
        if (isTechFamily(value)) {
            for (const tech of TECH_FAMILY_TECHS[value]) {
                if (!seen.has(tech)) {
                    seen.add(tech);
                    out.push(tech);
                }
            }
            continue;
        }
        if (isCatalogTechnology(value) && !seen.has(value)) {
            seen.add(value);
            out.push(value);
        }
    }
    return out;
}

export function worksGroupForFamily(family: TechFamily): "frame" | "stone" {
    return family === "wood" ? "frame" : "stone";
}
