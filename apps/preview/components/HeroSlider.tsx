"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MergedProject } from "@/lib/types";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

interface Props {
    heading: string;
    lead: string;
    projects: MergedProject[];
    intervalMs?: number;
}

const BANNER = "/images/hero/banner.jpg";

export function HeroSlider({
    heading,
    lead,
    projects,
    intervalMs = 6500,
}: Props) {
    const photos = [
        BANNER,
        ...projects
            .map((p) => p.heroImage || p.renders[0])
            .filter((src): src is string => Boolean(src)),
    ];
    const [i, setI] = useState(0);
    const n = photos.length;

    const go = useCallback(
        (dir: 1 | -1) => {
            if (n < 2) return;
            setI((x) => (x + dir + n) % n);
        },
        [n],
    );

    useEffect(() => {
        if (n < 2 || intervalMs <= 0) return;
        const t = setInterval(() => go(1), intervalMs);
        return () => clearInterval(t);
    }, [n, intervalMs, go, i]);

    return (
        <div
            className="relative min-h-[min(68vh,560px)] overflow-hidden bg-ink-900 text-paper md:min-h-[78vh]"
            aria-roledescription="carousel"
            aria-label="Главная"
            data-hero-slider
        >
            {photos.map((src, idx) => (
                <div
                    key={src + idx}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                        idx === i ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden={idx !== i}
                >
                    <Image
                        src={src}
                        alt=""
                        fill
                        priority={idx === 0}
                        className="object-cover object-[center_40%] md:object-center"
                        sizes="100vw"
                    />
                </div>
            ))}
            <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-ink-950/55 via-ink-950/20 to-transparent md:hidden" />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-ink-950/40 via-ink-950/15 to-transparent md:block" />

            <div className="container-page relative z-[3] flex min-h-[min(68vh,560px)] flex-col justify-end pb-10 pt-24 md:min-h-[78vh] md:pb-16 md:pt-28">
                <div className="max-w-3xl">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-onDark">
                        Санкт-Петербург и Ленобласть
                    </div>
                    <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-paper md:mt-4">
                        {heading}
                    </h1>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-100 md:text-lg">
                        {lead}
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3 md:mt-8">
                        <a href="#lead" className="btn btn-primary btn-lg shadow-cta">
                            Заказать звонок
                        </a>
                        <Link
                            href="/projects"
                            className="btn btn-lg border border-white/55 bg-white/20 text-paper shadow-soft backdrop-blur hover:bg-white/30"
                        >
                            Смотреть проекты
                        </Link>
                    </div>
                </div>

                {n > 1 ? (
                    <div className="mt-10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            {photos.map((src, idx) => (
                                <button
                                    key={src + idx}
                                    type="button"
                                    data-hero-dot
                                    onClick={() => setI(idx)}
                                    className={`h-2 rounded-full transition-all ${
                                        idx === i
                                            ? "w-10 bg-accent"
                                            : "w-2 bg-white/45 hover:bg-white/75"
                                    }`}
                                    aria-label={`Фото ${idx + 1}`}
                                    aria-current={idx === i}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => go(-1)}
                                className="grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-black/25 text-paper backdrop-blur hover:bg-black/45"
                                aria-label="Предыдущий"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => go(1)}
                                className="grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-black/25 text-paper backdrop-blur hover:bg-black/45"
                                aria-label="Следующий"
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
