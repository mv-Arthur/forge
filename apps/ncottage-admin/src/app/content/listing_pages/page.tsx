import { notFound } from "next/navigation";
import type { Setting } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { ListingPagesForm } from "./ListingPagesForm";

export const dynamic = "force-dynamic";

export default async function ListingPagesSettingPage() {
    const setting = await apiGet<Setting<"listing_pages">>(
        "/settings/listing_pages"
    ).catch(() => null);
    if (!setting) notFound();

    return (
        <div>
            <PageHeader
                title="Страницы-листинги"
                description="Метрики /reviews, чек-лист /certificates и принципы /partners"
            />
            <ListingPagesForm initial={setting.value} />
        </div>
    );
}
