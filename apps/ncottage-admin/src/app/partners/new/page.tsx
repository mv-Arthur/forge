import type { Partner } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { PartnerForm } from "../PartnerForm";

export const dynamic = "force-dynamic";

export default async function NewPartnerPage() {
    const items = await apiGet<Partner[]>("/partners").catch(
        () => [] as Partner[]
    );
    const nextOrder = items.length
        ? Math.max(...items.map((i) => i.order)) + 1
        : 0;

    return (
        <div>
            <PageHeader
                title="Новый партнёр"
                description="Добавьте поставщика или партнёра"
            />
            <PartnerForm submitLabel="Создать" nextOrder={nextOrder} />
        </div>
    );
}
