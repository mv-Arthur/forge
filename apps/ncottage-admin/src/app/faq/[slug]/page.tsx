import { notFound } from "next/navigation";
import type { FaqItem } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { FaqForm } from "../FaqForm";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const item = await apiGet<FaqItem>(
        `/faq/${encodeURIComponent(slug)}`
    ).catch(() => undefined);
    if (!item) notFound();

    return (
        <div>
            <PageHeader
                title={item.question}
                description={`Редактирование вопроса · ${item.group}`}
            />
            <FaqForm initial={item} submitLabel="Сохранить" />
        </div>
    );
}
