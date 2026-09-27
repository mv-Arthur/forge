"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    WORKS_GALLERY_ALL_MATERIALS,
    WORKS_GALLERY_AREA,
    WORKS_GALLERY_CLEAR,
    WORKS_GALLERY_MATERIALS,
    WORKS_GALLERY_RANGE_CLEAR,
    WORKS_MAP_BUILDING,
    WORKS_MAP_BUILT,
    WORKS_STAGE_FRAME,
    WORKS_STAGE_STONE,
} from "@/lib/copy";
import { formatTechnologyBrand } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { EnrichedBuiltObject, Technology } from "@/types/catalog";
import {
    isTechnology,
    isWorksTechGroup,
    listWorksTechnologies,
    objectPassesWorksFilter,
    parseWorksGallerySearch,
    worksAreaBounds,
    type WorksGalleryQuery,
} from "@/lib/worksFilter";
import { WorksCatalogFilters } from "./__filters/works-catalog__filters";
import { WorksCatalogLightbox } from "./__lightbox/works-catalog__lightbox";
import { WorksCatalog } from "./works-catalog";
import styles from "./works-catalog.module.css";

export function WorksCatalogContainer({
    objects,
}: {
    objects: EnrichedBuiltObject[];
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = useMemo(
        () => parseWorksGallerySearch(searchParams),
        [searchParams],
    );
    const scoped = useMemo(
        () =>
            objects.filter((object) =>
                objectPassesWorksFilter(object, {
                    ...query,
                    areaMin: undefined,
                    areaMax: undefined,
                }),
            ),
        [objects, query],
    );
    const bounds = useMemo(() => worksAreaBounds(scoped), [scoped]);
    const materials = useMemo(
        () =>
            listWorksTechnologies(objects).map((id) => ({
                id,
                label: formatTechnologyBrand(id),
            })),
        [objects],
    );
    const [areaFrom, setAreaFrom] = useState(bounds.min);
    const [areaTo, setAreaTo] = useState(bounds.max);
    const [album, setAlbum] = useState<{ slug: string; index: number } | null>(
        null,
    );

    useEffect(() => {
        setAreaFrom(bounds.min);
        setAreaTo(bounds.max);
    }, [bounds.min, bounds.max]);

    const areaEnabled = bounds.max > bounds.min;
    const areaDirty = areaFrom !== bounds.min || areaTo !== bounds.max;

    const filtered = useMemo(
        () =>
            objects.filter((object) =>
                objectPassesWorksFilter(object, {
                    ...query,
                    areaMin: areaEnabled && areaDirty ? areaFrom : undefined,
                    areaMax: areaEnabled && areaDirty ? areaTo : undefined,
                }),
            ),
        [objects, query, areaFrom, areaTo, areaEnabled, areaDirty],
    );

    const selected: Technology | "all" | null = query.tech
        ? isTechnology(query.tech)
            ? query.tech
            : null
        : "all";

    const replaceQuery = useCallback(
        (next: WorksGalleryQuery) => {
            router.replace(
                routes.worksGallery({
                    tech: next.tech,
                    location: next.location,
                    status: next.status,
                }),
                { scroll: false },
            );
        },
        [router],
    );

    const onOpen = useCallback((slug: string, index: number) => {
        setAlbum({ slug, index });
    }, []);
    const onIndex = useCallback((index: number) => {
        setAlbum((current) =>
            current ? { ...current, index } : current,
        );
    }, []);
    const onClose = useCallback(() => setAlbum(null), []);

    const extraParts: string[] = [];
    if (query.tech === "stone") extraParts.push(WORKS_STAGE_STONE);
    if (query.tech === "frame") extraParts.push(WORKS_STAGE_FRAME);
    if (query.status === "built") extraParts.push(WORKS_MAP_BUILT);
    if (query.status === "in-progress") extraParts.push(WORKS_MAP_BUILDING);
    if (query.location) extraParts.push(query.location);

    const extraFilter =
        extraParts.length > 0 ? (
            <p className={styles.extra}>
                {extraParts.join(" · ")}
                {" · "}
                <Link href={routes.worksGallery()} className={styles.clear}>
                    {WORKS_GALLERY_CLEAR}
                </Link>
            </p>
        ) : null;

    const albumObject = album
        ? objects.find((object) => object.slug === album.slug)
        : undefined;

    return (
        <WorksCatalog
            objects={filtered}
            extraFilter={extraFilter}
            onOpen={onOpen}
            filters={
                <WorksCatalogFilters
                    areaLabel={WORKS_GALLERY_AREA}
                    areaMin={bounds.min}
                    areaMax={bounds.max}
                    areaFrom={areaFrom}
                    areaTo={areaTo}
                    areaEnabled={areaEnabled}
                    onAreaChange={(from, to) => {
                        setAreaFrom(from);
                        setAreaTo(to);
                    }}
                    onAreaClear={() => {
                        setAreaFrom(bounds.min);
                        setAreaTo(bounds.max);
                    }}
                    areaClearLabel={WORKS_GALLERY_RANGE_CLEAR}
                    materialsLabel={WORKS_GALLERY_MATERIALS}
                    allLabel={WORKS_GALLERY_ALL_MATERIALS}
                    materials={materials}
                    selected={selected}
                    onSelect={(id) =>
                        replaceQuery({
                            ...query,
                            tech: id === "all" ? undefined : id,
                        })
                    }
                />
            }
            lightbox={
                album && albumObject ? (
                    <WorksCatalogLightbox
                        object={albumObject}
                        index={album.index}
                        onIndex={onIndex}
                        onClose={onClose}
                    />
                ) : null
            }
        />
    );
}
