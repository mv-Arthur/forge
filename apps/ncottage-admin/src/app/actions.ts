"use server";

import { redirect } from "next/navigation";
import { apiLogin } from "@/lib/api";
import { clearToken, setToken } from "@/lib/session";

export interface LoginState {
    error?: string;
}

export async function loginAction(
    _prev: LoginState,
    formData: FormData
): Promise<LoginState> {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const result = await apiLogin(email, password);
    if (!result) {
        return { error: "Неверный email или пароль" };
    }
    await setToken(result.accessToken);
    redirect("/projects");
}

export async function logoutAction(): Promise<void> {
    await clearToken();
    redirect("/login");
}
