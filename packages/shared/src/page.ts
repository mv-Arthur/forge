// Доменная модель страниц с секциями (about, производство, финансовые лендинги,
// контакты, работы, гарантия, legal). Источник правды для backend (ncottage-api),
// админки и, как fallback-данные, для ncottage-www.
//
// Страница — фиксированный упорядоченный набор типизированных секций. Поле `type`
// секции выбирает её схему данных (zod на входе API) и форму в админке. Это НЕ
// универсальный block-builder: набор типов закрыт, каждая секция — своя форма.

export const PAGE_KEYS = [
    "about",
    "production",
    "mortgage",
    "credit",
    "maternity-capital",
    "payment",
    "contacts",
    "works",
    "guarantee",
    "privacy",
    "offer",
    "requisites",
    "personal-data",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export const PAGE_SECTION_TYPES = [
    // Типизированные hero (у каждой страницы свой набор полей).
    "aboutHero",
    "productionHero",
    "financeHero",
    "contactsHero",
    "worksHero",
    "guaranteeHero",
    "legalHero",
    // Переиспользуемые секции-списки.
    "sectionHeading",
    "cardGrid",
    "valueList",
    "stringList",
    "bulletSections",
    "requisitesTable",
    "leadForm",
    "team",
    "timeline",
    "ctaLinks",
    "locationCards",
    "worksMap",
] as const;

export type PageSectionType = (typeof PAGE_SECTION_TYPES)[number];

// --- Переиспользуемые элементы ---

export interface CardItem {
    title: string;
    text: string;
}

export interface ValueLabel {
    value: string;
    label: string;
}

export interface LabelValue {
    label: string;
    value: string;
}

export interface PageLink {
    label: string;
    href: string;
}

// Общие поля заголовка секции (eyebrow/title/titleAccent/lead). Везде опциональны:
// часть секций рендерится без заголовка.
export interface SectionHeading {
    eyebrow?: string;
    title?: string;
    titleAccent?: string;
    lead?: string;
}

// --- Hero-секции ---

export interface AboutHeroData {
    eyebrow: string;
    title: string;
    lead: string;
    cardText: string;
    cardMeta: LabelValue[];
}

export interface ProductionHeroData {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    panelEyebrow: string;
    panelValue: string;
    panelDescription: string;
}

export interface FinanceHeroData {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    stats: ValueLabel[];
}

export interface ContactsHeroData {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    visitKicker: string;
    visitText: string;
    visitCtaLabel: string;
    visitCtaHref: string;
}

export interface WorksHeroData {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    // Значения статистики вычисляются из построенных объектов — редактируются только подписи.
    statLabels: string[];
}

export interface GuaranteeHeroData {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    ctaText: string;
    ctaAnchor: string;
    secondaryLinkText: string;
    secondaryLinkHref: string;
    summaryNumber: string;
    summaryLabel: string;
    summaryText: string;
}

export interface LegalHeroData {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    operatorName?: string;
    noteLabel?: string;
    noteText?: string;
    summaryTitle?: string;
    summarySubtitle?: string;
}

// --- Переиспользуемые секции ---

export type SectionHeadingData = SectionHeading;

export interface CardGridData extends SectionHeading {
    note?: CardItem;
    items: CardItem[];
}

export interface ValueListData extends SectionHeading {
    items: ValueLabel[];
}

export interface StringListData extends SectionHeading {
    items: string[];
}

export interface BulletSectionsData extends SectionHeading {
    updated?: string;
    items: { title: string; text?: string; list?: string[] }[];
}

export interface RequisitesTableData {
    title: string;
    rows: LabelValue[];
}

export interface LeadFormData {
    eyebrow?: string;
    title: string;
    lead: string;
    button: string;
}

export interface TeamData extends SectionHeading {
    members: { name: string; role: string; text: string }[];
}

export interface TimelineData extends SectionHeading {
    items: { year: string; text: string }[];
}

export interface CtaLinksData {
    eyebrow?: string;
    title: string;
    description?: string;
    links: PageLink[];
}

export interface LocationCardsData extends SectionHeading {
    items: {
        city?: string;
        title: string;
        address: string;
        phoneNumber: string;
        phoneDisplay: string;
        note: string;
    }[];
}

export interface WorksMapData {
    eyebrow: string;
    heading: string;
    lead: string;
    mapLabelSpb: string;
    mapLabelMsk: string;
    mapAsideLabel: string;
    mapAsideTitle: string;
    mapAsideText: string;
    ctaLabel: string;
}

// Сопоставление типа секции с её данными — для типобезопасного чтения на фронте.
export interface PageSectionDataMap {
    aboutHero: AboutHeroData;
    productionHero: ProductionHeroData;
    financeHero: FinanceHeroData;
    contactsHero: ContactsHeroData;
    worksHero: WorksHeroData;
    guaranteeHero: GuaranteeHeroData;
    legalHero: LegalHeroData;
    sectionHeading: SectionHeadingData;
    cardGrid: CardGridData;
    valueList: ValueListData;
    stringList: StringListData;
    bulletSections: BulletSectionsData;
    requisitesTable: RequisitesTableData;
    leadForm: LeadFormData;
    team: TeamData;
    timeline: TimelineData;
    ctaLinks: CtaLinksData;
    locationCards: LocationCardsData;
    worksMap: WorksMapData;
}

export interface PageSection {
    id: string;
    type: PageSectionType;
    order: number;
    // Валидируется на входе API по схеме типа; потребители сужают через PageSectionDataMap.
    data: unknown;
}

export interface Page {
    key: string;
    title: string;
    seoTitle: string;
    seoDescription: string;
    sections: PageSection[];
}

export interface PageSummary {
    key: string;
    title: string;
    sectionCount: number;
}
