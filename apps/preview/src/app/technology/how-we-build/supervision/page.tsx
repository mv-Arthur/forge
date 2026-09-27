import {
    TECH_SUPERVISION_FORM_CTA,
    TECH_SUPERVISION_LEAD,
    TECH_SUPERVISION_TITLE,
} from "@/lib/copy";
import { TechSupervision } from "@/widgets/tech-supervision/tech-supervision";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";

export const metadata = {
    title: `${TECH_SUPERVISION_TITLE} · Новый Коттедж`,
    description: TECH_SUPERVISION_LEAD,
};

export default function TechSupervisionPage() {
    return (
        <TechSupervision
            form={
                <LeadFormContainer
                    source="tech-supervision"
                    prefill={TECH_SUPERVISION_TITLE}
                    ctaLabel={TECH_SUPERVISION_FORM_CTA}
                    layout="unique"
                />
            }
        />
    );
}
