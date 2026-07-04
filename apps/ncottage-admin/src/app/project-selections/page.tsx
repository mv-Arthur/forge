import Link from "next/link";
import { Plus } from "lucide-react";
import type { ProjectSelection } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { SelectionsTable } from "./SelectionsTable";

export const dynamic = "force-dynamic";

export default async function ProjectSelectionsPage() {
    const selections = await apiGet<ProjectSelection[]>("/project-selections");

    return (
        <div>
            <PageHeader
                title="Подборки проектов"
                description={`Всего: ${selections.length}`}
                action={
                    <Button asChild>
                        <Link href="/project-selections/new">
                            <Plus className="size-4" />
                            Новая подборка
                        </Link>
                    </Button>
                }
            />
            <SelectionsTable data={selections} />
        </div>
    );
}
