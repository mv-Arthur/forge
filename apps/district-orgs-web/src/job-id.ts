import { parseRoute } from "./route.ts";

export const JOB_QUERY = "job";

export function readJobId(search: string): string | null {
    const value = new URLSearchParams(search.replace(/^\?/, "")).get(JOB_QUERY);
    const id = value?.trim() ?? "";
    return id || null;
}

export function readJobIdFromPath(pathname: string): string | null {
    const route = parseRoute(pathname);
    return route.name === "job" ? route.id : null;
}

export function writeJobId(href: string, id: string): string {
    const url = new URL(href, "https://local.invalid");
    url.searchParams.set(JOB_QUERY, id);
    return `${url.pathname}${url.search}${url.hash}`;
}

export function dropJobId(href: string): string {
    const url = new URL(href, "https://local.invalid");
    url.searchParams.delete(JOB_QUERY);
    return `${url.pathname}${url.search}${url.hash}`;
}
