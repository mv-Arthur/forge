import { readJobId, readJobIdFromPath } from "../../src/job-id.ts";

const STORAGE = "district-orgs-web.job";

export function rememberJob(id: string): void {
    sessionStorage.setItem(STORAGE, id);
}

export function recallJob(): string | null {
    return (
        readJobIdFromPath(location.pathname) ??
        readJobId(location.search) ??
        sessionStorage.getItem(STORAGE)
    );
}

export function forgetJob(): void {
    sessionStorage.removeItem(STORAGE);
}
