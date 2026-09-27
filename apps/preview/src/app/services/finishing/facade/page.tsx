import { FACADE_FORM_CTA, FACADE_TITLE } from "@/lib/copy";
import { FinishingFacade } from "@/widgets/finishing-facade/finishing-facade";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";

export const metadata = {
    title: `${FACADE_TITLE} · Новый Коттедж`,
    description:
        "Отделка фасадов каменных домов в СПб и Ленобласти: кирпич, штукатурка, планкен, панели и ДПК.",
};

export default function FinishingFacadePage() {
    return (
        <FinishingFacade
            form={
                <LeadFormContainer
                    source="finishing-facade"
                    prefill={FACADE_TITLE}
                    ctaLabel={FACADE_FORM_CTA}
                    layout="unique"
                />
            }
        />
    );
}
