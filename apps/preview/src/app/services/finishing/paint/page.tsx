import { PAINT_FORM_CTA, PAINT_TITLE } from "@/lib/copy";
import { FinishingPaint } from "@/widgets/finishing-paint/finishing-paint";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";

export const metadata = {
    title: `${PAINT_TITLE} · Новый Коттедж`,
    description:
        "Покраска деревянных домов в СПб и Ленобласти: подготовка, защита древесины и смета в договоре.",
};

export default function FinishingPaintPage() {
    return (
        <FinishingPaint
            form={
                <LeadFormContainer
                    source="finishing-paint"
                    prefill={PAINT_TITLE}
                    ctaLabel={PAINT_FORM_CTA}
                    layout="unique"
                />
            }
        />
    );
}
