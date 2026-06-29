import { articles as STATIC_ARTICLES } from "@/app/blog/articles";
import type { Article, BlogPage } from "@/domain/blog";
import { warnApiFallback } from "@/lib/api-fallback";

// Статьи блога и чрома страницы /blog приходят из ncottage-api.
// ISR: ответы кешируются и ревалидируются по тегам articles/article:<slug> и
// settings/settings:blog_page. Если API недоступен — отдаём статику из
// src/app/blog/articles.ts, которая и была источником сидов.
const API_URL = process.env.NCOTTAGE_API_URL;
const REVALIDATE = 60;

const BLOG_PAGE_FALLBACK: BlogPage = {
    hero: {
        eyebrow: "Блог",
        title: "Практичные статьи о строительстве дома",
        lead: "Разбираем решения, которые влияют на комфорт, бюджет и срок строительства: от выбора технологии до инженерных систем и подготовки к ипотеке.",
        panelLabel: "Темы редакции",
    },
    featured: {
        eyebrow: "Гид покупателя",
        title: "С чего начать",
        titleAccent: "выбор дома",
        lead: "Самые важные решения принимаются до стройки: технология, участок, проект, фундамент и инженерные сценарии.",
    },
    list: {
        eyebrow: "Материалы",
        title: "Все статьи",
        lead: "Короткие практичные материалы для тех, кто выбирает проект, готовит участок или сравнивает технологии строительства.",
    },
    cta: {
        eyebrow: "Нужен совет",
        title: "Поможем выбрать проект и технологию",
        text: "Расскажите о семье, участке и бюджете — подберем подходящие проекты и объясним, какие решения важны именно для вашего дома.",
        buttonLabel: "Получить консультацию",
        buttonHref: "/contacts",
    },
};

export async function getArticles(): Promise<Article[]> {
    if (!API_URL) return STATIC_ARTICLES;
    try {
        const res = await fetch(`${API_URL}/articles`, {
            next: { revalidate: REVALIDATE, tags: ["articles"] },
        });
        if (!res.ok) return STATIC_ARTICLES;
        return (await res.json()) as Article[];
    } catch (error) {
        warnApiFallback("articles", error);
        return STATIC_ARTICLES;
    }
}

export async function getArticleBySlug(
    slug: string
): Promise<Article | undefined> {
    if (!API_URL) {
        return STATIC_ARTICLES.find((a) => a.slug === slug);
    }
    try {
        const res = await fetch(
            `${API_URL}/articles/${encodeURIComponent(slug)}`,
            {
                next: {
                    revalidate: REVALIDATE,
                    tags: ["articles", `article:${slug}`],
                },
            }
        );
        if (res.status === 404) return undefined;
        if (!res.ok) return STATIC_ARTICLES.find((a) => a.slug === slug);
        return (await res.json()) as Article;
    } catch (error) {
        warnApiFallback(`article ${slug}`, error);
        return STATIC_ARTICLES.find((a) => a.slug === slug);
    }
}

export async function getRelatedArticles(article: Article): Promise<Article[]> {
    if (article.relatedSlugs.length === 0) return [];
    const all = await getArticles();
    return article.relatedSlugs
        .map((slug) => all.find((a) => a.slug === slug))
        .filter((a): a is Article => Boolean(a));
}

export function getArticleCategories(articles: Article[]): string[] {
    return Array.from(new Set(articles.map((a) => a.category)));
}

export async function getBlogPage(): Promise<BlogPage> {
    if (!API_URL) return BLOG_PAGE_FALLBACK;
    try {
        const res = await fetch(`${API_URL}/settings/blog_page`, {
            next: {
                revalidate: REVALIDATE,
                tags: ["settings", "settings:blog_page"],
            },
        });
        if (!res.ok) return BLOG_PAGE_FALLBACK;
        const data = (await res.json()) as { value: BlogPage };
        return data.value;
    } catch (error) {
        warnApiFallback("blog_page", error);
        return BLOG_PAGE_FALLBACK;
    }
}
