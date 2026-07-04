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

// --- Секции главной страницы ---

// На главной заголовок секции обязателен.
const requiredHeading = {
    eyebrow: z.string(),
    title: z.string(),
    titleAccent: z.string().optional(),
    lead: z.string().optional(),
};

const range = z.object({ min: z.number(), max: z.number() });

const homeHero = z.object({
    eyebrow: z.string(),
    title: z.string(),
    titleAccent: z.string().optional(),
    text: z.string(),
    primaryCta: pageLink,
    secondaryCta: pageLink.optional(),
    trust: z.array(valueLabel),
    image: z.object({ src: z.string(), alt: z.string() }),
});

const projectPicker = z.object({
    title: z.string(),
    text: z.string(),
    price: range,
    area: range,
    technologies: z.array(valueLabel),
    floors: z.array(valueLabel),
    submitLabel: z.string(),
});

const catalogSection = z.object({
    ...requiredHeading,
    tabs: z.array(
        z.object({
            id: z.string(),
            label: z.string(),
            technology: z.string().nullable(),
        })
    ),
    cta: pageLink,
    customProject: z.object({ text: z.string(), linkLabel: z.string() }),
});

const pullQuote = z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
});

const worksTeaser = z.object({
    ...requiredHeading,
    cta: pageLink,
    visitInvite: z.object({
        title: z.string(),
        text: z.string(),
        ctaLabel: z.string(),
    }),
});

const stepsSection = z.object({
    ...requiredHeading,
    stages: z.array(
        z.object({ num: z.string(), title: z.string(), text: z.string() })
    ),
});

const geography = z.object({
    ...requiredHeading,
    totalLabel: z.string(),
    totalValue: z.string(),
    regions: z.array(
        z.object({
            label: z.string(),
            count: z.number(),
            percent: z.number(),
            note: z.string().optional(),
        })
    ),
    cta: pageLink,
});

const reviewsCarousel = z.object({
    ...requiredHeading,
    showMoreLabel: z.string(),
    prevLabel: z.string(),
    nextLabel: z.string(),
});

const featuredProject = z.object({
    eyebrow: z.string(),
    overline: z.string(),
    ctaLabel: z.string(),
    objectId: z.string(),
    technology: z.string(),
});

const guaranteeIcon = z.enum([
    "price",
    "contract",
    "steps",
    "eye",
    "shield",
    "umbrella",
]);

const guaranteeCards = z.object({
    ...requiredHeading,
    items: z.array(
        z.object({
            icon: guaranteeIcon,
            title: z.string(),
            text: z.string(),
        })
    ),
});

const faqList = z.object({
    ...requiredHeading,
    items: z.array(z.object({ question: z.string(), answer: z.string() })),
});

const homeContact = z.object({
    eyebrow: z.string(),
    title: z.string(),
    titleAccent: z.string().optional(),
    lead: z.string(),
    hours: z.string(),
    form: z.object({
        title: z.string(),
        namePlaceholder: z.string(),
        phonePlaceholder: z.string(),
        messagePlaceholder: z.string(),
        submitLabel: z.string(),
        privacy: z.object({
            text: z.string(),
            linkLabel: z.string(),
            linkHref: z.string(),
        }),
        successTitle: z.string(),
        successText: z.string(),
    }),
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
    homeHero,
    projectPicker,
    catalogSection,
    pullQuote,
    worksTeaser,
    stepsSection,
    geography,
    reviewsCarousel,
    featuredProject,
    guaranteeCards,
    faqList,
    homeContact,
};
