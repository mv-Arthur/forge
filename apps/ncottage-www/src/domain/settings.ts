// Доменные типы настроек сайта живут в @forge/shared (общие с backend).
// Реэкспорт даёт стабильный путь `@/domain/settings` для www.
export type {
    Navigation,
    NavItem,
    NavSubItem,
    Footer,
    FooterLink,
    FooterOffice,
    Contacts,
    ContactPhone,
    ContactAddress,
    ContactSocial,
    ListingPages,
    FinanceUi,
    Seo,
    SeoIndexKey,
    SeoIndexMeta,
} from "@forge/shared";
