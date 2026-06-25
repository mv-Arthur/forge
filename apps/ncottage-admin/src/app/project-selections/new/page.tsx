import { PageHeader } from "@/components/page-header";
import { SelectionForm } from "../SelectionForm";

export default function NewSelectionPage() {
    return (
        <div>
            <PageHeader
                title="Новая подборка"
                description="Подборка проектов с правилом фильтрации"
            />
            <SelectionForm submitLabel="Создать" />
        </div>
    );
}
