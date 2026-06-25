import { PageHeader } from "@/components/page-header";
import { PartnerForm } from "../PartnerForm";

export default function NewPartnerPage() {
    return (
        <div>
            <PageHeader
                title="Новый партнёр"
                description="Добавьте поставщика или партнёра"
            />
            <PartnerForm submitLabel="Создать" />
        </div>
    );
}
