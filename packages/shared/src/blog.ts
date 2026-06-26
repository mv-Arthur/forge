// Доменные типы блога. Источник правды для backend (ncottage-api) и, как
// fallback-данные, для ncottage-www. Статьи управляются как коллекция в админке.

export interface ArticleSection {
    title: string;
    body: string[];
    list?: string[];
}

export interface Article {
    slug: string;
    title: string;
    description: string;
    category: string;
    date: string;
    readTime: string;
    heroNote: string;
    highlights: string[];
    sections: ArticleSection[];
    checklist: string[];
    relatedSlugs: string[];
    seoTitle?: string;
    seoDescription?: string;
}
