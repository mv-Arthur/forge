import type { PageSectionType } from "@forge/shared";
import { z } from "zod";

// Общие поля заголовка секции — везде опциональны.
const heading = {
    eyebrow: z.string().optional(),
    title: z.string().optional(),
    titleAccent: z.string().optional(),
    lead: z.string().optional(),
};

const cardItem = z.object({ title: z.string(), text: z.string() });
const valueLabel = z.object({ value: z.string(), label: z.string() });
const labelValue = z.object({ label: z.string(), value: z.string() });
const pageLink = z.object({ label: z.string(), href: z.string() });

const aboutHero = z.object({
    eyebrow: z.string(),
    title: z.string(),
    lead: z.string(),
    cardText: z.string(),
    cardMeta: z.array(labelValue),
});

const productionHero = z.object({
    eyebrow: z.string(),
    title: z.string(),
    titleAccent: z.string().optional(),
    lead: z.string(),
    panelEyebrow: z.string(),
    panelValue: z.string(),
    panelDescription: z.string(),
});

const financeHero = z.object({
    eyebrow: z.string(),
    title: z.string(),
    titleAccent: z.string().optional(),
    lead: z.string(),
    stats: z.array(valueLabel),
});

const contactsHero = z.object({
    eyebrow: z.string(),
    title: z.string(),
    titleAccent: z.string().optional(),
    lead: z.string(),
    visitKicker: z.string(),
    visitText: z.string(),
    visitCtaLabel: z.string(),
    visitCtaHref: z.string(),
});

const worksHero = z.object({
    eyebrow: z.string(),
    title: z.string(),
    titleAccent: z.string().optional(),
    lead: z.string(),
    statLabels: z.array(z.string()),
});

const guaranteeHero = z.object({
    eyebrow: z.string(),
    title: z.string(),
    titleAccent: z.string().optional(),
    lead: z.string(),
    ctaText: z.string(),
    ctaAnchor: z.string(),
    secondaryLinkText: z.string(),
    secondaryLinkHref: z.string(),
    summaryNumber: z.string(),
    summaryLabel: z.string(),
    summaryText: z.string(),
});

const legalHero = z.object({
    eyebrow: z.string(),
    title: z.string(),
    titleAccent: z.string().optional(),
    lead: z.string(),
    operatorName: z.string().optional(),
    noteLabel: z.string().optional(),
    noteText: z.string().optional(),
    summaryTitle: z.string().optional(),
    summarySubtitle: z.string().optional(),
});

const sectionHeading = z.object({ ...heading });

const cardGrid = z.object({
    ...heading,
    note: cardItem.optional(),
    items: z.array(cardItem),
});

const valueList = z.object({ ...heading, items: z.array(valueLabel) });

const stringList = z.object({ ...heading, items: z.array(z.string()) });

const bulletSections = z.object({
    ...heading,
    updated: z.string().optional(),
    items: z.array(
        z.object({
            title: z.string(),
            text: z.string().optional(),
            list: z.array(z.string()).optional(),
        })
    ),
});

const requisitesTable = z.object({
    title: z.string(),
    rows: z.array(labelValue),
});

const leadForm = z.object({
    eyebrow: z.string().optional(),
    title: z.string(),
    lead: z.string(),
    button: z.string(),
});

const team = z.object({
    ...heading,
    members: z.array(
        z.object({ name: z.string(), role: z.string(), text: z.string() })
    ),
});

const timeline = z.object({
    ...heading,
    items: z.array(z.object({ year: z.string(), text: z.string() })),
});

const ctaLinks = z.object({
    eyebrow: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    links: z.array(pageLink),
});

const locationCards = z.object({
    ...heading,
    items: z.array(
        z.object({
            city: z.string().optional(),
            title: z.string(),
            address: z.string(),
            phoneNumber: z.string(),
            phoneDisplay: z.string(),
            note: z.string(),
        })
    ),
});

const worksMap = z.object({
    eyebrow: z.string(),
    heading: z.string(),
    lead: z.string(),
    mapLabelSpb: z.string(),
    mapLabelMsk: z.string(),
    mapAsideLabel: z.string(),
    mapAsideTitle: z.string(),
    mapAsideText: z.string(),
    ctaLabel: z.string(),
});

export const SECTION_SCHEMAS: Record<PageSectionType, z.ZodType> = {
    aboutHero,
    productionHero,
    financeHero,
    contactsHero,
    worksHero,
    guaranteeHero,
    legalHero,
    sectionHeading,
    cardGrid,
    valueList,
    stringList,
    bulletSections,
    requisitesTable,
    leadForm,
    team,
    timeline,
    ctaLinks,
    locationCards,
    worksMap,
};
