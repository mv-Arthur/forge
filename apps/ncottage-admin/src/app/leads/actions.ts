"use server";

import { revalidatePath } from "next/cache";
import { apiSend } from "@/lib/api";

export async function updateLeadStatus(formData: FormData): Promise<void> {
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "");
    await apiSend("PATCH", `/leads/${id}`, { status });
    revalidatePath("/leads");
}
