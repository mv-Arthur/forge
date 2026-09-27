import { TECH_FAQ_FORM_CTA, TECH_FAQ_LEAD, TECH_FAQ_TITLE } from "@/lib/copy";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";
import { TechFaq } from "@/widgets/tech-faq/tech-faq";

export const metadata = {
    title: `${TECH_FAQ_TITLE} · Новый Коттедж`,
    description: TECH_FAQ_LEAD,
};

export default function TechnologyFaqPage() {
    return (
        <TechFaq
            form={
                <LeadFormContainer
                    source="tech-faq"
                    prefill={TECH_FAQ_TITLE}
                    ctaLabel={TECH_FAQ_FORM_CTA}
                    layout="unique"
                />
            }
        />
    );
}
