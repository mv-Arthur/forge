import {
    ENGINEERING_FORM_CTA,
    ENGINEERING_HEATING_LEAD,
    ENGINEERING_HEATING_TITLE,
} from "@/lib/copy";
import { EngineeringArticle } from "@/widgets/engineering-article/engineering-article";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";

export const metadata = {
    title: `${ENGINEERING_HEATING_TITLE} · Новый Коттедж`,
    description: ENGINEERING_HEATING_LEAD,
};

export default function EngineeringHeatingPage() {
    return (
        <EngineeringArticle
            page="heating"
            form={
                <LeadFormContainer
                    source="engineering-heating"
                    prefill={ENGINEERING_HEATING_TITLE}
                    ctaLabel={ENGINEERING_FORM_CTA}
                    layout="works"
                />
            }
        />
    );
}
