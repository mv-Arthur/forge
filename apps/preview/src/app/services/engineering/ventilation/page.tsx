import {
    ENGINEERING_FORM_CTA,
    ENGINEERING_VENTILATION_LEAD,
    ENGINEERING_VENTILATION_TITLE,
} from "@/lib/copy";
import { EngineeringArticle } from "@/widgets/engineering-article/engineering-article";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";

export const metadata = {
    title: `${ENGINEERING_VENTILATION_TITLE} · Новый Коттедж`,
    description: ENGINEERING_VENTILATION_LEAD,
};

export default function EngineeringVentilationPage() {
    return (
        <EngineeringArticle
            page="ventilation"
            form={
                <LeadFormContainer
                    source="engineering-ventilation"
                    prefill={ENGINEERING_VENTILATION_TITLE}
                    ctaLabel={ENGINEERING_FORM_CTA}
                    layout="works"
                />
            }
        />
    );
}
