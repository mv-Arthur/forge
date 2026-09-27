import { getWorksStagesHub } from "@/actions/catalog/get-works-stages-hub";
import { unwrapAction } from "@/types/action";
import { NAV_WORKS_STAGES } from "@/lib/copy";
import { HouseIcon } from "@/ui/icons";
import { VisitLauncherContainer } from "@/widgets/visit-launcher/visit-launcher.container";
import { WorksStagesHub } from "@/widgets/works-stages-hub/works-stages-hub";

export const metadata = {
    title: `${NAV_WORKS_STAGES} · Новый Коттедж`,
};

export default async function WorksStagesHubPage() {
    const { hub } = unwrapAction(await getWorksStagesHub());
    return (
        <WorksStagesHub
            payload={hub}
            visitCta={
                <VisitLauncherContainer
                    source="works-stages-hub-visit"
                    buttonLabel={hub.visit.ctaLabel}
                >
                    <HouseIcon />
                </VisitLauncherContainer>
            }
        />
    );
}
