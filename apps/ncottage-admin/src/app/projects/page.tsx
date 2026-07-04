import Link from "next/link";
import { Plus } from "lucide-react";
import type { Project } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { ProjectsTable } from "./ProjectsTable";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
    const projects = await apiGet<Project[]>("/projects");

    return (
        <div>
            <PageHeader
                title="Проекты"
                description={`Всего: ${projects.length}`}
                action={
                    <Button asChild>
                        <Link href="/projects/new">
                            <Plus className="size-4" />
                            Новый проект
                        </Link>
                    </Button>
                }
            />
            <ProjectsTable data={projects} />
        </div>
    );
}
