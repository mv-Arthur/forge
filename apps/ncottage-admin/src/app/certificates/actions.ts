"use server";

import { revalidatePath } from "next/cache";
import type { Certificate } from "@forge/shared";
import { apiSend } from "@/lib/api";

export interface CertificateActionResult {
    error?: string;
}

export async function saveCertificateAction(
    slug: string | null,
    certificate: Certificate
): Promise<CertificateActionResult> {
    const result = slug
        ? await apiSend(
              "PATCH",
              `/certificates/${encodeURIComponent(slug)}`,
              certificate
          )
        : await apiSend("POST", "/certificates", certificate);
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/certificates");
    return {};
}

export async function deleteCertificateAction(
    slug: string
): Promise<CertificateActionResult> {
    const result = await apiSend(
        "DELETE",
        `/certificates/${encodeURIComponent(slug)}`
    );
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/certificates");
    return {};
}
