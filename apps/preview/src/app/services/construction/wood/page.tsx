import { getConstructionHub } from "@/actions/services/get-construction-hub";
import {
    CONSTRUCTION_FORM_CTA,
    CONSTRUCTION_LEAD,
    CONSTRUCTION_TITLE,
} from "@/lib/copy";
import { unwrapAction } from "@/types/action";
import { ConstructionHub } from "@/widgets/construction-hub/construction-hub";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";
import { ProjectCarouselContainer } from "@/widgets/project-carousel/project-carousel.container";

export const metadata = {
    title: `${CONSTRUCTION_TITLE.wood} · Новый Коттедж`,
    description: CONSTRUCTION_LEAD.wood,
};

export default async function ConstructionWoodPage() {
    const { hub } = unwrapAction(await getConstructionHub("wood"));

    return (
        <ConstructionHub
            payload={hub}
            serial={<ProjectCarouselContainer projects={hub.serial} />}
            form={
                <LeadFormContainer
                    source="construction-wood"
                    prefill={CONSTRUCTION_TITLE.wood}
                    ctaLabel={CONSTRUCTION_FORM_CTA}
                    layout="unique"
                />
            }
        />
    );
}
