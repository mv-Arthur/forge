import { getToken } from "./session";

const API_URL = process.env.NCOTTAGE_API_URL ?? "http://localhost:3002";

async function authHeaders(): Promise<Record<string, string>> {
    const token = await getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        headers: await authHeaders(),
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error(`GET ${path} failed: ${res.status}`);
    }
    return res.json() as Promise<T>;
}

export interface ApiUploadResult<T> {
    ok: boolean;
    status: number;
    data?: T;
    error?: string;
}

// Multipart forward (auth header only; fetch sets the multipart boundary).
export async function apiUpload<T>(
    path: string,
    form: FormData
): Promise<ApiUploadResult<T>> {
    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: await authHeaders(),
        body: form,
        cache: "no-store",
    });
    if (res.ok) {
        return { ok: true, status: res.status, data: (await res.json()) as T };
    }
    let error = `Загрузка не выполнена (${res.status})`;
    try {
        const data: unknown = await res.json();
        if (data && typeof data === "object" && "message" in data) {
            const message = (data as { message: unknown }).message;
            error = Array.isArray(message)
                ? message.join(", ")
                : String(message);
        }
    } catch {
        // keep default
    }
    return { ok: false, status: res.status, error };
}

export interface ApiResult {
    ok: boolean;
    status: number;
    error?: string;
}

export async function apiSend(
    method: "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    body?: unknown
): Promise<ApiResult> {
    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            ...(await authHeaders()),
            ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
    });
    if (res.ok) {
        return { ok: true, status: res.status };
    }
    let error = `Запрос не выполнен (${res.status})`;
    try {
        const data: unknown = await res.json();
        if (data && typeof data === "object" && "message" in data) {
            const message = (data as { message: unknown }).message;
            error = Array.isArray(message)
                ? message.join(", ")
                : String(message);
        }
    } catch {
        // keep default
    }
    return { ok: false, status: res.status, error };
}

// Логин не требует токена и сам возвращает accessToken.
export async function apiLogin(
    email: string,
    password: string
): Promise<{ accessToken: string } | null> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<{ accessToken: string }>;
}
