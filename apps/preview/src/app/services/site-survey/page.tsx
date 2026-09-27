import { SITE_SURVEY_FORM_CTA, SITE_SURVEY_TITLE } from "@/lib/copy";
import { SiteSurvey } from "@/widgets/site-survey/site-survey";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";

export const metadata = {
    title: `${SITE_SURVEY_TITLE} · Новый Коттедж`,
    description:
        "Выезд инженера на участок в СПб и Ленобласти: рельеф, грунты, коммуникации и план подготовки к стройке.",
};

export default function SiteSurveyPage() {
    return (
        <SiteSurvey
            form={
                <LeadFormContainer
                    source="site-survey"
                    prefill={SITE_SURVEY_TITLE}
                    ctaLabel={SITE_SURVEY_FORM_CTA}
                    layout="unique"
                />
            }
        />
    );
}
