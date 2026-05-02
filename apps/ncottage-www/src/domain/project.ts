import type {
    ProjectFeature,
    ProjectLivingType,
    ProjectStyle,
    Technology,
} from "./technology";

export type {
    ProjectFeature,
    ProjectLivingType,
    ProjectStyle,
    Technology,
} from "./technology";

interface ProjectSpecs {
    dimensions: string;
    roofType: string;
    foundation: string;
    wallMaterial: string;
    buildTime: string;
}

export interface ProjectFloorPlan {
    label: string;
    image: string;
    area?: number;
    rooms?: { name: string; area: number }[];
}

export interface ProjectPackage {
    name: string;
    price: number;
    tagline?: string;
    highlighted?: boolean;
    includes: { label: string; value: string }[];
}

export interface ProjectOption {
    label: string;
    price: number;
    note?: string;
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
    floorPlans?: ProjectFloorPlan[];
    packages?: ProjectPackage[];
    options?: ProjectOption[];
    relatedObjectIds?: string[];
    pdfUrl?: string;
}

export interface BuiltObject {
    id: string;
    title: string;
    image: string;
    href: string;
    area?: number;
    location?: string;
    coords?: { lat: number; lng: number };
}
