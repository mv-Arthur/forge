"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AreaIcon, SizeIcon } from "@/ui/icons";
import { formatArea, formatTechnologyBrand } from "@/lib/format";
import { WORKS_GALLERY_PHOTO_LABEL } from "@/lib/copy";
import { previewPhotos, stillPhotos } from "../lib/photos";
import type { WorksCatalogItemProps } from "../works-catalog.types";
import styles from "./works-catalog__item.module.css";

const MIN_PHOTO_W = 640;

export function WorksCatalogItem({ object, onOpen }: WorksCatalogItemProps) {
    const photos = stillPhotos(object);
    const candidates = previewPhotos(object);
    const [dropped, setDropped] = useState<Set<string>>(() => new Set());
    const previews = useMemo(() => {
        const next = candidates.filter((src) => !dropped.has(src));
        return next.length > 0 ? next : candidates;
    }, [candidates, dropped]);
    const [hover, setHover] = useState(0);
    const n = previews.length;
    const slide = n > 0 ? Math.min(hover, n - 1) : 0;
    const count = photos.length;
    const techLabel = object.technology
        ? formatTechnologyBrand(object.technology)
        : null;

    function onMove(e: React.PointerEvent<HTMLButtonElement>) {
        if (n < 2) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const t = (e.clientX - rect.left) / Math.max(1, rect.width);
        const next = Math.min(n - 1, Math.max(0, Math.floor(t * n)));
        if (next !== hover) setHover(next);
    }

    function dropTiny(src: string, width: number) {
        if (width > 0 && width < MIN_PHOTO_W) {
            setDropped((current) => {
                if (current.has(src)) return current;
                const next = new Set(current);
                next.add(src);
                return next;
            });
        }
    }

    return (
        <article className={styles.root}>
            <button
                type="button"
                className={styles.preview}
                onPointerMove={onMove}
                onPointerLeave={() => setHover(0)}
                onClick={() => onOpen(object.slug, slide)}
                aria-label={object.displayTitle}
            >
                {previews.map((src, i) => (
                    <Image
                        key={src}
                        src={src}
                        alt=""
                        fill
                        unoptimized
                        sizes="(min-width:768px) 50vw, 100vw"
                        onLoad={(e) =>
                            dropTiny(src, e.currentTarget.naturalWidth)
                        }
                        className={`${styles.image} ${
                            i === slide ? styles.imageOn : ""
                        }`}
                    />
                ))}
                {n > 1 ? (
                    <span className={styles.markers} aria-hidden>
                        {previews.map((src, i) => (
                            <span
                                key={src}
                                className={`${styles.marker} ${
                                    i === slide ? styles.markerOn : ""
                                }`}
                            />
                        ))}
                    </span>
                ) : null}
                {count > 0 ? (
                    <span className={styles.counter}>
                        <span>{count}</span>
                        {WORKS_GALLERY_PHOTO_LABEL}
                    </span>
                ) : null}
            </button>
            <h2 className={styles.name}>{object.displayTitle}</h2>
            <div className={styles.props}>
                {object.area != null ? (
                    <div className={styles.prop}>
                        <AreaIcon className={styles.icon} />
                        {formatArea(object.area)}
                    </div>
                ) : null}
                {techLabel && techLabel !== "—" ? (
                    <div className={styles.prop}>
                        <SizeIcon className={styles.icon} />
                        <span>{techLabel}</span>
                    </div>
                ) : null}
            </div>
        </article>
    );
}
