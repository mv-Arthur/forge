export type CollectionId =
    | "second_light"
    | "panorama"
    | "flat_roof"
    | "garage"
    | "terrace";

export const COLLECTION_ORDER: CollectionId[] = [
    "second_light",
    "panorama",
    "flat_roof",
    "garage",
    "terrace",
];

const MATCH: Record<CollectionId, { category: string; feature?: string }> = {
    second_light: {
        category: "doma-so-vtorym-svetom",
        feature: "second_light",
    },
    panorama: { category: "doma-s-panoramnymi-oknami" },
    flat_roof: { category: "doma-s-ploskoj-kryshej" },
    garage: { category: "doma-s-garazhom" },
    terrace: { category: "doma-s-terrasoj", feature: "terrace" },
};

export function isCollectionId(value: string): value is CollectionId {
    return (COLLECTION_ORDER as string[]).includes(value);
}

export function projectInCollection(
    project: { features?: string[]; categories?: string[] },
    id: CollectionId
): boolean {
    const match = MATCH[id];
    if (match.feature && project.features?.includes(match.feature)) {
        return true;
    }
    return Boolean(project.categories?.includes(match.category));
}
