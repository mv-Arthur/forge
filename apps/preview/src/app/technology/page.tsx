import { getTechnologyHub } from "@/actions/technology/get-technology-hub";
import { unwrapAction } from "@/types/action";
import { NAV_BUILD, WORKS_VISIT_CTA } from "@/lib/copy";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";
import { BLOG_ITEMS } from "@/widgets/home-blog/lib/content";
import { TechnologyHub } from "@/widgets/technology-hub/technology-hub";

export const metadata = {
    title: `${NAV_BUILD} · Новый Коттедж`,
    description:
        "Технологии строительства, этапы работ, калькулятор отопления и ответы на частые вопросы.",
};

export default async function TechnologyPage() {
    const { hub } = unwrapAction(await getTechnologyHub());

    return (
        <TechnologyHub
            payload={hub}
            articles={BLOG_ITEMS}
            form={
                <LeadFormContainer
                    source="technology-hub"
                    prefill="Вопрос о стройке"
                    ctaLabel={WORKS_VISIT_CTA}
                    layout="works"
                />
            }
        />
    );
}
