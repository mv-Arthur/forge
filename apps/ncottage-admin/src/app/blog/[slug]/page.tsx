import { notFound } from "next/navigation";
import type { Article } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { ArticleForm } from "../ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = await apiGet<Article>(
        `/articles/${encodeURIComponent(slug)}`
    ).catch(() => undefined);
    if (!article) notFound();

    return (
        <div>
            <PageHeader
                title={article.title}
                description={`Редактирование статьи · ${article.slug}`}
            />
            <ArticleForm initial={article} submitLabel="Сохранить" />
        </div>
    );
}
