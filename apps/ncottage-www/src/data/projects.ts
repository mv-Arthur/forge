import type { Project } from "@/domain/project";

// Проекты приходят из backend ncottage-api. NCOTTAGE_API_URL — server-only.
// ISR: ответы кешируются на REVALIDATE секунд и перегенерируются в фоне,
// поэтому публичный сайт не зависит от аптайма API на каждый запрос.
const API_URL = process.env.NCOTTAGE_API_URL;
const REVALIDATE = 60;

async function fetchProjects(query = ""): Promise<Project[]> {
    if (!API_URL) return [];
    const res = await fetch(`${API_URL}/projects${query}`, {
        next: { revalidate: REVALIDATE },
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch projects: ${res.status}`);
    }
    return res.json() as Promise<Project[]>;
}

export async function getProjects(): Promise<Project[]> {
    return fetchProjects();
}

export async function getFeaturedProjects(): Promise<Project[]> {
    return fetchProjects("?featured=true");
}

export async function getProjectBySlug(
    slug: string
): Promise<Project | undefined> {
    if (!API_URL) return undefined;
    const res = await fetch(
        `${API_URL}/projects/${encodeURIComponent(slug)}`,
        { next: { revalidate: REVALIDATE } }
    );
    if (res.status === 404) return undefined;
    if (!res.ok) {
        throw new Error(`Failed to fetch project ${slug}: ${res.status}`);
    }
    return res.json() as Promise<Project>;
}
