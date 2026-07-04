import { notFound } from "next/navigation";
import type { Certificate } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { CertificateForm } from "../CertificateForm";

export const dynamic = "force-dynamic";

export default async function EditCertificatePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const certificate = await apiGet<Certificate>(
        `/certificates/${encodeURIComponent(slug)}`
    ).catch(() => undefined);
    if (!certificate) notFound();

    return (
        <div>
            <PageHeader
                title={certificate.title}
                description={`Редактирование документа · ${certificate.slug}`}
            />
            <CertificateForm initial={certificate} submitLabel="Сохранить" />
        </div>
    );
}
