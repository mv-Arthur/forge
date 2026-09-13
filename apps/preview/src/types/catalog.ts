export type Technology =
    | "frame"
    | "gas_concrete"
    | "brick"
    | "sip"
    | "fachwerk";

export type Floors = "1" | "1.5" | "2" | "mansard";

export interface ProjectPackage {
    name: string;
    price: number;
}

export interface ProjectMaterialVariant {
    technology: Technology;
    slug: string;
    priceFrom: number;
    priceLow: number;
    priceHigh: number;
    offerCount: number;
    packages: ProjectPackage[];
    mortgageFrom: number | null;
    category: string;
    url: string;
}

export interface ProjectFloorPlan {
    floor: string;
    url: string;
}

export interface RawProject {
    slug: string;
    name: string;
    dimensions: string | null;
    area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    floors: Floors | null;
    categories: string[];
    technologies: Technology[];
    features: string[];
    description: string | null;
    renders: string[];
    floorPlans: ProjectFloorPlan[];
    variants: ProjectMaterialVariant[];
}

export type ProjectClass = "serial" | "individual" | "bath";

export interface ShowcaseAboutBlock {
    title: string;
    text: string;
}

export interface ShowcaseFacade {
    id: string;
    label: string;
    src: string;
}

export interface ShowcaseDecorItem {
    id: string;
    title: string;
    text: string;
    src: string;
}

export interface ShowcaseStory {
    project: string[];
    built: string[];
}

export interface ShowcasePriceHike {
    from: string;
    next: number;
}

export interface ShowcasePayload {
    lead: string;
    about: ShowcaseAboutBlock[];
    plans: ProjectFloorPlan[];
    facades: ShowcaseFacade[];
    decor: ShowcaseDecorItem[];
    story: ShowcaseStory | null;
    gallery: string[];
    priceHike: ShowcasePriceHike | null;
}

export interface MergedProject extends RawProject {
    displayName: string;
    subtitle: string;
    priceFrom: number | null;
    mortgageFrom: number | null;
    heroImage: string;
    hasTerrace: boolean;
    hasWardrobe: boolean;
    warranty: number;
    projectClass: ProjectClass;
    detailFilled: boolean;
}

export interface BuiltObject {
    title: string;
    slug: string;
    technology: Technology | null;
    location: string | null;
    floors: Floors | null;
    status: "built" | "in-progress";
    gallery: string[];
}

export interface EnrichedBuiltObject extends BuiltObject {
    displayTitle: string;
    heroImage: string | null;
    locationLabel: string | null;
    area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    kitchenArea: number | null;
    hasTerrace: boolean;
    hasSauna: boolean;
    hasGarage: boolean;
    buildTermLabel: string | null;
    metaDescription: string | null;
}

export interface CatalogStats {
    total: number;
    minPrice: number;
    maxPrice: number;
    maxArea: number;
    minArea: number;
}

export interface CatalogNavCard {
    id: string;
    title: string;
    href: string;
    image?: string;
}

export interface CatalogNavPayload {
    all: CatalogNavCard;
    types: CatalogNavCard[];
    tiles: CatalogNavCard[];
    ctaLabel: string;
}

export interface CatalogHubTypeCard {
    kind: "serial" | "individual";
    title: string;
    description: string;
    href: string;
    ctaLabel: string;
    image: string;
}

export interface CatalogHubTechCard {
    tech: Technology;
    title: string;
    description: string;
    href: string;
    image: string;
    thumbs: string[];
    count: number;
}

export interface CatalogHubMore {
    title: string;
    items: CatalogHubTechCard[];
}

export interface CatalogHubPayload {
    heading: string;
    lead: string;
    chooseHref: string;
    chooseLabel: string;
    techsHeading: string;
    types: CatalogHubTypeCard[];
    techs: CatalogHubTechCard[];
    more: CatalogHubMore | null;
}
