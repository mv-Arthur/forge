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

export interface MergedProject extends RawProject {
    displayName: string;
    subtitle: string;
    priceFrom: number | null;
    mortgageFrom: number | null;
    heroImage: string;
    hasTerrace: boolean;
    warranty: number;
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
