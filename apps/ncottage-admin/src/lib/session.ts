import { cookies } from "next/headers";

export const TOKEN_COOKIE = "admin_token";

export async function getToken(): Promise<string | undefined> {
    const store = await cookies();
    return store.get(TOKEN_COOKIE)?.value;
}

export async function setToken(token: string): Promise<void> {
    const store = await cookies();
    store.set(TOKEN_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 12,
    });
}

export async function clearToken(): Promise<void> {
    const store = await cookies();
    store.delete(TOKEN_COOKIE);
}

export interface CurrentAdmin {
    id: string;
    email: string;
    role?: string;
}

// Decode the JWT payload for display only (the signature is verified by the API).
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
    const token = await getToken();
    if (!token) return null;
    const payload = token.split(".")[1];
    if (!payload) return null;
    try {
        const json = Buffer.from(payload, "base64url").toString("utf8");
        const data = JSON.parse(json) as {
            sub?: string;
            email?: string;
            role?: string;
        };
        if (!data.email) return null;
        return { id: data.sub ?? "", email: data.email, role: data.role };
    } catch {
        return null;
    }
}
