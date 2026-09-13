import { notFound } from "next/navigation";
import { getProjectPage } from "@/actions/catalog/get-project";
import { listProjectSlugs } from "@/actions/catalog/list-project-slugs";
import { unwrapAction } from "@/types/action";
import { DETAIL_CTA_PRICE } from "@/lib/copy";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";
import { ProjectCarouselContainer } from "@/widgets/project-carousel/project-carousel.container";
import { ProjectDetail } from "@/widgets/project-detail/project-detail";
import { ProjectDetailIndividual } from "@/widgets/project-detail-individual/project-detail-individual";
import { ProjectDetailSerial } from "@/widgets/project-detail-serial/project-detail-serial";
import { VisitLauncherContainer } from "@/widgets/visit-launcher/visit-launcher.container";

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
    const { project, similar, relatedBuilt, showcase } = unwrapAction(
        await getProjectPage(slug),
    );
    if (!project) notFound();

    const leadForm = (
        <LeadFormContainer
            source={`project-${project.slug}`}
            prefill={`Проект: ${project.displayName}`}
        />
    );
    const similarCarousel =
        similar.length > 0 ? (
            <ProjectCarouselContainer projects={similar} />
        ) : null;

    if (showcase && project.projectClass === "serial") {
        return (
            <ProjectDetailSerial
                project={project}
                showcase={showcase}
                similar={similar}
                relatedBuilt={relatedBuilt}
                leadForm={leadForm}
                similarCarousel={similarCarousel}
                startVisit={
                    <VisitLauncherContainer buttonLabel="Записаться на просмотр" />
                }
                startQuote={
                    <a href="#detail-lead" className="btn btn-primary">
                        {DETAIL_CTA_PRICE}
                    </a>
                }
            />
        );
    }

    if (
        showcase &&
        (project.projectClass === "individual" ||
            project.projectClass === "bath")
    ) {
        return (
            <ProjectDetailIndividual
                project={project}
                showcase={showcase}
                similar={similar}
                relatedBuilt={relatedBuilt}
                leadForm={leadForm}
                similarCarousel={similarCarousel}
            />
        );
    }

    return (
        <ProjectDetail
            project={project}
            similar={similar}
            relatedBuilt={relatedBuilt}
            leadForm={leadForm}
            similarCarousel={similarCarousel}
            startVisit={
                <VisitLauncherContainer buttonLabel="Записаться на просмотр" />
            }
            startQuote={
                <a href="#detail-lead" className="btn btn-primary">
                    {DETAIL_CTA_PRICE}
                </a>
            }
        />
    );
}
