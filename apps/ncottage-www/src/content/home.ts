// Типы пропсов секций главной страницы. Данные приходят из ncottage-api (Page
// key="home"); статический источник/фолбэк — src/data/pages/home.ts.

import type { SelectOption } from "@/components/ui/Select";

type HeroTrustItem = { value: string; label: string };

export type HeroContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    text: string;
    primaryCta: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    trust: HeroTrustItem[];
    image: { src: string; alt: string };
};

type RangeBounds = { min: number; max: number };

export type ProjectPickerContent = {
    title: string;
    text: string;
    price: RangeBounds;
    area: RangeBounds;
    technologies: SelectOption[];
    floors: SelectOption[];
    submitLabel: string;
};

type CatalogTab = {
    id: string;
    label: string;
    technology: string | null;
};

export type CatalogSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    tabs: CatalogTab[];
    cta: { label: string; href: string };
    customProject: { text: string; linkLabel: string };
};

type AdvantageItem = { title: string; text: string };

export type AdvantagesSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    items: AdvantageItem[];
};

export type PullQuoteContent = {
    quote: string;
    author: string;
    role?: string;
};

export type OurWorksSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    cta: { label: string; href: string };
    visitInvite: {
        title: string;
        text: string;
        ctaLabel: string;
    };
};

type StagesSectionStage = {
    num: string;
    title: string;
    text: string;
};

export type StagesSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    stages: StagesSectionStage[];
};

type GeographyRegion = {
    label: string;
    count: number;
    percent: number;
    note?: string;
};

export type GeographyContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    totalLabel: string;
    totalValue: string;
    regions: GeographyRegion[];
    cta: { label: string; href: string };
};

type Review = {
    id: string;
    author: string;
    date: string;
    text: string;
    image?: string;
    videoUrl?: string;
};

export type ReviewsSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    showMoreLabel: string;
    prevLabel: string;
    nextLabel: string;
    reviews: Review[];
};

export type FeaturedProjectContent = {
    eyebrow: string;
    overline: string;
    ctaLabel: string;
    objectId: string;
    technology: string;
};

export type GuaranteeIcon =
    | "price"
    | "contract"
    | "steps"
    | "eye"
    | "shield"
    | "umbrella";

type GuaranteeItem = {
    icon: GuaranteeIcon;
    title: string;
    text: string;
};

export type GuaranteesSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    items: GuaranteeItem[];
};

type FaqItem = {
    question: string;
    answer: string;
};

export type FaqSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    items: FaqItem[];
};

export type ContactSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    addresses: string[];
    phones: { number: string; display: string }[];
    email: string;
    hours: string;
    form: {
        title: string;
        namePlaceholder: string;
        phonePlaceholder: string;
        messagePlaceholder: string;
        submitLabel: string;
        privacy: {
            text: string;
            linkLabel: string;
            linkHref: string;
        };
        successTitle: string;
        successText: string;
    };
};
