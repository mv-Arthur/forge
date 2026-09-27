"use client";

import { useState } from "react";
import {
    COLLECTION_HEADING,
    COLLECTION_LEAD,
    COLLECTION_SEE,
} from "@/lib/copy";
import type { CollectionId } from "@/lib/collections";
import { HomeCollections } from "./home-collections";
import type { HomeCollectionItem } from "./home-collections.types";

export function HomeCollectionsContainer({
    items,
}: {
    items: HomeCollectionItem[];
}) {
    const [active, setActive] = useState<CollectionId>(
        () => items[0]?.id ?? "second_light"
    );

    if (items.length === 0) return null;

    const current = items.some((item) => item.id === active)
        ? active
        : items[0].id;
    const index = items.findIndex((item) => item.id === current);

    return (
        <HomeCollections
            heading={COLLECTION_HEADING}
            lead={COLLECTION_LEAD}
            cta={COLLECTION_SEE}
            items={items}
            active={current}
            onSelect={setActive}
            onPrev={() =>
                setActive(items[(index - 1 + items.length) % items.length].id)
            }
            onNext={() => setActive(items[(index + 1) % items.length].id)}
        />
    );
}
