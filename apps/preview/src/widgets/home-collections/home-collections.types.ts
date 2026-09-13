import type { CollectionId } from "@/lib/collections";

export type HomeCollectionItem = {
    id: CollectionId;
    title: string;
    count: number;
    href: string;
    image: string;
    imageAlt: string;
};

export type HomeCollectionsViewProps = {
    heading: string;
    lead: string;
    cta: string;
    items: HomeCollectionItem[];
    active: CollectionId;
    onSelect: (id: CollectionId) => void;
    onPrev: () => void;
    onNext: () => void;
};
