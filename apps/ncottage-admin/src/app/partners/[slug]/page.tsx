import { notFound } from "next/navigation";
import type { Partner } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { PartnerForm } from "../PartnerForm";

export const dynamic = "force-dynamic";

export default async function EditPartnerPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const partner = await apiGet<Partner>(
        `/partners/${encodeURIComponent(slug)}`
    ).catch(() => undefined);
    if (!partner) notFound();

    return (
        <div>
            <PageHeader
                title={partner.name}
                description={`Редактирование партнёра · ${partner.slug}`}
            />
            <PartnerForm initial={partner} submitLabel="Сохранить" />
        </div>
    );
}
