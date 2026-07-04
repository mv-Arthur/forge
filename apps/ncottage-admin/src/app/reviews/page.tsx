import Link from "next/link";
import { Plus } from "lucide-react";
import type { Review } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { ReviewsTable } from "./ReviewsTable";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
    const reviews = await apiGet<Review[]>("/reviews");

    return (
        <div>
            <PageHeader
                title="Отзывы"
                description={`Всего: ${reviews.length}`}
                action={
                    <Button asChild>
                        <Link href="/reviews/new">
                            <Plus className="size-4" />
                            Новый отзыв
                        </Link>
                    </Button>
                }
            />
            <ReviewsTable data={reviews} />
        </div>
    );
}
