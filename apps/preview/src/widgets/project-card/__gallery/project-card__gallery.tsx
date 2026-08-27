"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/ui/icons";
import type { ProjectCardLayout } from "../project-card.types";

export function ProjectCardGallery({
    href,
    name,
    hero,
    images,
    layout,
    priority,
}: {
    href: string;
    name: string;
    hero: string;
    images: string[];
    layout: ProjectCardLayout;
    priority: boolean;
}) {
    const wide = layout === "wide";
    const [slide, setSlide] = useState(0);
    const total = images.length;

    const advance = (dir: 1 | -1) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (total < 2) return;
        setSlide((n) => (n + dir + total) % total);
    };

    return (
        <div
            className={`relative overflow-hidden bg-ink-100 ${
                wide ? "aspect-[16/10] min-h-[240px]" : "aspect-[4/3]"
            }`}
        >
            <Link
                href={href}
                className="absolute inset-0 z-[1]"
                aria-label={name}
            />
            {total > 0 || hero ? (
                <Image
                    src={images[slide] || hero}
                    alt={name}
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
    );
}
