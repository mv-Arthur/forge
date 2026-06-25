import { PageHeader } from "@/components/page-header";
import { ReviewForm } from "../ReviewForm";

export default function NewReviewPage() {
    return (
        <div>
            <PageHeader title="Новый отзыв" description="Добавьте отзыв клиента" />
            <ReviewForm submitLabel="Создать" />
        </div>
    );
}
