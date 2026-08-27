import Link from "next/link";
import Image from "next/image";
import {
    formatArea,
    formatFloors,
    formatPrice,
    formatTechnologyBrand,
} from "@/lib/format";
import {
    LEAD_EYEBROW,
    PROJECT_GALLERY_HEADING,
    RELATED_HOUSES_LEAD,
    SEE_HOUSES,
} from "@/lib/copy";
import { BathIcon, BedIcon, RulerIcon, StairsIcon } from "@/ui/icons";
import { BuiltObjectCard } from "@/widgets/built-object-card/built-object-card";
import { ProjectDetailGallery } from "./__gallery/project-detail__gallery";
import { ProjectDetailPlans } from "./__plans/project-detail__plans";
import { ProjectDetailPackages } from "./__packages/project-detail__packages";
import type { ProjectDetailProps } from "./project-detail.types";

export function ProjectDetail({
    project,
    similar,
    relatedBuilt,
    leadForm,
    similarCarousel,
}: ProjectDetailProps) {
    const renders = project.renders.slice(0, 12);
    const facts: Array<{
        icon: React.ReactNode;
        label: string;
        value: string;
    }> = [];
    if (project.area != null) {
        facts.push({
            icon: <RulerIcon className="h-4 w-4" />,
            label: "Площадь",
            value: formatArea(project.area),
        });
    }
    if (project.floors) {
        facts.push({
            icon: <StairsIcon className="h-4 w-4" />,
            label: "Этажность",
            value: formatFloors(project.floors),
        });
    }
    if (project.bedrooms != null) {
        facts.push({
            icon: <BedIcon className="h-4 w-4" />,
            label: "Спальни",
            value: String(project.bedrooms),
        });
    }
    if (project.bathrooms != null) {
        facts.push({
            icon: <BathIcon className="h-4 w-4" />,
            label: "Санузлы",
            value: String(project.bathrooms),
        });
    }
    if (project.technologies[0]) {
        facts.push({
            icon: null,
            label: "Материал",
            value: formatTechnologyBrand(project.technologies[0]),
        });
    }
    if (project.dimensions) {
        facts.push({
            icon: null,
            label: "Габариты",
            value: project.dimensions,
        });
    }

    return (
        <main className="pb-16">
            <section data-section="detail-hero">
                <ProjectDetailGallery project={project} />
            </section>

            {facts.length > 0 || project.priceFrom ? (
                <section
                    data-section="detail-params"
                    className="border-b border-ink-150 bg-white"
                >
                    <div className="container-page py-7 md:py-9">
                        {facts.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 md:gap-6">
                                {facts.map((f) => (
                                    <div
                                        key={f.label}
                                        className="rounded-2xl border border-ink-100 bg-ink-50/50 px-4 py-3.5"
                                    >
                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                                            {f.icon}
                                            {f.label}
                                        </div>
                                        <div className="mt-1.5 font-display text-xl font-semibold leading-none text-ink-950">
                                            {f.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                        {project.priceFrom ? (
                            <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-ink-100 pt-5">
                                <div>
                                    <div className="text-xs uppercase tracking-wider text-ink-500">
                                        под ключ от
                                    </div>
                                    <div className="font-display text-price font-bold text-ink-950">
                                        {formatPrice(project.priceFrom)}
                                    </div>
                                </div>
                                <a
                                    href="#detail-lead"
                                    className="btn btn-primary"
                                >
                                    Уточнить смету
                                </a>
                            </div>
                        ) : null}
                    </div>
                </section>
            ) : null}

            {project.floorPlans.length > 0 ? (
                <section
                    data-section="detail-plans"
                    className="border-b border-ink-150 bg-ink-50/30"
                >
                    <div className="container-page py-10 md:py-14">
                        <div className="eyebrow text-accent">Планировка</div>
                        <h2 className="mt-2 font-display text-h1 text-ink-950">
                            Планы этажей
                        </h2>
                        <div className="mt-6">
                            <ProjectDetailPlans
                                project={project}
                                plans={project.floorPlans}
                            />
                        </div>
                    </div>
                </section>
            ) : null}

            {renders.length > 0 ? (
                <section
                    data-section="detail-gallery"
                    className="border-b border-ink-150 bg-white"
                >
                    <div className="container-page py-10 md:py-14">
                        <div className="eyebrow text-accent">Галерея</div>
                        <h2 className="mt-2 font-display text-h1 text-ink-950">
                            {PROJECT_GALLERY_HEADING}
                        </h2>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {renders.map((src, i) => (
                                <div
                                    key={src + i}
                                    className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink-100"
                                >
                                    <Image
                                        src={src}
                                        alt={`${project.displayName} — ${i + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(min-width:1024px) 33vw, 100vw"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {project.variants.length > 0 ? (
                <section
                    data-section="detail-packages"
                    className="border-b border-ink-150 bg-ink-50/40"
                >
                    <div className="container-page py-12 md:py-16">
                        <ProjectDetailPackages project={project} />
                    </div>
                </section>
            ) : null}

            {relatedBuilt.length > 0 ? (
                <section
                    data-section="detail-built"
                    className="border-b border-ink-150 bg-white"
                >
                    <div className="container-page py-10 md:py-14">
                        <div className="eyebrow text-accent">
                            Построенные дома
                        </div>
                        <h2 className="mt-2 font-display text-h1 text-ink-950">
                            Похожие дома
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm text-ink-500">
                            {RELATED_HOUSES_LEAD}
                        </p>
                        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedBuilt.map((o) => (
                                <BuiltObjectCard key={o.slug} object={o} />
                            ))}
                        </div>
                        <div className="mt-6">
                            <Link href="/works" className="btn btn-light">
                                {SEE_HOUSES}
                            </Link>
                        </div>
                    </div>
                </section>
            ) : null}

            <section
                id="detail-lead"
                data-section="detail-lead"
                className="bg-ink-50/40"
            >
                <div className="container-page grid gap-10 py-12 md:grid-cols-2 md:py-16">
                    <div>
                        <div className="eyebrow text-accent">{LEAD_EYEBROW}</div>
                        <h2 className="mt-2 font-display text-h1 text-ink-950">
                            Уточнить смету по этому проекту
                        </h2>
                        <p className="mt-3 text-sm text-ink-500">
                            Перезвоним по комплектации и срокам.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-ink-150 bg-white p-5 md:p-6">
                        {leadForm}
                    </div>
                </div>
            </section>

            {similar.length > 0 ? (
                <section
                    data-section="detail-similar"
                    className="border-t border-ink-150 bg-white py-12"
                >
                    <div className="container-page">
                        <div className="eyebrow text-accent">Ещё проекты</div>
                        <h2 className="mt-2 font-display text-h1">
                            Похожие проекты
                        </h2>
                        <div className="mt-6">{similarCarousel}</div>
                    </div>
                </section>
            ) : null}
        </main>
    );
}
