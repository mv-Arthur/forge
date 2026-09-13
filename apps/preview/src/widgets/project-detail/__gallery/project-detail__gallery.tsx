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
import {
    formatLikeCount,
    isCompared,
    isLiked,
    likeCount,
    toggleCompared,
    toggleLiked,
} from "@/widgets/project-card/lib/prefs";

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
        <div className="relative min-h-[62vh] bg-ink-900 text-paper md:min-h-[78vh]">
            {src ? (
                <Image
                    src={src}
                    alt={project.displayName}
                    fill
                    priority
                    unoptimized={src.startsWith("/media/")}
                    className="object-cover"
                    sizes="100vw"
                />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-ink-950/35" />

            {n > 1 ? (
                <>
                    <button
                        type="button"
                        onClick={() => go(-1)}
                        className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/40 text-paper backdrop-blur md:left-6"
                        aria-label="Предыдущее фото"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => go(1)}
                        className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/40 text-paper backdrop-blur md:right-6"
                        aria-label="Следующее фото"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </>
            ) : null}

            <div className="container-page relative z-[2] flex min-h-[62vh] flex-col pt-8 md:min-h-[78vh] md:pt-10">
                <div className="flex items-start justify-between gap-3">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-paper/90 hover:text-paper"
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                        {DETAIL_BACK}
                    </Link>
                    <div className="flex shrink-0 gap-2">
                        <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-2 text-sm font-semibold text-ink-900 shadow-sm"
                            aria-pressed={compared}
                            onClick={() =>
                                setCompared(toggleCompared(project.slug))
                            }
                        >
                            <GridViewIcon className="h-4 w-4" />
                            {compared ? DETAIL_COMPARED : DETAIL_COMPARE}
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-2 text-sm font-semibold text-ink-900 shadow-sm"
                            aria-pressed={liked}
                            aria-label={`${DETAIL_LIKE}, ${likes}`}
                            onClick={() => setLiked(toggleLiked(project.slug))}
                        >
                            {liked ? (
                                <ThumbUpSolidIcon className="h-4 w-4" />
                            ) : (
                                <ThumbUpIcon className="h-4 w-4" />
                            )}
                            <span className="tabular-nums">{likes}</span>
                        </button>
                    </div>
                </div>

                <div className="mt-10 max-w-3xl md:mt-16">
                    <h1 className="font-display text-[clamp(2.4rem,5vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-paper">
                        {project.displayName}
                    </h1>
                    {project.subtitle ? (
                        <p className="mt-3 max-w-xl text-base leading-relaxed text-paper/85 md:text-lg">
                            {project.subtitle}
                        </p>
                    ) : null}
                </div>

                {n > 1 ? (
                    <div className="mt-auto flex justify-center gap-1.5 pb-6 md:pb-8">
                        {images.map((img, idx) => (
                            <button
                                key={img + idx}
                                type="button"
                                aria-label={`Слайд ${idx + 1}`}
                                onClick={() => setI(idx)}
                                className={`h-2 w-2 rounded-full ${
                                    idx === i ? "bg-paper" : "bg-paper/40"
                                }`}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-auto pb-8" />
                )}
            </div>
        </div>
    );
}
