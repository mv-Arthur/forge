import { getToken, notifyAuthLost, setToken } from "./session";

export interface MediaItem {
    id: string;
    key: string;
    url: string;
    filename: string;
    mime: string;
    size: number;
    width?: number;
    height?: number;
    alt?: string;
    folder?: string;
    createdAt: string;
    updatedAt: string;
}

export interface FolderRow {
    path: string;
    count: number;
}

export interface ListMediaResult {
    items: MediaItem[];
    total: number;
}

export interface AuthUser {
    id: string;
    email: string;
    name?: string;
}

export interface AuthSession {
    accessToken: string;
    user: AuthUser;
}

async function parseError(res: Response): Promise<string> {
    try {
        const body = (await res.json()) as { message?: string | string[] };
        if (Array.isArray(body.message)) return body.message.join(", ");
        if (typeof body.message === "string") return body.message;
    } catch {
        // fall through
    }
    return res.statusText || "Ошибка запроса";
}

function authHeaders(): HeadersInit {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
    path: string,
    init: RequestInit = {},
    withAuth = true
): Promise<T> {
    const headers = new Headers(init.headers);
    if (withAuth) {
        const token = getToken();
        if (token) headers.set("Authorization", `Bearer ${token}`);
    }
    const res = await fetch(path, { ...init, headers });
    if (res.status === 401) {
        setToken(null);
        notifyAuthLost();
        throw new Error("Нужно войти");
    }
    if (res.status === 204) return undefined as T;
    if (!res.ok) throw new Error(await parseError(res));
    return (await res.json()) as T;
}

export function login(email: string, password: string): Promise<AuthSession> {
    return request(
        "/api/auth/login",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        },
        false
    );
}

export function fetchSetup(): Promise<{ needsSetup: boolean }> {
    return request("/api/auth/setup", undefined, false);
}

export function setupFirstUser(input: {
    email: string;
    password: string;
    name?: string;
}): Promise<AuthSession> {
    return request(
        "/api/auth/setup",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        },
        false
    );
}

export function fetchMe(): Promise<AuthUser> {
    return request("/api/auth/me");
}

export async function fetchFileObjectUrl(key: string): Promise<string> {
    const res = await fetch(`/api/files?key=${encodeURIComponent(key)}`, {
        headers: authHeaders(),
    });
    if (res.status === 401) {
        setToken(null);
        notifyAuthLost();
        throw new Error("Нужно войти");
    }
    if (!res.ok) throw new Error(await parseError(res));
    const blob = await res.blob();
    return URL.createObjectURL(blob);
}

export function listMedia(params: {
    folder?: string;
    q?: string;
    skip?: number;
    take?: number;
}): Promise<ListMediaResult> {
    const sp = new URLSearchParams();
    if (params.folder !== undefined) sp.set("folder", params.folder);
    if (params.q) sp.set("q", params.q);
    if (params.skip) sp.set("skip", String(params.skip));
    if (params.take) sp.set("take", String(params.take));
    const q = sp.toString();
    return request(`/api/media${q ? `?${q}` : ""}`);
}

export function listFolders(): Promise<FolderRow[]> {
    return request<{ path: string; count: number }[]>("/api/media/folders");
}

export function uploadMedia(file: File, folder?: string): Promise<MediaItem> {
    const body = new FormData();
    body.append("file", file, file.name);
    if (folder) body.append("folder", folder);
    return request("/api/media", { method: "POST", body });
}

export function updateMedia(
    id: string,
    patch: { alt?: string; folder?: string; filename?: string }
): Promise<MediaItem> {
    return request(`/api/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
    });
}

export function deleteMedia(id: string): Promise<void> {
    return request(`/api/media/${id}`, { method: "DELETE" });
}

export interface HomeSlotRow {
    slot: string;
    label: string;
    cluster?: string;
    media: MediaItem | null;
}

export interface HomeGroup {
    group: string;
    slots: HomeSlotRow[];
}

export interface HomePagePayload {
    slots: Record<
        string,
        { url: string; key: string; alt?: string; id: string } | null
    >;
    groups: HomeGroup[];
}

export function fetchHomePage(): Promise<HomePagePayload> {
    return request("/api/pages/home");
}

export function assignHomeSlot(
    slot: string,
    mediaId: string
): Promise<HomePagePayload> {
    return request(`/api/pages/home/${encodeURIComponent(slot)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId }),
    });
}

export function clearHomeSlot(slot: string): Promise<HomePagePayload> {
    return request(`/api/pages/home/${encodeURIComponent(slot)}`, {
        method: "DELETE",
    });
}
