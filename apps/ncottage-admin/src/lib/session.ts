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
