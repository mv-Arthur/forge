import { PageHeader } from "@/components/page-header";
import { ArticleForm } from "../ArticleForm";

export default function NewArticlePage() {
    return (
        <div>
            <PageHeader
                title="Новая статья"
                description="Заполните материал блога"
            />
            <ArticleForm submitLabel="Создать" />
        </div>
    );
}
