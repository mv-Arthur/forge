import { Suspense } from "react";
import { listCatalogProjects } from "@/actions/catalog/list-projects";
import { unwrapAction } from "@/types/action";
import { CATALOG_LOADING } from "@/lib/copy";
import { ProjectsCatalog } from "@/widgets/projects-catalog/projects-catalog";
import { ProjectsCatalogContainer } from "@/widgets/projects-catalog/projects-catalog.container";

export const metadata = {
    title: `Готовые проекты · Новый Коттедж`,
};

export default async function ProjectsPage() {
    const { projects, techs, stats } = unwrapAction(
        await listCatalogProjects(),
    );

    return (
        <ProjectsCatalog
            projects={projects}
            techs={techs}
            stats={stats}
            filters={
                <Suspense
                    fallback={
                        <div className="py-12 text-center text-ink-500">
                            {CATALOG_LOADING}
                        </div>
                    }
                >
                    <ProjectsCatalogContainer
                        projects={projects}
                        bounds={{
                            maxArea: stats.maxArea,
                            maxPrice: stats.maxPrice,
                        }}
                    />
                </Suspense>
            }
        />
    );
}
