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

export type PlanLayer = "2d" | "3d" | "walls";

export interface ProjectFloorPlan {
    floor: string;
    url: string;
    layer?: PlanLayer;
    area?: number;
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

export interface ShowcaseMosaicCard {
    title: string;
    text: string;
    image: string;
}

export interface ShowcaseMosaic {
    about: ShowcaseMosaicCard;
    interior: ShowcaseMosaicCard;
    layout: ShowcaseMosaicCard;
}

export interface ShowcaseFacade {
    id: string;
    label: string;
    src: string;
    sectionSrc?: string;
}

export interface ShowcaseDecorItem {
    id: string;
    title: string;
    text?: string;
    src: string;
    floor?: "1" | "2";
}

export interface ShowcaseStory {
    project: string[];
    built: string[];
}

export interface ShowcasePriceHike {
    from: string;
    next: number;
}

export interface ShowcaseComplectationItem {
    id: string;
    title: string;
    text?: string;
}

export interface ShowcaseComplectationSection {
    id: string;
    title: string;
    items: ShowcaseComplectationItem[];
}

export interface ShowcaseComplectationStage {
    id: string;
    title: string;
    text: string;
}

export interface ShowcaseComplectation {
    about: string;
    sections: ShowcaseComplectationSection[];
    stages: ShowcaseComplectationStage[];
}

export type ShowcaseVideoKind = "timelapse" | "review";

export interface ShowcaseVideo {
    kind: ShowcaseVideoKind;
    poster: string;
    src: string;
}

export interface ShowcaseHeatCalc {
    walls: number;
    roof: number;
    floor: number;
    windows: number;
    doors: number;
}

export type CustomerAltStatus = "built" | "building";

export interface CustomerAltItem {
    code: string;
    title: string;
    status: CustomerAltStatus;
    images: string[];
}

export interface CustomerAltVideo {
    code: string;
    title: string;
    status: CustomerAltStatus;
    poster: string;
    src: string;
}

export interface ShowcaseCustomerAlts {
    plans: CustomerAltItem[];
    facades: CustomerAltItem[];
    timelapses: CustomerAltVideo[];
}

export interface ShowcasePayload {
    lead: string;
    about: ShowcaseAboutBlock[];
    mosaic: ShowcaseMosaic | null;
    plans: ProjectFloorPlan[];
    facades: ShowcaseFacade[];
    sectionDrawings: ShowcaseFacade[];
    decor: ShowcaseDecorItem[];
    story: ShowcaseStory | null;
    gallery: string[];
    builtPhotos: string[];
    videos: ShowcaseVideo[];
    complectation: ShowcaseComplectation | null;
    priceHike: ShowcasePriceHike | null;
    heatCalc: ShowcaseHeatCalc | null;
    customerAlts: ShowcaseCustomerAlts | null;
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

export interface MethodsHubCard {
    tech: Technology;
    title: string;
    description: string;
    href: string;
    image: string;
    count: number;
}

export interface MethodsHubPayload {
    heading: string;
    lead: string;
    moreLabel: string;
    cards: MethodsHubCard[];
}

export type WorksHubTechGroup = "stone" | "frame";

export interface WorksHubStageCard {
    id: WorksHubTechGroup;
    title: string;
    image: string;
    href: string;
}

export interface WorksStagesHubCard {
    id: WorksHubTechGroup;
    title: string;
    lead: string;
    ctaLabel: string;
    href: string;
    image: string;
}

export interface WorksStagesHubVisit {
    heading: string;
    lead: string;
    ctaLabel: string;
    image: string;
}

export interface WorksStagesHubPayload {
    heading: string;
    crumbCurrent: string;
    cards: WorksStagesHubCard[];
    visit: WorksStagesHubVisit;
}

export interface WorksStageNavItem {
    id: string;
    title: string;
    href: string | null;
    current: boolean;
}

export interface WorksStageTag {
    id: string;
    title: string;
    photos: string[];
}

export interface WorksStagePayload {
    techId: string;
    techTitle: string;
    sectionId: string;
    sectionTitle: string;
    subsectionId: string;
    subsectionTitle: string;
    secretVideo: string | null;
    menu: WorksStageNavItem[];
    chips: WorksStageNavItem[];
    tags: WorksStageTag[];
}

export interface WorksHubLocation {
    label: string;
    count: number;
    built: number;
    building: number;
    href: string;
}

export interface WorksMapWorkType {
    id: string;
    label: string;
}

export interface WorksMapPoint {
    slug: string;
    title: string;
    lat: number;
    lng: number;
    status: "built" | "in-progress";
    workTypes: string[];
    href: string;
    place: string | null;
    term: string | null;
    area: string | null;
}

export interface WorksHubPayload {
    heading: string;
    crumbCurrent: string;
    hero: { image: string; href: string; label: string };
    stagesHeading: string;
    stagesSeeLabel: string;
    stagesSeeHref: string;
    stages: WorksHubStageCard[];
    mapHeading: string;
    workTypes: WorksMapWorkType[];
    mapPoints: WorksMapPoint[];
    visitHeading: string;
    visitLead: string;
    visitCta: string;
}
