"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { MergedProject } from "@/lib/types";
import { formatArea } from "@/lib/format";
import {
    displayLikeCount,
    isCompared,
    isLiked,
    toggleCompare,
    toggleLike,
} from "@/lib/likes";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CloseIcon,
    CompareIcon,
    ExpandIcon,
    HeartIcon,
} from "./Icons";

interface Props {
    project: MergedProject;
}

/**
 * Большой hero-слайдер на всю ширину (как GWD): фото, оверлей с кодом/описанием,
 * лайк и сравнение, точки, стрелки, lightbox.
 */
export function ProjectHero({ project }: Props) {
    const images = project.renders;
    const total = images.length;
    const [active, setActive] = useState(0);
    const [lightbox, setLightbox] = useState(false);
    const [liked, setLiked] = useState(false);
    const [compared, setCompared] = useState(false);

    useEffect(() => {
        setLiked(isLiked(project.slug));
        setCompared(isCompared(project.slug));
    }, [project.slug]);

    const next = useCallback(() => {
        if (total < 2) return;
        setActive((n) => (n + 1) % total);
    }, [total]);
    const prev = useCallback(() => {
        if (total < 2) return;
        setActive((n) => (n - 1 + total) % total);
    }, [total]);

    useEffect(() => {
        if (!lightbox) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightbox(false);
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [lightbox, next, prev]);

    useEffect(() => {
        if (lightbox || total < 2) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightbox, total, next, prev]);

    const blurb =
        project.description &&
        !/☎|\+7\s*\(|Цены на строительство/i.test(project.description)
            ? project.description
            : [
                  project.subtitle,
                  project.area ? `площадь ${formatArea(project.area)}` : null,
              ]
                  .filter(Boolean)
                  .join(", ") + ".";

    if (total === 0) {
        return (
            <div className="grid h-[50vh] min-h-[360px] place-items-center bg-ink-100 text-ink-500">
                нет фото
            </div>
        );
    }

    return (
        <>
            <section className="relative h-[min(78vh,720px)] min-h-[420px] w-full overflow-hidden bg-ink-900">
                <Image
                    src={images[active]}
                    alt={`${project.displayName} · ${active + 1}/${total}`}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                {/* Тёмный фильтр на всё фото — текст читается, как у GWD */}
                <div className="pointer-events-none absolute inset-0 bg-black/40" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/30 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/45 to-transparent" />

                <div className="absolute inset-0 z-10 flex flex-col">
                    <div className="container-page pt-4 md:pt-5">
                        <div className="flex items-start justify-between gap-4">
                            <Link
                                href="/projects"
                                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-white/90 transition hover:text-white"
                                style={{
                                    textShadow: "0 1px 8px rgba(0,0,0,0.55)",
                                }}
                            >
                                <ChevronLeftIcon className="h-4 w-4" />
                                Каталог проектов
                            </Link>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCompared(toggleCompare(project.slug))
                                    }
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold shadow-sm backdrop-blur-sm transition ${
                                        compared
                                            ? "bg-ink-950 text-white"
                                            : "bg-white/90 text-ink-800 hover:bg-white"
                                    }`}
                                    aria-pressed={compared}
                                >
                                    <CompareIcon className="h-4 w-4" />
                                    <span className="hidden sm:inline">
                                        {compared ? "В сравнении" : "Сравнить"}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setLiked(toggleLike(project.slug))
                                    }
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold shadow-sm backdrop-blur-sm transition ${
                                        liked
                                            ? "bg-white text-accent"
                                            : "bg-white/90 text-ink-800 hover:bg-white"
                                    }`}
                                    aria-pressed={liked}
                                    aria-label={
                                        liked
                                            ? "Убрать из избранного"
                                            : "В избранное"
                                    }
                                >
                                    <HeartIcon
                                        className="h-4 w-4"
                                        filled={liked}
                                    />
                                    <span className="tabular-nums">
                                        {displayLikeCount(
                                            project.slug,
                                            liked,
                                        ).toLocaleString("ru-RU")}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Ближе к «Каталог» — не висит посредине кадра */}
                        <div className="mt-4 max-w-lg md:mt-5 md:max-w-xl">
                            <h1
                                className="font-display text-[36px] font-extrabold tracking-tight text-white md:text-[44px]"
                                style={{
                                    textShadow:
                                        "0 2px 24px rgba(0,0,0,0.65), 0 1px 4px rgba(0,0,0,0.5)",
                                }}
                            >
                                {project.displayName}
                            </h1>
                            <p
                                className="mt-2 max-w-md text-[14px] leading-relaxed text-white md:text-[15px]"
                                style={{
                                    textShadow:
                                        "0 1px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)",
                                }}
                            >
                                {blurb}
                            </p>
                        </div>
                    </div>

                    {total > 1 ? (
                        <>
                            <button
                                type="button"
                                onClick={prev}
                                className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow transition hover:bg-white md:left-5"
                                aria-label="Предыдущее фото"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={next}
                                className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow transition hover:bg-white md:right-5"
                                aria-label="Следующее фото"
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </>
                    ) : null}

                    <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
                        {total > 1 ? (
                            <div className="flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5 backdrop-blur-sm">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setActive(i)}
                                        aria-label={`Фото ${i + 1}`}
                                        className={`h-1.5 rounded-full transition-all ${
                                            i === active
                                                ? "w-5 bg-white"
                                                : "w-1.5 bg-white/45 hover:bg-white/70"
                                        }`}
                                    />
                                ))}
                            </div>
                        ) : null}
                        <button
                            type="button"
                            onClick={() => setLightbox(true)}
                            className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink-900 shadow hover:bg-white"
                            aria-label="На весь экран"
                        >
                            <ExpandIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </section>

            {lightbox ? (
                <div
                    className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-4"
                    onClick={() => setLightbox(false)}
                >
                    <button
                        type="button"
                        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightbox(false);
                        }}
                        aria-label="Закрыть"
                    >
                        <CloseIcon className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            prev();
                        }}
                        className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                        aria-label="Предыдущее"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            next();
                        }}
                        className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                        aria-label="Следующее"
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                    <div
                        className="relative h-full max-h-[90vh] w-full max-w-6xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[active]}
                            alt=""
                            fill
                            sizes="90vw"
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-white/10 px-3 py-1 text-sm text-white backdrop-blur">
                        {active + 1} / {total}
                    </div>
                </div>
            ) : null}
        </>
    );
}
