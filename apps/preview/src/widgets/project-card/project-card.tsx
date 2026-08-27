import Link from "next/link";
import {
    formatArea,
    formatPrice,
    formatTechnologyBrand,
} from "@/lib/format";
import { BathIcon, BedIcon, RulerIcon } from "@/ui/icons";
import { ProjectCardGallery } from "./__gallery/project-card__gallery";
import type { ProjectCardProps } from "./project-card.types";

export function ProjectCard({
    project,
    priority = false,
    layout = "grid",
}: ProjectCardProps) {
    const images = project.renders.slice(0, 8);
    const href = `/projects/${project.slug}`;
    const hero = project.heroImage || images[0] || "";
    const primaryTech =
        project.variants[0]?.technology ?? project.technologies[0] ?? null;
    const techLabel = primaryTech
        ? formatTechnologyBrand(primaryTech)
        : null;

    return (
        <article className="card card-hover group flex h-full flex-col overflow-hidden">
            <ProjectCardGallery
                href={href}
                name={project.displayName}
                hero={hero}
                images={images}
                layout={layout}
                priority={priority}
            />
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
