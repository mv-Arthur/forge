import { notFound } from "next/navigation";
import type { BuiltObject } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { BuiltObjectForm } from "../BuiltObjectForm";

export const dynamic = "force-dynamic";

export default async function EditBuiltObjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const object = await apiGet<BuiltObject>(
        `/built-objects/${encodeURIComponent(id)}`
    ).catch(() => undefined);
    if (!object) notFound();

    return (
        <div>
            <PageHeader
                title={object.title}
                description={`Редактирование объекта · ${object.id}`}
            />
            <BuiltObjectForm initial={object} submitLabel="Сохранить" />
        </div>
    );
}
