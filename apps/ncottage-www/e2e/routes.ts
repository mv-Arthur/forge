import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appDir = join(here, "..", "src", "app");

// Recursively collect routes that have a page.tsx, skipping dynamic segments
// (handled by explicit samples below) and Next.js route groups `(group)`.
function collectStaticRoutes(dir: string, base = ""): string[] {
    const routes: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const name = entry.name;
        if (
            name.startsWith("[") ||
            name.startsWith("_") ||
            name.startsWith(".")
        ) {
            continue;
        }
        const childDir = join(dir, name);
        // Route groups don't add a path segment.
        const segment = name.startsWith("(") ? base : `${base}/${name}`;
        const hasPage = readdirSync(childDir).some(
            (f) => f === "page.tsx" || f === "page.ts"
        );
        if (hasPage && !name.startsWith("(")) routes.push(segment);
        routes.push(...collectStaticRoutes(childDir, segment));
    }
    return routes;
}

// One representative sample per dynamic segment keeps the crawl meaningful
// without exploding into every slug. Sourced from src/app/**/*.ts data files.
const dynamicRoutes = [
    "/project/nord",
    "/project/alaster",
    "/projects/all",
    "/projects/gas-concrete",
    "/projects/brick",
    "/projects/frame",
    "/projects/sip",
    "/projects/fachwerk",
    "/services/design",
    "/services/construction",
    "/services/foundations",
    "/services/engineering",
    "/services/finishing",
    "/services/baths",
    "/services/commercial",
    "/services/landscaping",
    "/project-selections/zagorodnye-doma",
    "/project-selections/odnoetazhnye-doma",
    "/promos/frame-houses-special-price",
    "/promos/gas-concrete-houses-special-price",
    "/blog/kak-vybrat-tehnologiyu-doma",
    "/blog/etapy-stroitelstva-doma",
];

export const routes: string[] = [
    ...new Set(["/", ...collectStaticRoutes(appDir), ...dynamicRoutes]),
].sort();
