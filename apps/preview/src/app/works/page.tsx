import { listListedObjects } from "@/actions/catalog/list-objects";
import { unwrapAction } from "@/types/action";
import { WorksCatalog } from "@/widgets/works-catalog/works-catalog";
import { VisitLauncherContainer } from "@/widgets/visit-launcher/visit-launcher.container";

export const metadata = {
    title: "Фотогалерея · Новый Коттедж",
};

export default async function WorksPage() {
    const { objects } = unwrapAction(await listListedObjects());

    return (
        <WorksCatalog
            objects={objects}
            visit={
                <VisitLauncherContainer buttonLabel="Записаться на показ" />
            }
        />
    );
}
