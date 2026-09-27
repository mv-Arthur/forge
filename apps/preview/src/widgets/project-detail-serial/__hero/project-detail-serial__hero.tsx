"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    DETAIL_BACK,
    DETAIL_COMPARE,
    DETAIL_COMPARED,
    DETAIL_LIKE,
} from "@/lib/copy";
import { routes } from "@/lib/routes";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    GridViewIcon,
    ThumbUpIcon,
    ThumbUpSolidIcon,
} from "@/ui/icons";
import {
    formatLikeCount,
    isCompared,
    isLiked,
    likeCount,
    toggleCompared,
    toggleLiked,
} from "@/widgets/project-card/lib/prefs";
import type { MergedProject } from "@/types/catalog";
import styles from "./serial-hero.module.css";

export function ProjectDetailSerialHero({
    project,
    images,
    lead,
}: {
    project: MergedProject;
    images: string[];
    lead: string;
}) {
    const [i, setI] = useState(0);
    const [liked, setLiked] = useState(false);
    const [compared, setCompared] = useState(false);
    const [cursor, setCursor] = useState<{
        x: number;
        y: number;
        dir: -1 | 1;
    } | null>(null);
    const drag = useRef<{ x: number; live: boolean } | null>(null);
    const n = images.length;
    const likes = formatLikeCount(likeCount(project.slug, liked));

    useEffect(() => {
        setLiked(isLiked(project.slug));
        setCompared(isCompared(project.slug));
    }, [project.slug]);

    const go = (dir: -1 | 1) => {
        if (n < 2) return;
        setI((x) => (x + dir + n) % n);
    };

    const onHitMove = (dir: -1 | 1) => (e: React.MouseEvent) => {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }
        setCursor({ x: e.clientX, y: e.clientY, dir });
    };

    const onHitLeave = () => setCursor(null);

    const onPointerDown = (e: React.PointerEvent) => {
        if (n < 2 || e.button !== 0) return;
        drag.current = { x: e.clientX, live: false };
    };

    const onPointerUp = (e: React.PointerEvent, dir: -1 | 1) => {
        const d = drag.current;
        drag.current = null;
        if (!d) return;
        const dx = e.clientX - d.x;
        if (Math.abs(dx) > 40) {
            go(dx < 0 ? 1 : -1);
            return;
        }
        go(dir);
    };

    return (
        <section data-section="detail-hero" className={styles.root}>
            {images.map((img, idx) => (
                <div
                    key={img}
                    className={styles.slide}
                    data-active={idx === i}
                    aria-hidden={idx !== i}
                >
                    <Image
                        src={img}
                        alt=""
                        fill
                        priority={idx === 0}
                        unoptimized
                        sizes="100vw"
                        className={styles.photo}
                    />
                </div>
            ))}
            <div className={styles.veil} />

            <button
                type="button"
                className={`${styles.hit} ${styles.prev}`}
                aria-label="Предыдущее фото"
                onMouseMove={onHitMove(-1)}
                onMouseLeave={onHitLeave}
                onPointerDown={onPointerDown}
                onPointerUp={(e) => onPointerUp(e, -1)}
            />
            <button
                type="button"
                className={`${styles.hit} ${styles.next}`}
                aria-label="Следующее фото"
                onMouseMove={onHitMove(1)}
                onMouseLeave={onHitLeave}
                onPointerDown={onPointerDown}
                onPointerUp={(e) => onPointerUp(e, 1)}
            />

            <div className={styles.chrome}>
                <div className={styles.top}>
                    <div className={styles.intro}>
                        <Link href={routes.projects()} className={styles.back}>
                            <ChevronLeftIcon className={styles.icon} />
                            {DETAIL_BACK}
                        </Link>
                        <div className={styles.copy}>
                            <h1 className={styles.name}>
                                {project.displayName}
                            </h1>
                            {lead ? (
                                <p className={styles.lead}>{lead}</p>
                            ) : null}
                        </div>
                    </div>
                    <div className={styles.acts}>
                        <button
                            type="button"
                            className={styles.pill}
                            aria-pressed={compared}
                            onClick={() =>
                                setCompared(toggleCompared(project.slug))
                            }
                        >
                            <GridViewIcon />
                            {compared ? DETAIL_COMPARED : DETAIL_COMPARE}
                        </button>
                        <button
                            type="button"
                            className={styles.pill}
                            aria-pressed={liked}
                            aria-label={`${DETAIL_LIKE}, ${likes}`}
                            onClick={() => setLiked(toggleLiked(project.slug))}
                        >
                            {liked ? <ThumbUpSolidIcon /> : <ThumbUpIcon />}
                            <span className={styles.count}>{likes}</span>
                        </button>
                    </div>
                </div>

                {n > 1 ? (
                    <div className={styles.dots} role="tablist">
                        {images.map((img, idx) => (
                            <button
                                key={img}
                                type="button"
                                className={styles.dot}
                                data-active={idx === i}
                                aria-label={`Слайд ${idx + 1}`}
                                onClick={() => setI(idx)}
                            />
                        ))}
                    </div>
                ) : null}
            </div>

            {cursor ? (
                <div
                    className={styles.cursor}
                    style={{ left: cursor.x, top: cursor.y }}
                    aria-hidden
                >
                    {cursor.dir < 0 ? (
                        <ChevronLeftIcon />
                    ) : (
                        <ChevronRightIcon />
                    )}
                </div>
            ) : null}
        </section>
    );
}
