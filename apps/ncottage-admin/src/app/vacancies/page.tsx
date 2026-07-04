import Link from "next/link";
import { Plus } from "lucide-react";
import type { Vacancy } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { VacanciesTable } from "./VacanciesTable";

export const dynamic = "force-dynamic";

export default async function VacanciesPage() {
    const vacancies = await apiGet<Vacancy[]>("/vacancies");

    return (
        <div>
            <PageHeader
                title="Вакансии"
                description={`Всего: ${vacancies.length}`}
                action={
                    <Button asChild>
                        <Link href="/vacancies/new">
                            <Plus className="size-4" />
                            Новая вакансия
                        </Link>
                    </Button>
                }
            />
            <VacanciesTable data={vacancies} />
        </div>
    );
}
