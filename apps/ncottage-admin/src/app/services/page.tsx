import Link from "next/link";
import { Plus } from "lucide-react";
import type { Service } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { ServicesTable } from "./ServicesTable";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
    const services = await apiGet<Service[]>("/services");

    return (
        <div>
            <PageHeader
                title="Услуги"
                description={`Всего: ${services.length}`}
                action={
                    <Button asChild>
                        <Link href="/services/new">
                            <Plus className="size-4" />
                            Новая услуга
                        </Link>
                    </Button>
                }
            />
            <ServicesTable data={services} />
        </div>
    );
}
