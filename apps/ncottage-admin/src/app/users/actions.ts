"use server";

import { revalidatePath } from "next/cache";
import type { AdminUser, Role } from "@forge/shared";
import { apiGet, apiSend } from "@/lib/api";

export async function listAdminsAction(): Promise<AdminUser[]> {
    return apiGet<AdminUser[]>("/admins");
}

export async function createAdminAction(input: {
    email: string;
    password: string;
    role: Role;
    name?: string;
}): Promise<{ error?: string }> {
    const result = await apiSend("POST", "/admins", input);
    if (!result.ok) return { error: result.error };
    revalidatePath("/users");
    return {};
}

export async function updateAdminRoleAction(
    id: string,
    role: Role
): Promise<{ error?: string }> {
    const result = await apiSend(
        "PATCH",
        `/admins/${encodeURIComponent(id)}/role`,
        { role }
    );
    if (!result.ok) return { error: result.error };
    revalidatePath("/users");
    return {};
}

export async function resetAdminPasswordAction(
    id: string,
    password: string
): Promise<{ error?: string }> {
    const result = await apiSend(
        "POST",
        `/admins/${encodeURIComponent(id)}/reset-password`,
        { password }
    );
    if (!result.ok) return { error: result.error };
    return {};
}

export async function deleteAdminAction(
    id: string
): Promise<{ error?: string }> {
    const result = await apiSend("DELETE", `/admins/${encodeURIComponent(id)}`);
    if (!result.ok) return { error: result.error };
    revalidatePath("/users");
    return {};
}
