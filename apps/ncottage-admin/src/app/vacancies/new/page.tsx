import type { Vacancy } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { VacancyForm } from "../VacancyForm";

export const dynamic = "force-dynamic";

export default async function NewVacancyPage() {
    const items = await apiGet<Vacancy[]>("/vacancies").catch(
        () => [] as Vacancy[]
    );
    const nextOrder = items.length
        ? Math.max(...items.map((i) => i.order)) + 1
        : 0;

    return (
        <div>
            <PageHeader
                title="Новая вакансия"
                description="Заполните карточку вакансии"
            />
            <VacancyForm submitLabel="Создать" nextOrder={nextOrder} />
        </div>
    );
}
