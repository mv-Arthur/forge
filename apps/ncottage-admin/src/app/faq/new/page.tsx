import type { FaqItem } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { FaqForm } from "../FaqForm";

export const dynamic = "force-dynamic";

export default async function NewFaqPage() {
    const items = await apiGet<FaqItem[]>("/faq").catch(() => [] as FaqItem[]);
    const nextOrder = items.length
        ? Math.max(...items.map((i) => i.order)) + 1
        : 0;

    return (
        <div>
            <PageHeader title="Новый вопрос" description="Добавьте вопрос FAQ" />
            <FaqForm submitLabel="Создать" nextOrder={nextOrder} />
        </div>
    );
}
