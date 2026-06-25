import { notFound } from "next/navigation";
import type { Review } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { ReviewForm } from "../ReviewForm";

export const dynamic = "force-dynamic";

export default async function EditReviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const review = await apiGet<Review>(
        `/reviews/${encodeURIComponent(id)}`
    ).catch(() => undefined);
    if (!review) notFound();

    return (
        <div>
            <PageHeader
                title={`Отзыв · ${review.author}`}
                description="Редактирование отзыва"
            />
            <ReviewForm initial={review} submitLabel="Сохранить" />
        </div>
    );
}
