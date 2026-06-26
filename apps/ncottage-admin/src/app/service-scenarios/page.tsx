import Link from "next/link";
import { Plus } from "lucide-react";
import type { ServiceScenario } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { ScenariosTable } from "./ScenariosTable";

export const dynamic = "force-dynamic";

export default async function ServiceScenariosPage() {
    const scenarios = await apiGet<ServiceScenario[]>("/service-scenarios");

    return (
        <div>
            <PageHeader
                title="Сценарии услуг"
                description={`Всего: ${scenarios.length}`}
                action={
                    <Button asChild>
                        <Link href="/service-scenarios/new">
                            <Plus className="size-4" />
                            Новый сценарий
                        </Link>
                    </Button>
                }
            />
            <ScenariosTable data={scenarios} />
        </div>
    );
}
