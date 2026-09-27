import type { ShowcaseHeatCalc } from "./catalog";

export type TechnologyHubLink = {
    title: string;
    href: string;
};

export type TechnologyHubTechCard = {
    id: string;
    title: string;
    href: string;
    image: string;
};

export type TechnologyHubStageColumn = {
    id: string;
    title: string;
    image: string;
    moreLabel: string;
    moreHref: string;
    links: TechnologyHubLink[];
    lead?: string;
    ctaLabel?: string;
    ctaHref?: string;
};

export type TechnologyHubFaqItem = {
    question: string;
    answer: string;
};

export type TechnologyHubPayload = {
    crumb: string;
    heading: string;
    lead: string;
    techsHeading: string;
    techs: TechnologyHubTechCard[];
    stagesHeading: string;
    stages: TechnologyHubStageColumn[];
    articlesHeading: string;
    calcHeading: string;
    calcLead: string;
    calcCta: string;
    calcEnvelope: ShowcaseHeatCalc;
    calcProjectName: string;
    faqHeading: string;
    faq: TechnologyHubFaqItem[];
    leadHeading: string;
    leadText: string;
};
