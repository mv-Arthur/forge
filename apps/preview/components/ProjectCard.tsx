"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { MergedProject } from "@/lib/types";
import {
    formatArea,
    formatPrice,
    formatTechnologyBrand,
} from "@/lib/format";
import {
    BathIcon,
    BedIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    RulerIcon,
} from "./Icons";

interface Props {
    project: MergedProject;
    priority?: boolean;
    layout?: "wide" | "grid";
}

/** Photo-first catalog card (GWD pattern): image, name, area, price from. */
export function ProjectCard({
    project,
    priority = false,
    layout = "grid",
}: Props) {
    const wide = layout === "wide";
    const [slide, setSlide] = useState(0);
    const images = project.renders.slice(0, 8);
    const total = images.length;
    const href = `/projects/${project.slug}`;
    const hero = project.heroImage || images[0] || "";

    const advance = (dir: 1 | -1) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (total < 2) return;
        setSlide((n) => (n + dir + total) % total);
    };

    const primaryTech =
        project.variants[0]?.technology ?? project.technologies[0] ?? null;
    const techLabel = primaryTech
        ? formatTechnologyBrand(primaryTech)
        : null;

    return (
        <article className="card card-hover group flex h-full flex-col overflow-hidden">
            <div
                className={`relative overflow-hidden bg-ink-100 ${
                    wide
                        ? "aspect-[16/10] min-h-[240px]"
                        : "aspect-[4/3]"
                }`}
            >
                <Link
                    href={href}
                    className="absolute inset-0 z-[1]"
                    aria-label={project.displayName}
                />
                {total > 0 || hero ? (
                    <Image
                        src={images[slide] || hero}
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
                    <div className="grid h-full place-items-center text-ink-500">
                        нет фото
                    </div>
                )}
                {total > 1 ? (
                    <>
                        <button
                            type="button"
                            onClick={advance(-1)}
                            className="absolute left-2 top-1/2 z-[2] grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow transition group-hover:opacity-100"
                            aria-label="Предыдущее фото"
                        >
                            <ChevronLeftIcon className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={advance(1)}
                            className="absolute right-2 top-1/2 z-[2] grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow transition group-hover:opacity-100"
                            aria-label="Следующее фото"
                        >
                            <ChevronRightIcon className="h-4 w-4" />
                        </button>
                    </>
                ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-2.5 p-5 md:p-6">
                <Link
                    href={href}
                    className="font-display text-[1.35rem] font-semibold leading-[1.15] tracking-[-0.01em] text-ink-950 hover:text-accent"
                >
                    {project.displayName}
                </Link>
                {project.subtitle ? (
                    <p className="line-clamp-2 text-sm leading-relaxed text-ink-500">
                        {project.subtitle}
                    </p>
                ) : null}
                <div className="mt-0.5 flex flex-wrap items-center gap-3 text-sm text-ink-600">
                    {project.area != null ? (
                        <span className="inline-flex items-center gap-1">
                            <RulerIcon className="h-3.5 w-3.5" />
                            {formatArea(project.area)}
                        </span>
                    ) : null}
                    {project.bedrooms != null ? (
                        <span className="inline-flex items-center gap-1">
                            <BedIcon className="h-3.5 w-3.5" />
                            {project.bedrooms}
                        </span>
                    ) : null}
                    {project.bathrooms != null ? (
                        <span className="inline-flex items-center gap-1">
                            <BathIcon className="h-3.5 w-3.5" />
                            {project.bathrooms}
                        </span>
                    ) : null}
                    {techLabel ? (
                        <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
                            {techLabel}
                        </span>
                    ) : null}
                </div>
                <div className="mt-auto border-t border-ink-100 pt-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                        под ключ от
                    </div>
                    <div className="mt-1 font-display text-price font-semibold text-ink-950">
                        {formatPrice(project.priceFrom)}
                    </div>
                </div>
            </div>
        </article>
    );
}
