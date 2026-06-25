import Link from "next/link";
import { Plus } from "lucide-react";
import type { Certificate } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { CertificatesTable } from "./CertificatesTable";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
    const certificates = await apiGet<Certificate[]>("/certificates");

    return (
        <div>
            <PageHeader
                title="Сертификаты"
                description={`Всего: ${certificates.length}`}
                action={
                    <Button asChild>
                        <Link href="/certificates/new">
                            <Plus className="size-4" />
                            Новый документ
                        </Link>
                    </Button>
                }
            />
            <CertificatesTable data={certificates} />
        </div>
    );
}
