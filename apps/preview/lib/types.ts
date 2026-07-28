export type Technology =
    | "frame"
    | "gas_concrete"
    | "brick"
    | "sip"
    | "fachwerk";

export type Floors = "1" | "1.5" | "2" | "mansard";

export type Style =
    | "scandinavian"
    | "modern"
    | "classic"
    | "loft"
    | "barn"
    | "provance"
    | "european";

export type PurposeType = "permanent" | "seasonal" | "guest";

export interface ProjectPackage {
    name: string;
    price: number;
}

/** Состав «Дом по узлам» с legacy (product-page__set-*). */
export interface PackageSetNode {
    tab: string;
    title: string;
    price: number | null;
    items: string[];
    image: string | null;
}

export interface PackageSetPackage {
    name: string;
    nodes: PackageSetNode[];
}

export interface PackageSet {
    packages: PackageSetPackage[];
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

export interface MergedProject extends RawProject {
    displayName: string;
    code: string;
    subtitle: string;
    style: Style;
    livingType: PurposeType;
    livingArea: number | null;
    builtUpArea: number | null;
    ceilingHeight: number;
    buildTime: string;
    warranty: number;
    priceFrom: number;
    mortgageFrom: number;
    heroImage: string;
    /** Только сданные (status === built). */
    builtCount: number;
    /** Сейчас в работе (status === in-progress). */
    buildingCount: number;
    isFeatured: boolean;
    isDiscounted: boolean;
    oldPrice: number | null;
    discountLabel: string | null;
    priceValidAt: string | null;
    planEditable: boolean;
    facadeFinish: string;
    hasTerrace: boolean;
    rooms: RoomSpec[];
}

export interface RoomSpec {
    name: string;
    area: number;
    floor: number;
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

export interface BuiltMilestone {
    label: string;
    date: string;
    done: boolean;
    note?: string;
}

export interface EnrichedBuiltObject extends BuiltObject {
    displayTitle: string;
    heroImage: string | null;
    baseProjectSlug: string | null;
    area: number;
    livingArea: number;
    bedrooms: number;
    bathrooms: number;
    kitchenArea: number | null;
    objectType: string;
    locationLabel: string;
    hasTerrace: boolean;
    hasSauna: boolean;
    hasGarage: boolean;
    photosByStage: {
        foundation: string[];
        walls: string[];
        roof: string[];
        facade: string[];
        interior: string[];
    };
    contractDate: string;
    buildStartDate: string;
    moveInDate: string | null;
    buildTermLabel: string;
    durationMonths: number;
    progress: number;
    price: number | null;
    showPrice: boolean;
    ownerName: string;
    familyComposition: string;
    story: string;
    hasReview: boolean;
    reviewQuote: string;
    reviewAuthor: string;
    utilityCost: string;
    foreman: string;
    crewSize: number;
    features: string[];
    materials: string[];
    worksDone: string[];
    milestones: BuiltMilestone[];
    highlights: string[];
    stageCaptions: Record<string, string>;
}

export interface Settings {
    phone: string;
    phoneClean: string;
    telegram: string;
    whatsapp: string;
    mortgageRate: number;
    mortgageTermYears: number;
    warrantyYears: number;
    yearsOnMarket: number;
    builtHouses: number;
    metersProduced: number;
    recommendRate: number;
    officeHoursLabel: string;
    cityLabel: string;
}
