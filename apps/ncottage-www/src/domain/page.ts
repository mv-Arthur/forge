// Доменные типы страниц с секциями живут в @forge/shared (общие с backend).
// Реэкспорт даёт стабильный путь `@/domain/page` для www.
export type {
    Page,
    PageSectionType,
    PageSectionDataMap,
    ReviewsCarouselData,
    FaqListData,
    HomeContactData,
    LabelValue,
} from "@forge/shared";
