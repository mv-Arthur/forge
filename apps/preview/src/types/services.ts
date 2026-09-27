import type { MergedProject, Technology } from "./catalog";
import type { TechFamily } from "@/lib/techFamily";

export type ServicesHubOffer = {
    title: string;
    href: string;
    moreLabel: string;
    kicker?: string;
    badge?: string;
    image?: string;
};

export type ServicesHubSituation = {
    id: string;
    title: string;
    lead: string;
    image: string;
    panelTitle: string;
    panelLead: string;
    ctaLabel: string;
    ctaHref: string;
    offers: ServicesHubOffer[];
};

export type ServicesHubPathStep = {
    id: string;
    title: string;
    lead: string;
    checks: string[];
    ctaLabel: string;
    ctaHref: string;
    offers: ServicesHubOffer[];
};

export type ServicesHubStat = {
    value: string;
    hint: string;
};

export type ServicesHubWorksCard = {
    title: string;
    lead: string;
    href: string;
    ctaLabel: string;
    image: string;
};

export type ServicesHubPayload = {
    crumb: string;
    eyebrow: string;
    heading: string;
    lead: string;
    chooseLabel: string;
    chooseHref: string;
    meetLabel: string;
    meetHref: string;
    heroImage: string;
    situationsHeading: string;
    situationsLead: string;
    situations: ServicesHubSituation[];
    pathHeading: string;
    pathSteps: ServicesHubPathStep[];
    leadHeading: string;
    leadText: string;
    stats: ServicesHubStat[];
    works: ServicesHubWorksCard[];
};

export type ConstructionTechCard = {
    tech: Technology;
    title: string;
    description: string;
    href: string;
    image: string;
    count: number;
};

export type ConstructionLineCard = {
    id: string;
    title: string;
    lead: string;
    href: string;
    image: string;
};

export type ConstructionHubPayload = {
    family: TechFamily;
    crumb: string;
    title: string;
    lead: string;
    ctaLabel: string;
    catalogHref: string;
    heroImage: string;
    techs: ConstructionTechCard[];
    stagesHref: string;
    serial: MergedProject[];
    serialAllHref: string;
    lines: ConstructionLineCard[];
    individual: MergedProject[];
    individualAllHref: string;
};
