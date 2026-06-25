import { notFound } from "next/navigation";
import type { Setting } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { ContactsForm } from "./ContactsForm";

export const dynamic = "force-dynamic";

export default async function ContactsSettingPage() {
    const setting = await apiGet<Setting<"contacts">>(
        "/settings/contacts"
    ).catch(() => null);
    if (!setting) notFound();

    return (
        <div>
            <PageHeader
                title="Контакты"
                description="Телефоны, адреса, соцсети и реквизиты"
            />
            <ContactsForm initial={setting.value} />
        </div>
    );
}
