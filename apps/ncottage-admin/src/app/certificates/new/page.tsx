import type { Certificate } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { CertificateForm } from "../CertificateForm";

export const dynamic = "force-dynamic";

export default async function NewCertificatePage() {
    const items = await apiGet<Certificate[]>("/certificates").catch(
        () => [] as Certificate[]
    );
    const nextOrder = items.length
        ? Math.max(...items.map((i) => i.order)) + 1
        : 0;

    return (
        <div>
            <PageHeader
                title="Новый документ"
                description="Добавьте сертификат или лицензию"
            />
            <CertificateForm submitLabel="Создать" nextOrder={nextOrder} />
        </div>
    );
}
