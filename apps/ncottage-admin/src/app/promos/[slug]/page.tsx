import { notFound } from "next/navigation";
import type { Promo } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { PromoForm } from "../PromoForm";

export const dynamic = "force-dynamic";

export default async function EditPromoPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const promo = await apiGet<Promo>(
        `/promos/${encodeURIComponent(slug)}`
    ).catch(() => undefined);
    if (!promo) notFound();

    return (
        <div>
            <PageHeader
                title={promo.shortTitle}
                description={`Редактирование акции · ${promo.slug}`}
            />
            <PromoForm initial={promo} submitLabel="Сохранить" />
        </div>
    );
}
