// Доменные типы блога живут в @forge/shared (общие с backend ncottage-api).
// Реэкспорт даёт стабильный путь `@/domain/blog` для www.
export type { Article, ArticleSection, BlogPage } from "@forge/shared";
