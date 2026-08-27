import { notFound } from "next/navigation";
import { getProjectPage } from "@/actions/catalog/get-project";
import { listProjectSlugs } from "@/actions/catalog/list-project-slugs";
import { unwrapAction } from "@/types/action";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";
import { ProjectCarouselContainer } from "@/widgets/project-carousel/project-carousel.container";
import { ProjectDetail } from "@/widgets/project-detail/project-detail";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const { slugs } = unwrapAction(await listProjectSlugs());
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const { project } = unwrapAction(await getProjectPage(slug));
    return {
        title: project
            ? `${project.displayName} · ${project.subtitle} · Новый Коттедж`
            : "Проект не найден",
    };
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const { project, similar, relatedBuilt } = unwrapAction(
        await getProjectPage(slug),
    );
    if (!project) notFound();

    return (
        <ProjectDetail
            project={project}
            similar={similar}
            relatedBuilt={relatedBuilt}
            leadForm={
                <LeadFormContainer
                    source={`project-${project.slug}`}
                    prefill={`Проект: ${project.displayName}`}
                />
            }
            similarCarousel={
                similar.length > 0 ? (
                    <ProjectCarouselContainer projects={similar} />
                ) : null
            }
        />
    );
}
