// Доменные типы настроек сайта живут в @forge/shared (общие с backend).
// Реэкспорт даёт стабильный путь `@/domain/settings` для www.
export type {
    Navigation,
    Footer,
    Contacts,
    ListingPages,
    FinanceUi,
    Seo,
} from "@forge/shared";
