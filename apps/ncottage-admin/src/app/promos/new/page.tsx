import { PageHeader } from "@/components/page-header";
import { PromoForm } from "../PromoForm";

export default function NewPromoPage() {
    return (
        <div>
            <PageHeader
                title="Новая акция"
                description="Заполните специальное предложение"
            />
            <PromoForm submitLabel="Создать" />
        </div>
    );
}
