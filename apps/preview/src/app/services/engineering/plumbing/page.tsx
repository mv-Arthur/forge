import {
    ENGINEERING_FORM_CTA,
    ENGINEERING_PLUMBING_LEAD,
    ENGINEERING_PLUMBING_TITLE,
} from "@/lib/copy";
import { EngineeringArticle } from "@/widgets/engineering-article/engineering-article";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";

export const metadata = {
    title: `${ENGINEERING_PLUMBING_TITLE} · Новый Коттедж`,
    description: ENGINEERING_PLUMBING_LEAD,
};

export default function EngineeringPlumbingPage() {
    return (
        <EngineeringArticle
            page="plumbing"
            form={
                <LeadFormContainer
                    source="engineering-plumbing"
                    prefill={ENGINEERING_PLUMBING_TITLE}
                    ctaLabel={ENGINEERING_FORM_CTA}
                    layout="works"
                />
            }
        />
    );
}
