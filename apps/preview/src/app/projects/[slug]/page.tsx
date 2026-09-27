import { notFound } from "next/navigation";
import { getProjectPage } from "@/actions/catalog/get-project";
import { listProjectSlugs } from "@/actions/catalog/list-project-slugs";
import { unwrapAction } from "@/types/action";
import { DETAIL_PACKAGE_CTA } from "@/lib/copy";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";
import { ProjectDetail } from "@/widgets/project-detail/project-detail";
import { ProjectDetailIndividual } from "@/widgets/project-detail-individual/project-detail-individual";
import { ProjectDetailSerial } from "@/widgets/project-detail-serial/project-detail-serial";

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
    const { project, similar, relatedBuilt, showcase, architectWorks, architectMore } =
        unwrapAction(await getProjectPage(slug));
    if (!project) notFound();

    if (showcase && project.projectClass === "serial") {
        return (
            <ProjectDetailSerial
                project={project}
                showcase={showcase}
                relatedBuilt={relatedBuilt}
                similar={similar.slice(0, 4)}
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
                architectWorks={architectWorks}
                architectMore={architectMore}
                leadForm={
                    <LeadFormContainer
                        source={`project-${project.slug}`}
                        prefill={`Проект: ${project.displayName}`}
                        ctaLabel={DETAIL_PACKAGE_CTA}
                        layout="unique"
                    />
                }
            />
        );
    }

    return (
        <ProjectDetail project={project} relatedBuilt={relatedBuilt} />
    );
}
