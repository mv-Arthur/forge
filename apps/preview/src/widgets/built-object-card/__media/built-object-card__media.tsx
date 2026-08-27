"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatArea, formatTechnologyBrand } from "@/lib/format";
import { MapPinIcon } from "@/ui/icons";
import type { BuiltObjectCardProps } from "../built-object-card.types";

export function BuiltObjectCard({
    object,
    compact = false,
}: BuiltObjectCardProps) {
    const [failed, setFailed] = useState(false);
    const src = object.heroImage || object.gallery[0];
    if (!src || failed) return null;

    const inProgress = object.status === "in-progress";
    const place = object.locationLabel;

    return (
        <Link
            href={`/works/${object.slug}`}
            className="card card-hover group flex flex-col overflow-hidden"
        >
            <div
                className={`relative ${compact ? "aspect-[4/3]" : "aspect-[16/11]"} overflow-hidden bg-ink-100`}
            >
                <Image
                    src={src}
                    alt={object.displayTitle}
                    fill
                    sizes="(min-width:1024px) 25vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-expo group-hover:scale-105"
                    onError={() => setFailed(true)}
                />
                <div className="absolute left-3 top-3">
                    <span
                        className={`badge ${
                            inProgress ? "badge-progress" : "badge-built"
                        }`}
                    >
                        {inProgress ? "Строится" : "Построен"}
                    </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16 text-white">
                    {place ? (
                        <div className="flex items-center gap-1.5 text-[13px] font-semibold">
                            <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0 opacity-90" />
                            <span className="truncate">{place}</span>
                        </div>
                    ) : (
                        <div className="line-clamp-1 text-[13px] font-semibold">
                            {object.displayTitle}
                        </div>
                    )}
                    {!compact ? (
                        <div className="mt-1 line-clamp-1 text-[12px] text-white/75">
                            {[
                                formatTechnologyBrand(object.technology),
                                object.area != null
                                    ? formatArea(object.area)
                                    : null,
                            ]
                                .filter(Boolean)
                                .join(" · ")}
                        </div>
                    ) : null}
                </div>
            </div>
            {!compact ? (
                <div className="flex flex-1 items-center justify-between gap-2 p-4">
                    <div className="min-w-0 text-[13px] font-semibold text-ink-900">
                        {object.displayTitle}
                    </div>
                    <span className="flex-shrink-0 text-[13px] font-semibold text-ink-950 group-hover:text-accent">
                        Смотреть →
                    </span>
                </div>
            ) : (
                <div className="flex items-center justify-between gap-2 border-t border-ink-150 p-3 text-[12px]">
                    <span className="font-semibold text-ink-700">
                        {object.area != null ? formatArea(object.area) : "—"}
                    </span>
                    <span className="text-ink-500 group-hover:text-ink-950">
                        Смотреть →
                    </span>
                </div>
            )}
        </Link>
    );
}
