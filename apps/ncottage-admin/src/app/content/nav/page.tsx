import { notFound } from "next/navigation";
import type { Setting } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { NavForm } from "./NavForm";

export const dynamic = "force-dynamic";

export default async function NavSettingPage() {
    const setting = await apiGet<Setting<"nav">>("/settings/nav").catch(
        () => null
    );
    if (!setting) notFound();

    return (
        <div>
            <PageHeader title="Навигация" description="Верхнее меню сайта" />
            <NavForm initial={setting.value} />
        </div>
    );
}
