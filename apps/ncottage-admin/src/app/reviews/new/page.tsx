import type { Review } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { ReviewForm } from "../ReviewForm";

export const dynamic = "force-dynamic";

export default async function NewReviewPage() {
    const items = await apiGet<Review[]>("/reviews").catch(
        () => [] as Review[]
    );
    const nextOrder = items.length
        ? Math.max(...items.map((i) => i.order)) + 1
        : 0;

    return (
        <div>
            <PageHeader title="Новый отзыв" description="Добавьте отзыв клиента" />
            <ReviewForm submitLabel="Создать" nextOrder={nextOrder} />
        </div>
    );
}
