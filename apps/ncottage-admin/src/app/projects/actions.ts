"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type {
    Project,
    ProjectFeature,
    ProjectLivingType,
    ProjectStyle,
    Technology,
} from "@forge/shared";
import { apiSend } from "@/lib/api";

export interface ProjectFormState {
    error?: string;
}

function lines(value: FormDataEntryValue | null): string[] {
    return String(value ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
}

function parseJsonField(value: FormDataEntryValue | null): unknown {
    const text = String(value ?? "").trim();
    if (!text) return undefined;
    return JSON.parse(text);
}

function buildProject(formData: FormData): Project {
    const optionalString = (key: string): string | undefined => {
        const v = String(formData.get(key) ?? "").trim();
        return v ? v : undefined;
    };

    return {
        slug: String(formData.get("slug") ?? "").trim(),
        name: String(formData.get("name") ?? "").trim(),
        technology: String(formData.get("technology") ?? "") as Technology,
        area: Number(formData.get("area")),
        floors: Number(formData.get("floors")),
        bedrooms: Number(formData.get("bedrooms")),
        bathrooms: Number(formData.get("bathrooms")),
        price: Number(formData.get("price")),
        image: String(formData.get("image") ?? "").trim(),
        images: lines(formData.get("images")),
        description: String(formData.get("description") ?? "").trim(),
        specs: {
            dimensions: String(formData.get("specs.dimensions") ?? "").trim(),
            roofType: String(formData.get("specs.roofType") ?? "").trim(),
            foundation: String(formData.get("specs.foundation") ?? "").trim(),
            wallMaterial: String(
                formData.get("specs.wallMaterial") ?? ""
            ).trim(),
            buildTime: String(formData.get("specs.buildTime") ?? "").trim(),
        },
        style: String(formData.get("style") ?? "") as ProjectStyle,
        features: formData.getAll("features").map(String) as ProjectFeature[],
        livingType: String(
            formData.get("livingType") ?? ""
        ) as ProjectLivingType,
        featured: formData.get("featured") === "on",
        floorPlans: parseJsonField(
            formData.get("floorPlans")
        ) as Project["floorPlans"],
        packages: parseJsonField(
            formData.get("packages")
        ) as Project["packages"],
        options: parseJsonField(formData.get("options")) as Project["options"],
        relatedObjectIds: lines(formData.get("relatedObjectIds")),
        pdfUrl: optionalString("pdfUrl"),
    };
}

export async function createProject(
    _prev: ProjectFormState,
    formData: FormData
): Promise<ProjectFormState> {
    let project: Project;
    try {
        project = buildProject(formData);
    } catch {
        return { error: "Проверьте JSON-поля (планировки/комплектации/опции)" };
    }
    const result = await apiSend("POST", "/projects", project);
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/projects");
    redirect("/projects");
}

export async function updateProject(
    slug: string,
    _prev: ProjectFormState,
    formData: FormData
): Promise<ProjectFormState> {
    let project: Project;
    try {
        project = buildProject(formData);
    } catch {
        return { error: "Проверьте JSON-поля (планировки/комплектации/опции)" };
    }
    const result = await apiSend(
        "PATCH",
        `/projects/${encodeURIComponent(slug)}`,
        project
    );
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/projects");
    redirect("/projects");
}

export async function deleteProject(formData: FormData): Promise<void> {
    const slug = String(formData.get("slug") ?? "");
    await apiSend("DELETE", `/projects/${encodeURIComponent(slug)}`);
    revalidatePath("/projects");
}
