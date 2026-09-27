import { notFound, redirect } from "next/navigation";
import { getWorksStageIndex } from "@/actions/catalog/get-works-stage";
import { unwrapAction } from "@/types/action";

interface Props {
    params: Promise<{ tech: string }>;
}

export default async function WorksStageIndexPage({ params }: Props) {
    const { tech } = await params;
    const { href } = unwrapAction(await getWorksStageIndex(tech));
    if (!href) notFound();
    redirect(href);
}
