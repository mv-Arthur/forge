import { notFound } from "next/navigation";
import type { Project } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { ProjectForm } from "../ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await apiGet<Project>(
        `/projects/${encodeURIComponent(slug)}`
    ).catch(() => undefined);
    if (!project) notFound();

    return (
        <div>
            <PageHeader
                title={project.name}
                description={`Редактирование проекта · ${project.slug}`}
            />
            <ProjectForm initial={project} submitLabel="Сохранить" />
        </div>
    );
}
