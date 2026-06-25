import { PageHeader } from "@/components/page-header";
import { BuiltObjectForm } from "../BuiltObjectForm";

export default function NewBuiltObjectPage() {
    return (
        <div>
            <PageHeader
                title="Новый объект"
                description="Добавьте построенный объект"
            />
            <BuiltObjectForm submitLabel="Создать" />
        </div>
    );
}
