import { PageHeader } from "@/components/page-header";
import { FaqForm } from "../FaqForm";

export default function NewFaqPage() {
    return (
        <div>
            <PageHeader title="Новый вопрос" description="Добавьте вопрос FAQ" />
            <FaqForm submitLabel="Создать" />
        </div>
    );
}
