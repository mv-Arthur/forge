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
    title: `${CONSTRUCTION_TITLE.stone} · Новый Коттедж`,
    description: CONSTRUCTION_LEAD.stone,
};

export default async function ConstructionStonePage() {
    const { hub } = unwrapAction(await getConstructionHub("stone"));

    return (
        <ConstructionHub
            payload={hub}
            serial={<ProjectCarouselContainer projects={hub.serial} />}
            form={
                <LeadFormContainer
                    source="construction-stone"
                    prefill={CONSTRUCTION_TITLE.stone}
                    ctaLabel={CONSTRUCTION_FORM_CTA}
                    layout="unique"
                />
            }
        />
    );
}
