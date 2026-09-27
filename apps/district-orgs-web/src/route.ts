export type AppRoute =
    | { name: "home" }
    | { name: "history" }
    | { name: "job"; id: string };

export function parseRoute(pathname: string): AppRoute {
    const path = pathname.replace(/\/+$/, "") || "/";
    if (path === "/history") return { name: "history" };
    const job = path.match(/^\/jobs\/([^/]+)$/);
    if (job?.[1]) {
        try {
            return { name: "job", id: decodeURIComponent(job[1]) };
        } catch {
            return { name: "home" };
        }
    }
    return { name: "home" };
}

export function jobPath(id: string): string {
    return `/jobs/${encodeURIComponent(id)}`;
}
