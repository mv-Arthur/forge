import type { Organization } from "./types.ts";

export function matchesBlacklist(
    org: Organization,
    patterns: string[]
): boolean {
    const needles = patterns
        .map((pattern) => pattern.trim().toLowerCase())
        .filter(Boolean);
    if (needles.length === 0) return false;
    const haystack = [org.title, ...org.categories].join("\n").toLowerCase();
    return needles.some((needle) => haystack.includes(needle));
}

export function applyBlacklist(
    organizations: Organization[],
    patterns: string[]
): Organization[] {
    if (patterns.length === 0) return organizations;
    return organizations.filter((org) => !matchesBlacklist(org, patterns));
}
