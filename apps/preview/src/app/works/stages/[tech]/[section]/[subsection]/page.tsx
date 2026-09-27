import { notFound } from "next/navigation";
import {
    getWorksStage,
    listWorksStagePaths,
} from "@/actions/catalog/get-works-stage";
import { unwrapAction } from "@/types/action";
import { isServiceSubsectionTitle } from "@/lib/worksStages";
import { WorksStagesContainer } from "@/widgets/works-stages/works-stages.container";

interface Props {
    params: Promise<{ tech: string; section: string; subsection: string }>;
}

export async function generateStaticParams() {
    const { paths } = unwrapAction(await listWorksStagePaths());
    return paths;
}

export async function generateMetadata({ params }: Props) {
    const { tech, section, subsection } = await params;
    const { stage } = unwrapAction(
        await getWorksStage(tech, section, subsection),
    );
    if (!stage) {
        return { title: "Этап не найден" };
    }
    const leaf = isServiceSubsectionTitle(stage.subsectionTitle)
        ? stage.sectionTitle
        : stage.subsectionTitle;
    return {
        title: `${leaf} · ${stage.techTitle} · Новый Коттедж`,
    };
}

export default async function WorksStagePage({ params }: Props) {
    const { tech, section, subsection } = await params;
    const { stage } = unwrapAction(
        await getWorksStage(tech, section, subsection),
    );
    if (!stage) notFound();
    return <WorksStagesContainer payload={stage} />;
}
