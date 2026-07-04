import { notFound } from "next/navigation";
import type { Service, Setting } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { ServicesUiForm } from "./ServicesUiForm";

export const dynamic = "force-dynamic";

export default async function ServicesUiSettingPage() {
    const [setting, services] = await Promise.all([
        apiGet<Setting<"services_ui">>("/settings/services_ui").catch(
            () => null
        ),
        apiGet<Service[]>("/services").catch(() => [] as Service[]),
    ]);
    if (!setting) notFound();

    const serviceOptions = services.map((s) => ({
        value: s.slug,
        label: s.shortTitle,
    }));

    return (
        <div>
            <PageHeader
                title="Навигатор услуг"
                description="Квиз, дорожная карта и дополнительные ссылки на /services"
            />
            <ServicesUiForm
                initial={setting.value}
                serviceOptions={serviceOptions}
            />
        </div>
    );
}
