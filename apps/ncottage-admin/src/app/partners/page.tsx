import Link from "next/link";
import { Plus } from "lucide-react";
import type { Partner } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { PartnersTable } from "./PartnersTable";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
    const partners = await apiGet<Partner[]>("/partners");

    return (
        <div>
            <PageHeader
                title="Партнёры"
                description={`Всего: ${partners.length}`}
                action={
                    <Button asChild>
                        <Link href="/partners/new">
                            <Plus className="size-4" />
                            Новый партнёр
                        </Link>
                    </Button>
                }
            />
            <PartnersTable data={partners} />
        </div>
    );
}
