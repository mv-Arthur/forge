import { notFound } from "next/navigation";
import type { Setting } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { SeoForm } from "./SeoForm";

export const dynamic = "force-dynamic";

export default async function SeoSettingPage() {
    const setting = await apiGet<Setting<"seo">>("/settings/seo").catch(
        () => null
    );
    if (!setting) notFound();

    return (
        <div>
            <PageHeader
                title="SEO"
                description="Дефолтные мета-теги, Open Graph и заголовки листинговых страниц"
            />
            <SeoForm initial={setting.value} />
        </div>
    );
}
