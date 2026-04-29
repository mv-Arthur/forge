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

export type ProjectStyle =
    | "modern"
    | "finnish"
    | "german"
    | "loft"
    | "chalet"
    | "hi-tech"
    | "minimalism";

export type ProjectFeature =
    | "panoramic-windows"
    | "second-light"
    | "guest"
    | "with-utilities"
    | "ready"
    | "balcony"
    | "bay-window"
    | "boiler-room"
    | "garage"
    | "terrace"
    | "attic";

export type ProjectLivingType = "permanent" | "seasonal";

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
    style: ProjectStyle;
    features: ProjectFeature[];
    livingType: ProjectLivingType;
    featured: boolean;
}
