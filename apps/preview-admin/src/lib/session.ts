export const TOKEN_KEY = "preview-admin-token";
export const AUTH_LOST = "preview-auth-lost";

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
}

export function notifyAuthLost(): void {
    window.dispatchEvent(new Event(AUTH_LOST));
}
