import { listListedObjects } from "@/actions/catalog/list-objects";
import { unwrapAction } from "@/types/action";
import type { Technology } from "@/types/catalog";
import { WorksCatalog } from "@/widgets/works-catalog/works-catalog";
import { VisitLauncherContainer } from "@/widgets/visit-launcher/visit-launcher.container";

export const metadata = {
    title: "Построенные дома · Новый Коттедж",
};

interface Props {
    searchParams: Promise<{ status?: string }>;
}

export default async function WorksPage({ searchParams }: Props) {
    const { status } = await searchParams;
    const { objects: all } = unwrapAction(await listListedObjects());
    const objects =
        status === "built"
            ? all.filter((o) => o.status === "built")
            : status === "in-progress"
              ? all.filter((o) => o.status === "in-progress")
              : all;
    const built = all.filter((o) => o.status === "built").length;

    const techCounts = new Map<Technology, number>();
    for (const o of objects) {
        if (!o.technology) continue;
        techCounts.set(o.technology, (techCounts.get(o.technology) ?? 0) + 1);
    }
    const techs = Array.from(techCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([t]) => t)
        .slice(0, 5);

    return (
        <WorksCatalog
            objects={objects}
            built={built}
            techs={techs}
            visit={
                <VisitLauncherContainer buttonLabel="Записаться на показ" />
            }
        />
    );
}
