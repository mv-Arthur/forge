import { notFound } from "next/navigation";
import type { Project } from "@forge/shared";
import { apiGet } from "@/lib/api";
import { updateProject } from "../actions";
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

    const action = updateProject.bind(null, slug);

    return (
        <div className="legacy-page">
            <h1>Редактирование: {project.name}</h1>
            <ProjectForm
                action={action}
                initial={project}
                submitLabel="Сохранить"
            />
        </div>
    );
}
