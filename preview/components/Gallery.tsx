"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CloseIcon,
    ExpandIcon,
} from "./Icons";

interface GalleryProps {
    images: string[];
    alt: string;
    aspectClass?: string;
    priority?: boolean;
}

export function Gallery({
    images,
    alt,
    aspectClass = "aspect-[4/3]",
    priority = false,
}: GalleryProps) {
    const [active, setActive] = useState(0);
    const [lightbox, setLightbox] = useState(false);
    const total = images.length;

    const next = useCallback(
        () => setActive((n) => (n + 1) % total),
        [total],
    );
    const prev = useCallback(
        () => setActive((n) => (n - 1 + total) % total),
        [total],
    );

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

    if (total === 0) {
        return (
            <div className={`grid ${aspectClass} place-items-center rounded-2xl bg-ink-100 text-ink-500`}>
                нет фото
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className={`group relative ${aspectClass} overflow-hidden rounded-2xl bg-ink-900`}>
                <Image
                    src={images[active]}
                    alt={`${alt} · ${active + 1}/${total}`}
                    fill
                    sizes="(min-width:1024px) 65vw, 100vw"
                    className="cursor-zoom-in object-cover"
                    onClick={() => setLightbox(true)}
                    priority={priority && active === 0}
                />
                {total > 1 ? (
                    <>
                        <button
                            type="button"
                            onClick={prev}
                            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow transition group-hover:opacity-100"
                            aria-label="Предыдущее фото"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow transition group-hover:opacity-100"
                            aria-label="Следующее фото"
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur">
                            {active + 1} / {total}
                        </div>
                    </>
                ) : null}
                <button
                    type="button"
                    onClick={() => setLightbox(true)}
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink-900 shadow"
                    aria-label="На весь экран"
                >
                    <ExpandIcon className="h-4 w-4" />
                </button>
            </div>
            {total > 1 ? (
                <div className="scroll-hide flex gap-2 overflow-x-auto pb-1">
                    {images.slice(0, 32).map((src, i) => (
                        <button
                            type="button"
                            key={src + i}
                            onClick={() => setActive(i)}
                            className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                                i === active
                                    ? "border-ink-950"
                                    : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                        >
                            <Image
                                src={src}
                                alt=""
                                fill
                                sizes="96px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            ) : null}

            {lightbox ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
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
                        aria-label="Предыдущее фото"
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
                        aria-label="Следующее фото"
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
        </div>
    );
}
