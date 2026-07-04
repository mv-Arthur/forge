"use server";

import { revalidatePath } from "next/cache";
import type { Media } from "@forge/shared";
import { apiGet, apiSend, apiUpload } from "@/lib/api";

export interface MediaListResult {
    items: Media[];
    total: number;
}

export async function listMediaAction(params?: {
    folder?: string;
    type?: string;
    take?: number;
    skip?: number;
}): Promise<MediaListResult> {
    const query = new URLSearchParams();
    if (params?.folder) query.set("folder", params.folder);
    if (params?.type) query.set("type", params.type);
    query.set("take", String(params?.take ?? 100));
    query.set("skip", String(params?.skip ?? 0));
    return apiGet<MediaListResult>(`/media?${query.toString()}`);
}

export async function uploadMediaAction(
    formData: FormData
): Promise<{ media?: Media; error?: string }> {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
        return { error: "Файл не передан" };
    }

    const forward = new FormData();
    const folder = String(formData.get("folder") ?? "").trim();
    const alt = String(formData.get("alt") ?? "").trim();
    if (folder) forward.append("folder", folder);
    if (alt) forward.append("alt", alt);
    forward.append("file", file, file.name);

    const result = await apiUpload<Media>("/media", forward);
    if (!result.ok || !result.data) {
        return { error: result.error ?? "Загрузка не выполнена" };
    }
    revalidatePath("/media");
    return { media: result.data };
}

export async function updateMediaAction(
    id: string,
    alt: string
): Promise<{ error?: string }> {
    const result = await apiSend(
        "PATCH",
        `/media/${encodeURIComponent(id)}`,
        { alt }
    );
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/media");
    return {};
}

export async function deleteMediaAction(
    id: string
): Promise<{ error?: string }> {
    const result = await apiSend("DELETE", `/media/${encodeURIComponent(id)}`);
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/media");
    return {};
}
