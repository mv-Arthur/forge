import { notFound } from "next/navigation";
import type { ProjectSelection } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { SelectionForm } from "../SelectionForm";

export const dynamic = "force-dynamic";

export default async function EditSelectionPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const selection = await apiGet<ProjectSelection>(
        `/project-selections/${encodeURIComponent(slug)}`
    ).catch(() => undefined);
    if (!selection) notFound();

    return (
        <div>
            <PageHeader
                title={selection.shortTitle}
                description={`Редактирование подборки · ${selection.slug}`}
            />
            <SelectionForm initial={selection} submitLabel="Сохранить" />
        </div>
    );
}
