import { EXTERIOR_FORM_CTA, EXTERIOR_TITLE } from "@/lib/copy";
import { FinishingExterior } from "@/widgets/finishing-exterior/finishing-exterior";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";

export const metadata = {
    title: `${EXTERIOR_TITLE} · Новый Коттедж`,
    description:
        "Внешняя отделка деревянных домов в СПб и Ленобласти: защитное покрытие каркаса, фахверка и СИП.",
};

export default function FinishingExteriorPage() {
    return (
        <FinishingExterior
            form={
                <LeadFormContainer
                    source="finishing-exterior"
                    prefill={EXTERIOR_TITLE}
                    ctaLabel={EXTERIOR_FORM_CTA}
                    layout="unique"
                />
            }
        />
    );
}
