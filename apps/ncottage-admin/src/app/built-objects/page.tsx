import Link from "next/link";
import { Plus } from "lucide-react";
import type { BuiltObject } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { BuiltObjectsTable } from "./BuiltObjectsTable";

export const dynamic = "force-dynamic";

export default async function BuiltObjectsPage() {
    const objects = await apiGet<BuiltObject[]>("/built-objects");

    return (
        <div>
            <PageHeader
                title="Построенные объекты"
                description={`Всего: ${objects.length}`}
                action={
                    <Button asChild>
                        <Link href="/built-objects/new">
                            <Plus className="size-4" />
                            Новый объект
                        </Link>
                    </Button>
                }
            />
            <BuiltObjectsTable data={objects} />
        </div>
    );
}
