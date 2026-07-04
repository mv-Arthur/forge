import { notFound } from "next/navigation";
import type { Vacancy } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { VacancyForm } from "../VacancyForm";

export const dynamic = "force-dynamic";

export default async function EditVacancyPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const vacancy = await apiGet<Vacancy>(
        `/vacancies/${encodeURIComponent(slug)}`
    ).catch(() => undefined);
    if (!vacancy) notFound();

    return (
        <div>
            <PageHeader
                title={vacancy.title}
                description={`Редактирование вакансии · ${vacancy.slug}`}
            />
            <VacancyForm initial={vacancy} submitLabel="Сохранить" />
        </div>
    );
}
