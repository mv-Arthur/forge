import Link from "next/link";
import { Plus } from "lucide-react";
import type { Article } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { ArticlesTable } from "./ArticlesTable";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    const articles = await apiGet<Article[]>("/articles");

    return (
        <div>
            <PageHeader
                title="Блог"
                description={`Всего: ${articles.length}`}
                action={
                    <Button asChild>
                        <Link href="/blog/new">
                            <Plus className="size-4" />
                            Новая статья
                        </Link>
                    </Button>
                }
            />
            <ArticlesTable data={articles} />
        </div>
    );
}
