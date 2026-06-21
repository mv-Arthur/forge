import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import type { Lead } from "@/lib/types";
import { LeadsTable } from "./LeadsTable";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
    const leads = await apiGet<Lead[]>("/leads");

    return (
        <div>
            <PageHeader title="Заявки" description={`Всего: ${leads.length}`} />
            <LeadsTable data={leads} />
        </div>
    );
}
