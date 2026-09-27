import { getServicesHub } from "@/actions/services/get-services-hub";
import { unwrapAction } from "@/types/action";
import { WORKS_VISIT_CTA } from "@/lib/copy";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";
import { ServicesHub } from "@/widgets/services-hub/services-hub";

export const metadata = {
    title: "Услуги · Новый Коттедж",
};

export default async function ServicesPage() {
    const { hub } = unwrapAction(await getServicesHub());

    return (
        <ServicesHub
            payload={hub}
            form={
                <LeadFormContainer
                    source="services-hub"
                    prefill="Запись на встречу: услуги"
                    ctaLabel={WORKS_VISIT_CTA}
                    layout="works"
                />
            }
        />
    );
}
