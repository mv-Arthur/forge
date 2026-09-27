import {
    BUILD_SUPPORT_FORM_CTA,
    BUILD_SUPPORT_LEAD,
    BUILD_SUPPORT_TITLE,
} from "@/lib/copy";
import { BuildSupport } from "@/widgets/build-support/build-support";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";

export const metadata = {
    title: `${BUILD_SUPPORT_TITLE} · Новый Коттедж`,
    description: BUILD_SUPPORT_LEAD,
};

export default function BuildSupportPage() {
    return (
        <BuildSupport
            form={
                <LeadFormContainer
                    source="build-support"
                    prefill={BUILD_SUPPORT_TITLE}
                    ctaLabel={BUILD_SUPPORT_FORM_CTA}
                    layout="unique"
                />
            }
        />
    );
}
