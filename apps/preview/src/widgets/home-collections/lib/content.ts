import { COLLECTION_TITLE } from "@/lib/copy";
import {
    COLLECTION_ORDER,
    projectInCollection,
    type CollectionId,
} from "@/lib/collections";
import type { HomeCollectionItem } from "../home-collections.types";

export function collectionImage(id: CollectionId): string {
    return `/media/collections/${id}.jpg`;
}

export function buildCollectionItems(
    projects: Array<{ features: string[]; categories: string[] }>
): HomeCollectionItem[] {
    return COLLECTION_ORDER.flatMap((id) => {
        const count = projects.filter((p) => projectInCollection(p, id)).length;
        if (count === 0) return [];
        const title = COLLECTION_TITLE[id];
        return [
            {
                id,
                title,
                count,
                href: `/projects?collection=${id}`,
                image: collectionImage(id),
                imageAlt: title,
            },
        ];
    });
}
