"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MergedProject } from "@/types/catalog";
import { formatPrice } from "@/lib/format";
import { ChevronLeftIcon, ChevronRightIcon } from "@/ui/icons";

interface Props {
    project: MergedProject;
}

/** Full-bleed detail hero with multi-render gallery (GWD-like). */
export function ProjectDetailGallery({ project }: Props) {
    const images = project.renders.length
        ? project.renders
        : project.heroImage
          ? [project.heroImage]
          : [];
    const [i, setI] = useState(0);
    const n = images.length;
    const src = images[i] || "";

    const go = (dir: 1 | -1) => {
        if (n < 2) return;
        setI((x) => (x + dir + n) % n);
    };

    return (
        <div className="relative min-h-[62vh] bg-ink-900 text-paper md:min-h-[74vh]">
            {src ? (
                <Image
                    src={src}
                    alt={project.displayName}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/92 via-ink-900/40 to-ink-950/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/55 via-transparent to-transparent" />

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

            <div className="container-page relative z-[2] flex min-h-[62vh] flex-col justify-end pb-12 pt-28 md:min-h-[74vh] md:pb-16">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-onDark">
                    <Link href="/projects" className="hover:text-paper">
                        Проекты
                    </Link>
                    {project.dimensions ? (
                        <>
                            {" "}
                            · {project.dimensions}
                        </>
                    ) : null}
                </div>
                <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-paper">
                    {project.displayName}
                </h1>
                {project.subtitle ? (
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-300 md:text-lg">
                        {project.subtitle}
                    </p>
                ) : null}
                <div className="mt-6 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-none text-paper">
                    {project.priceFrom
                        ? `от ${formatPrice(project.priceFrom)}`
                        : "цена по запросу"}
                </div>
                {n > 1 ? (
                    <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                        {images.slice(0, 8).map((img, idx) => (
                            <button
                                key={img + idx}
                                type="button"
                                onClick={() => setI(idx)}
                                className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                                    idx === i
                                        ? "border-accent"
                                        : "border-transparent opacity-70 hover:opacity-100"
                                }`}
                            >
                                <Image
                                    src={img}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
