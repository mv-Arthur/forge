import Link from "next/link";
import Image from "next/image";
import type { EnrichedBuiltObject } from "@/lib/types";
import { getProject } from "@/lib/data";
import {
    formatArea,
    formatTechnologyBrand,
} from "@/lib/format";
import { MapPinIcon } from "./Icons";

/**
 * Карточка объекта для продажи: фото, место, мост в проект.
 * Без % готовности и «бригада 5 чел» — это не админка.
 */
export function BuiltObjectCard({
    object,
    compact = false,
}: {
    object: EnrichedBuiltObject;
    compact?: boolean;
}) {
    const inProgress = object.status === "in-progress";
    const project = object.baseProjectSlug
        ? getProject(object.baseProjectSlug)
        : null;

    return (
        <Link
            href={`/works/${object.slug}`}
            className="card card-hover group flex flex-col overflow-hidden"
        >
            <div
                className={`relative ${compact ? "aspect-[4/3]" : "aspect-[16/11]"} overflow-hidden bg-ink-100`}
            >
                {object.heroImage ? (
                    <Image
                        src={object.heroImage}
                        alt={object.locationLabel}
                        fill
                        sizes="(min-width:1024px) 25vw, 100vw"
                        className="object-cover transition-transform duration-500 ease-expo group-hover:scale-105"
                    />
                ) : (
                    <div className="grid h-full place-items-center text-ink-500">
                        нет фото
                    </div>
                )}

                <div className="absolute left-3 top-3">
                    <span
                        className={`badge ${
                            inProgress ? "badge-progress" : "badge-built"
                        }`}
                    >
                        {inProgress ? "Можно на площадку" : "Можно приехать"}
                    </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16 text-white">
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold">
                        <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0 opacity-90" />
                        <span className="truncate">{object.locationLabel}</span>
                    </div>
                    {!compact ? (
                        <div className="mt-1 line-clamp-1 text-[12px] text-white/75">
                            {formatTechnologyBrand(object.technology)}
                            {" · "}
                            {formatArea(object.area)}
                            {project ? ` · «${project.displayName}»` : ""}
                        </div>
                    ) : null}
                </div>
            </div>

            {!compact ? (
                <div className="flex flex-1 items-center justify-between gap-2 p-4">
                    <div className="min-w-0">
                        {project ? (
                            <>
                                <div className="text-[11px] uppercase tracking-wider text-ink-500">
                                    По проекту
                                </div>
                                <div className="truncate font-semibold text-ink-950">
                                    {project.displayName}
                                </div>
                            </>
                        ) : (
                            <div className="text-[13px] font-semibold text-ink-900">
                                {inProgress
                                    ? "Идёт стройка — покажем этап"
                                    : "Сданный дом — покажем изнутри"}
                            </div>
                        )}
                    </div>
                    <span className="flex-shrink-0 text-[13px] font-semibold text-ink-950 group-hover:text-accent">
                        Смотреть →
                    </span>
                </div>
            ) : (
                <div className="flex items-center justify-between gap-2 border-t border-ink-150 p-3 text-[12px]">
                    <span className="font-semibold text-ink-700">
                        {formatArea(object.area)}
                        {project ? ` · ${project.displayName}` : ""}
                    </span>
                    <span className="text-ink-500 group-hover:text-ink-950">
                        Смотреть →
                    </span>
                </div>
            )}
        </Link>
    );
}
