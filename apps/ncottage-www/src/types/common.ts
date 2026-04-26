export interface Advantage {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export interface Stage {
    step: number;
    title: string;
    description: string;
}

export interface GalleryItem {
    id: string;
    title: string;
    image: string;
}

export interface Category {
    slug: string;
    title: string;
    count: number;
    image: string;
    technology: string;
}

export interface BuiltObject {
    id: string;
    title: string;
    image: string;
    href: string;
}
