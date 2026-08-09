"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { MergedProject } from "@/lib/types";
import {
    formatArea,
    formatPrice,
    formatTechnologyBrand,
} from "@/lib/format";
import {
    isCompared,
    isLiked,
    toggleCompare,
    toggleLike,
} from "@/lib/likes";
import {
    BathIcon,
    BedIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CompareIcon,
    HeartIcon,
    RulerIcon,
} from "./Icons";

interface Props {
    project: MergedProject;
    priority?: boolean;
    /** wide = полная ширина (по умолчанию в каталоге), grid = плитка */
    layout?: "wide" | "grid";
}

/**
 * Карточка каталога: фото, минимум текста, цена как у GWD (просто цифры),
 * лайк в localStorage.
 */
export function ProjectCard({
    project,
    priority = false,
    layout = "wide",
}: Props) {
    const wide = layout === "wide";
    const [slide, setSlide] = useState(0);
    const [liked, setLiked] = useState(false);
    const [compared, setCompared] = useState(false);
    const images = project.renders.slice(0, 8);
    const total = images.length;
    const href = `/projects/${project.slug}`;

    useEffect(() => {
        setLiked(isLiked(project.slug));
        setCompared(isCompared(project.slug));
    }, [project.slug]);

    const advance = (dir: 1 | -1) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSlide((n) => (n + dir + total) % total);
    };

    const onLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked(toggleLike(project.slug));
    };

    const onCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCompared(toggleCompare(project.slug));
    };

    const millions =
        project.priceFrom != null && project.priceFrom > 0
            ? (project.priceFrom / 1_000_000).toLocaleString("ru-RU", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 0,
              })
            : null;

    const techLabel = project.technologies[0]
        ? formatTechnologyBrand(project.technologies[0])
        : null;

    return (
        <article className="group relative overflow-hidden rounded-2xl bg-ink-900 shadow-card transition hover:shadow-lift">
            <Link
                href={href}
                className="absolute inset-0 z-[1]"
                aria-label={`${project.displayName}, от ${formatPrice(project.priceFrom)}`}
            />

            <div
                className={`relative overflow-hidden ${
                    wide
                        ? "aspect-[16/10] sm:aspect-[21/9] min-h-[220px] sm:min-h-[280px]"
                        : "aspect-[16/11] sm:aspect-[16/10]"
                }`}
            >
                {total > 0 ? (
                    <Image
                        src={images[slide]}
                        alt={project.displayName}
                        fill
                        sizes={
                            wide
                                ? "(min-width:1024px) 70vw, 100vw"
                                : "(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
                        }
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        priority={priority && slide === 0}
                    />
                ) : (
                    <div className="grid h-full place-items-center bg-ink-100 text-ink-500">
                        нет фото
                    </div>
                )}

                {total > 1 ? (
                    <>
                        <button
                            type="button"
                            onClick={advance(-1)}
                            aria-label="Предыдущее фото"
                            className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink-900 opacity-0 shadow transition group-hover:opacity-100"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={advance(1)}
                            aria-label="Следующее фото"
                            className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink-900 opacity-0 shadow transition group-hover:opacity-100"
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </>
                ) : null}

                {/* Top chips + like — как у GWD */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3">
                    <div className="flex flex-wrap gap-1.5">
                        {project.floors === "1" ? (
                            <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink-900 shadow-sm backdrop-blur-sm">
                                1 этаж
                            </span>
                        ) : null}
                        {techLabel ? (
                            <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink-900 shadow-sm backdrop-blur-sm">
                                {techLabel}
                            </span>
                        ) : null}
                    </div>

                    <div className="pointer-events-auto relative z-20 flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={onCompare}
                            className={`grid h-10 w-10 place-items-center rounded-full shadow-sm backdrop-blur-sm transition ${
                                compared
                                    ? "bg-ink-900 text-white"
                                    : "bg-white/90 text-ink-700 hover:bg-white hover:text-ink-950"
                            }`}
                            aria-label={
                                compared
                                    ? "Убрать из сравнения"
                                    : "Добавить к сравнению"
                            }
                            aria-pressed={compared}
                            title={
                                compared
                                    ? "В сравнении (заглушка)"
                                    : "К сравнению (заглушка)"
                            }
                        >
                            <CompareIcon className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={onLike}
                            className={`inline-flex h-10 items-center gap-1.5 rounded-full px-2.5 shadow-sm backdrop-blur-sm transition ${
                                liked
                                    ? "bg-white text-accent"
                                    : "bg-white/90 text-ink-700 hover:text-accent"
                            }`}
                            aria-label={
                                liked
                                    ? "Убрать из избранного"
                                    : "Добавить в избранное"
                            }
                            aria-pressed={liked}
                        >
                            <HeartIcon className="h-4 w-4" filled={liked} />
                        </button>
                    </div>
                </div>

                {/* Bottom: title + specs + price as plain text (GWD) */}
                <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-4 ${
                        wide ? "pt-24 sm:px-6 sm:pb-5 sm:pt-28" : "pt-20"
                    }`}
                >
                    <div
                        className={`font-display font-extrabold tracking-tight text-white ${
                            wide ? "text-price" : "text-price-sm"
                        }`}
                    >
                        {project.displayName}
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3 text-white/90">
                            <Meta
                                icon={<RulerIcon className="h-3.5 w-3.5" />}
                                value={formatArea(project.area)}
                            />
                            <Meta
                                icon={<BedIcon className="h-3.5 w-3.5" />}
                                value={
                                    project.bedrooms != null
                                        ? String(project.bedrooms)
                                        : "—"
                                }
                            />
                            <Meta
                                icon={<BathIcon className="h-3.5 w-3.5" />}
                                value={
                                    project.bathrooms != null
                                        ? String(project.bathrooms)
                                        : "—"
                                }
                            />
                        </div>
                        {millions ? (
                            <div className="flex-shrink-0 text-right">
                                <div
                                    className={`font-display font-extrabold tracking-tight text-white ${
                                        wide ? "text-price" : "text-price-sm"
                                    }`}
                                >
                                    {millions}{" "}
                                    <span className="text-sm font-bold tracking-wide">
                                        МЛН ₽
                                    </span>
                                </div>
                                <div className="text-xs font-medium uppercase tracking-wider text-white/55">
                                    под ключ от
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </article>
    );
}

function Meta({
    icon,
    value,
}: {
    icon: React.ReactNode;
    value: string;
}) {
    return (
        <div className="flex items-center gap-1 text-xs font-semibold tabular-nums">
            <span className="text-white/65">{icon}</span>
            <span>{value}</span>
        </div>
    );
}
