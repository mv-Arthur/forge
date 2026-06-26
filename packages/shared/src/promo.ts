// Доменный тип акции (коллекция). Источник правды для backend (ncottage-api)
// и, как fallback-данные, для ncottage-www.

export interface Promo {
    slug: string;
    title: string;
    shortTitle: string;
    eyebrow: string;
    lead: string;
    price: string;
    priceNote: string;
    period: string;
    terms: string[];
    includes: string[];
    details: string[];
    projectsHref: string;
    seoTitle?: string;
    seoDescription?: string;
}
