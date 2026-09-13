"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MergedProject } from "@/types/catalog";
import {
    DETAIL_BACK,
    DETAIL_COMPARE,
    DETAIL_COMPARED,
    DETAIL_LIKE,
} from "@/lib/copy";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    GridViewIcon,
    ThumbUpIcon,
    ThumbUpSolidIcon,
} from "@/ui/icons";
import { Container } from "@/ui/container";
import {
    formatLikeCount,
    isCompared,
    isLiked,
    likeCount,
    toggleCompared,
    toggleLiked,
} from "@/widgets/project-card/lib/prefs";
import styles from "./project-detail__gallery.module.css";

interface Props {
    project: MergedProject;
}

export function ProjectDetailGallery({ project }: Props) {
    const images = project.renders.length
        ? project.renders
        : project.heroImage
          ? [project.heroImage]
          : [];
    const [i, setI] = useState(0);
    const [liked, setLiked] = useState(false);
    const [compared, setCompared] = useState(false);
    const n = images.length;
    const src = images[i] || "";
    const likes = formatLikeCount(likeCount(project.slug, liked));

    useEffect(() => {
        setLiked(isLiked(project.slug));
        setCompared(isCompared(project.slug));
    }, [project.slug]);

    const go = (dir: 1 | -1) => {
        if (n < 2) return;
        setI((x) => (x + dir + n) % n);
    };

    return (
        <div className={styles.root}>
            {src ? (
                <Image
                    src={src}
                    alt={project.displayName}
                    fill
                    priority
                    unoptimized={src.startsWith("/media/")}
                    className={styles.photo}
                    sizes="100vw"
                />
            ) : null}
            <div className={styles.veil} />

            {n > 1 ? (
                <>
                    <button
                        type="button"
                        onClick={() => go(-1)}
                        className={`${styles.hit} ${styles.prev}`}
                        aria-label="Предыдущее фото"
                    >
                        <ChevronLeftIcon className={styles.iconMd} />
                    </button>
                    <button
                        type="button"
                        onClick={() => go(1)}
                        className={`${styles.hit} ${styles.next}`}
                        aria-label="Следующее фото"
                    >
                        <ChevronRightIcon className={styles.iconMd} />
                    </button>
                </>
            ) : null}

            <Container className={styles.inner}>
                <div className={styles.top}>
                    <Link href="/projects" className={styles.back}>
                        <ChevronLeftIcon className={styles.icon} />
                        {DETAIL_BACK}
                    </Link>
                    <div className={styles.acts}>
                        <button
                            type="button"
                            className={styles.pill}
                            aria-pressed={compared}
                            onClick={() =>
                                setCompared(toggleCompared(project.slug))
                            }
                        >
                            <GridViewIcon className={styles.icon} />
                            {compared ? DETAIL_COMPARED : DETAIL_COMPARE}
                        </button>
                        <button
                            type="button"
                            className={styles.pill}
                            aria-pressed={liked}
                            aria-label={`${DETAIL_LIKE}, ${likes}`}
                            onClick={() => setLiked(toggleLiked(project.slug))}
                        >
                            {liked ? (
                                <ThumbUpSolidIcon className={styles.icon} />
                            ) : (
                                <ThumbUpIcon className={styles.icon} />
                            )}
                            <span className={styles.nums}>{likes}</span>
                        </button>
                    </div>
                </div>

                <div className={styles.copy}>
                    <h1 className={styles.name}>{project.displayName}</h1>
                    {project.subtitle ? (
                        <p className={styles.lead}>{project.subtitle}</p>
                    ) : null}
                </div>

                {n > 1 ? (
                    <div className={styles.dots}>
                        {images.map((img, idx) => (
                            <button
                                key={img + idx}
                                type="button"
                                aria-label={`Слайд ${idx + 1}`}
                                onClick={() => setI(idx)}
                                className={`${styles.dot} ${
                                    idx === i ? styles.dotOn : ""
                                }`}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles.spacer} />
                )}
            </Container>
        </div>
    );
}
