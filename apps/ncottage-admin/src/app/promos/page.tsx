import Link from "next/link";
import { Plus } from "lucide-react";
import type { Promo } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { PromosTable } from "./PromosTable";

export const dynamic = "force-dynamic";

export default async function PromosPage() {
    const promos = await apiGet<Promo[]>("/promos");

    return (
        <div>
            <PageHeader
                title="Акции"
                description={`Всего: ${promos.length}`}
                action={
                    <Button asChild>
                        <Link href="/promos/new">
                            <Plus className="size-4" />
                            Новая акция
                        </Link>
                    </Button>
                }
            />
            <PromosTable data={promos} />
        </div>
    );
}
