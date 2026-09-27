import { getMethodsHub } from "@/actions/technology/get-methods-hub";
import { METHODS_HUB_LEAD, TECH_SECTION_HEADING } from "@/lib/copy";
import { unwrapAction } from "@/types/action";
import { MethodsHub } from "@/widgets/methods-hub/methods-hub";

export const metadata = {
    title: `${TECH_SECTION_HEADING} · Новый Коттедж`,
    description: METHODS_HUB_LEAD,
};

export default async function TechnologyMethodsPage() {
    const { hub } = unwrapAction(await getMethodsHub());
    return <MethodsHub payload={hub} />;
}
