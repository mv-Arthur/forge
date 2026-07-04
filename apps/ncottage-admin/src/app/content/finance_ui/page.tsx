import { notFound } from "next/navigation";
import type { Setting } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { FinanceUiForm } from "./FinanceUiForm";

export const dynamic = "force-dynamic";

export default async function FinanceUiSettingPage() {
    const setting = await apiGet<Setting<"finance_ui">>(
        "/settings/finance_ui"
    ).catch(() => null);
    if (!setting) notFound();

    return (
        <div>
            <PageHeader
                title="Финансовые лендинги"
                description="Кнопки, «единый сценарий» и надзаголовки на /mortgage, /credit, /maternity-capital, /payment"
            />
            <FinanceUiForm initial={setting.value} />
        </div>
    );
}
