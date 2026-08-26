import type { District } from "@forge/district-orgs";
import type { OutputFormat } from "./parse-cli-args.ts";

export function artifactFileName(
    district: Pick<District, "geoId" | "slug" | "citySlug">,
    format: OutputFormat,
    query: string
): string {
    const slug = sanitizeSegment(district.slug ?? district.citySlug ?? "geo");
    const queryPart = query ? `-${sanitizeSegment(query)}` : "";
    return `district-orgs-${slug}-${district.geoId}${queryPart}.${extension(format)}`;
}

function extension(format: OutputFormat): string {
    if (format === "ndjson") return "ndjson";
    if (format === "table") return "txt";
    if (format === "sheets") return "html";
    return "json";
}

function sanitizeSegment(value: string): string {
    const cleaned = value
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40);
    return cleaned || "x";
}
