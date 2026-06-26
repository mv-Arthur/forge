// Доменная модель страниц с секциями (about, производство, финансовые лендинги,
// контакты, работы, гарантия, legal). Источник правды для backend (ncottage-api),
// админки и, как fallback-данные, для ncottage-www.
//
// Страница — фиксированный упорядоченный набор типизированных секций. Поле `type`
// секции выбирает её схему данных (zod на входе API) и форму в админке. Это НЕ
// универсальный block-builder: набор типов закрыт, каждая секция — своя форма.

export const PAGE_KEYS = [
    "home",
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
    // Секции главной страницы (каждая — своя бесшаблонная вёрстка).
    "homeHero",
    "projectPicker",
    "catalogSection",
    "pullQuote",
    "worksTeaser",
    "stepsSection",
    "geography",
    "reviewsCarousel",
    "featuredProject",
    "guaranteeCards",
    "faqList",
    "homeContact",
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

// --- Секции главной страницы ---

// На главной заголовок секции обязателен (в отличие от страниц с секциями).
export interface HomeSectionHeading {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
}

export interface HomeHeroData {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    text: string;
    primaryCta: PageLink;
    secondaryCta?: PageLink;
    trust: ValueLabel[];
    image: { src: string; alt: string };
}

export interface ProjectPickerData {
    title: string;
    text: string;
    price: { min: number; max: number };
    area: { min: number; max: number };
    technologies: ValueLabel[];
    floors: ValueLabel[];
    submitLabel: string;
}

export interface CatalogSectionData extends HomeSectionHeading {
    tabs: { id: string; label: string; technology: string | null }[];
    cta: PageLink;
    customProject: { text: string; linkLabel: string };
}

export interface PullQuoteData {
    quote: string;
    author: string;
    role?: string;
}

export interface WorksTeaserData extends HomeSectionHeading {
    cta: PageLink;
    visitInvite: { title: string; text: string; ctaLabel: string };
}

export interface StepsSectionData extends HomeSectionHeading {
    stages: { num: string; title: string; text: string }[];
}

export interface GeographyData extends HomeSectionHeading {
    totalLabel: string;
    totalValue: string;
    regions: { label: string; count: number; percent: number; note?: string }[];
    cta: PageLink;
}

export interface ReviewsCarouselData extends HomeSectionHeading {
    showMoreLabel: string;
    prevLabel: string;
    nextLabel: string;
}

export interface FeaturedProjectData {
    eyebrow: string;
    overline: string;
    ctaLabel: string;
    objectId: string;
    technology: string;
}

export type HomeGuaranteeIcon =
    | "price"
    | "contract"
    | "steps"
    | "eye"
    | "shield"
    | "umbrella";

export interface GuaranteeCardsData extends HomeSectionHeading {
    items: { icon: HomeGuaranteeIcon; title: string; text: string }[];
}

export interface FaqListData extends HomeSectionHeading {
    items: { question: string; answer: string }[];
}

// Адреса/телефоны/email берутся из Setting key="contacts"; здесь — заголовок,
// часы работы и копирайт формы.
export interface HomeContactData {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    hours: string;
    form: {
        title: string;
        namePlaceholder: string;
        phonePlaceholder: string;
        messagePlaceholder: string;
        submitLabel: string;
        privacy: { text: string; linkLabel: string; linkHref: string };
        successTitle: string;
        successText: string;
    };
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
    homeHero: HomeHeroData;
    projectPicker: ProjectPickerData;
    catalogSection: CatalogSectionData;
    pullQuote: PullQuoteData;
    worksTeaser: WorksTeaserData;
    stepsSection: StepsSectionData;
    geography: GeographyData;
    reviewsCarousel: ReviewsCarouselData;
    featuredProject: FeaturedProjectData;
    guaranteeCards: GuaranteeCardsData;
    faqList: FaqListData;
    homeContact: HomeContactData;
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
