"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    DETAIL_ARCHITECT_MORE,
    DETAIL_ARCHITECT_OTHER,
} from "@/lib/copy";
import { formatArea, projectsWord } from "@/lib/format";
import { routes } from "@/lib/routes";
import {
    formatLikeCount,
    isLiked,
    likeCount,
    toggleLiked,
} from "@/widgets/project-card/lib/prefs";
import { HeartIcon, HeartSolidIcon } from "@/ui/icons";
import type { MergedProject } from "@/types/catalog";
import styles from "./individual-other.module.css";

function OtherCard({ project }: { project: MergedProject }) {
    const [liked, setLiked] = useState(false);
    const image = project.heroImage || project.renders[0] || "";
    const likes = formatLikeCount(likeCount(project.slug, liked));

    useEffect(() => {
        setLiked(isLiked(project.slug));
    }, [project.slug]);

    if (!image) return null;

    return (
        <article className={styles.card}>
            <div className={styles.media}>
                <Link
                    href={routes.project(project.slug)}
                    className={styles.shot}
                >
                    <Image
                        src={image}
                        alt={project.displayName}
                        fill
                        unoptimized={image.startsWith("/media/")}
                        sizes="(min-width: 960px) 30vw, 100vw"
                    />
                </Link>
                <button
                    type="button"
                    className={styles.like}
                    aria-pressed={liked}
                    aria-label={`Нравится, ${likes}`}
                    onClick={() => setLiked(toggleLiked(project.slug))}
                >
                    {liked ? <HeartSolidIcon /> : <HeartIcon />}
                    {likes}
                </button>
            </div>
            <Link href={routes.project(project.slug)} className={styles.info}>
                <span className={styles.name}>{project.displayName}</span>
                {project.area != null ? (
                    <span className={styles.area}>
                        {formatArea(project.area)}
                    </span>
                ) : null}
            </Link>
        </article>
    );
}

export function ProjectDetailIndividualOther({
    project,
    works,
    moreCount,
}: {
    project: MergedProject;
    works: MergedProject[];
    moreCount: number;
}) {
    if (works.length === 0) return null;
    const catalogHref = routes.projects({
        kind: project.projectClass === "bath" ? "bath" : "individual",
    });
    const moreLabel =
        moreCount > 0
            ? `${DETAIL_ARCHITECT_MORE} ${moreCount} ${projectsWord(moreCount)}`
            : null;

    return (
        <section data-section="detail-architect" className={styles.root}>
            <div className={styles.inner}>
                <div className={styles.head}>
                    <h2 className={styles.title}>{DETAIL_ARCHITECT_OTHER}</h2>
                    {moreLabel ? (
                        <Link href={catalogHref} className={styles.moreDesk}>
                            <span>{moreLabel}</span>
                            {" →"}
                        </Link>
                    ) : null}
                </div>
                <div className={styles.grid}>
                    {works.map((item) => (
                        <OtherCard key={item.slug} project={item} />
                    ))}
                </div>
                {moreLabel ? (
                    <Link href={catalogHref} className={styles.moreMob}>
                        <span>{moreLabel}</span>
                        {" →"}
                    </Link>
                ) : null}
            </div>
        </section>
    );
}
