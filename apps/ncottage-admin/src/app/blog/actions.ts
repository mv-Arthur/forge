"use server";

import { revalidatePath } from "next/cache";
import type { Article } from "@forge/shared";
import { apiGet, apiSend } from "@/lib/api";

export interface ArticleActionResult {
    error?: string;
}

export interface ArticleSummary {
    slug: string;
    title: string;
}

export async function listArticleSummariesAction(): Promise<ArticleSummary[]> {
    const articles = await apiGet<Article[]>("/articles");
    return articles.map((a) => ({ slug: a.slug, title: a.title }));
}

export async function saveArticleAction(
    slug: string | null,
    article: Article
): Promise<ArticleActionResult> {
    const result = slug
        ? await apiSend(
              "PATCH",
              `/articles/${encodeURIComponent(slug)}`,
              article
          )
        : await apiSend("POST", "/articles", article);

    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/blog");
    return {};
}

export async function deleteArticleAction(
    slug: string
): Promise<ArticleActionResult> {
    const result = await apiSend(
        "DELETE",
        `/articles/${encodeURIComponent(slug)}`
    );
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/blog");
    return {};
}
