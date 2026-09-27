import { getWorksHub } from "@/actions/catalog/get-works-hub";
import { unwrapAction } from "@/types/action";
import { WORKS_VISIT_CTA } from "@/lib/copy";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";
import { WorksHub } from "@/widgets/works-hub/works-hub";

export const metadata = {
    title: "Фотогалерея · Новый Коттедж",
};

export default async function WorksPage() {
    const { hub } = unwrapAction(await getWorksHub());

    return (
        <WorksHub
            payload={hub}
            form={
                <LeadFormContainer
                    source="works-hub-visit"
                    prefill="Запись на просмотр дома"
                    ctaLabel={WORKS_VISIT_CTA}
                    layout="works"
                />
            }
        />
    );
}
