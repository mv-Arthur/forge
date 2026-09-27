import type { Technology } from "@/types/catalog";

export type HomeTechSlide = {
    id: Technology;
    tab: string;
    title: string;
    lead: string;
    href: string;
    count: number;
    house: string;
    houseAlt: string;
    samples: [
        { src: string; alt: string },
        { src: string; alt: string },
    ];
};

export type HomeTechViewProps = {
    heading: string;
    cta: string;
    slides: HomeTechSlide[];
    thumbs: string[];
    active: Technology;
    onTab: (id: Technology) => void;
};
