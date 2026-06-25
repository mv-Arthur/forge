import { PageHeader } from "@/components/page-header";
import { VacancyForm } from "../VacancyForm";

export default function NewVacancyPage() {
    return (
        <div>
            <PageHeader
                title="Новая вакансия"
                description="Заполните карточку вакансии"
            />
            <VacancyForm submitLabel="Создать" />
        </div>
    );
}
