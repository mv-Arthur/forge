import { listListedObjects } from "@/actions/catalog/list-objects";
import {
    BUILT_STAT_STANDING,
    BUILT_STAT_YEARS,
    ENGINEERING_EXTERNAL_LEAD,
    ENGINEERING_EXTERNAL_TITLE,
    ENGINEERING_FORM_CTA,
    SERVICES_HUB_STAT_WARRANTY,
} from "@/lib/copy";
import { settings } from "@/lib/settings";
import { unwrapAction } from "@/types/action";
import { EngineeringExternal } from "@/widgets/engineering-external/engineering-external";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";

export const metadata = {
    title: `${ENGINEERING_EXTERNAL_TITLE} · Новый Коттедж`,
    description: ENGINEERING_EXTERNAL_LEAD,
};

export default async function EngineeringExternalPage() {
    const { objects } = unwrapAction(await listListedObjects());
    const builtCount = objects.filter((o) => o.status === "built").length;
    const sinceYears = new Date().getFullYear() - settings.foundedYear;
    const stats = [
        ...(builtCount > 0
            ? [{ value: String(builtCount), hint: BUILT_STAT_STANDING }]
            : []),
        ...(sinceYears > 0
            ? [{ value: String(sinceYears), hint: BUILT_STAT_YEARS }]
            : []),
        {
            value: String(settings.warrantyYears),
            hint: SERVICES_HUB_STAT_WARRANTY,
        },
    ];

    return (
        <EngineeringExternal
            stats={stats}
            form={
                <LeadFormContainer
                    source="engineering-external"
                    prefill={ENGINEERING_EXTERNAL_TITLE}
                    ctaLabel={ENGINEERING_FORM_CTA}
                    layout="works"
                />
            }
        />
    );
}
