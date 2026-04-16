export type Technology =
    | "brick"
    | "gas-concrete"
    | "frame"
    | "sip"
    | "fachwerk"
    | "foam-block"
    | "modular"
    | "combined";

export type TechnologyLabel = {
    [K in Technology]: string;
};

export interface ProjectSpecs {
    dimensions: string;
    roofType: string;
    foundation: string;
    wallMaterial: string;
    buildTime: string;
}

export interface Project {
    slug: string;
    name: string;
    technology: Technology;
    area: number;
    floors: number;
    bedrooms: number;
    bathrooms: number;
    price: number;
    image: string;
    images: string[];
    description: string;
    specs: ProjectSpecs;
    featured: boolean;
}

export interface ProjectFilter {
    priceMin: number | null;
    priceMax: number | null;
    areaMin: number | null;
    areaMax: number | null;
    technology: Technology | null;
    floors: number | null;
}
