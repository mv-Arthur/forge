import Link from "next/link";
import Image from "next/image";
import {
    DETAIL_ALL_PROJECTS,
    DETAIL_FACADES_HEADING,
    DETAIL_NAV_BUILT,
    DETAIL_NAV_FACADES,
    DETAIL_NAV_PACKAGES,
    DETAIL_NAV_PLANS,
    DETAIL_NAV_START,
    DETAIL_PLANS_LEAD,
    DETAIL_SIMILAR,
    DETAIL_START_HEADING,
    LEAD_EYEBROW,
    PROJECT_GALLERY_HEADING,
    RELATED_HOUSES_LEAD,
    SEE_HOUSES,
    WORKS_EYEBROW,
} from "@/lib/copy";
import { BuiltObjectCard } from "@/widgets/built-object-card/built-object-card";
import { ProjectDetailGallery } from "./__gallery/project-detail__gallery";
import { ProjectDetailPlans } from "./__plans/project-detail__plans";
import { ProjectDetailPackages } from "./__packages/project-detail__packages";
import { ProjectDetailNav, type DetailNavItem } from "./__nav/project-detail__nav";
import { ProjectDetailFacts } from "./__facts/project-detail__facts";
import { ProjectDetailFacades } from "./__facades/project-detail__facades";
import { ProjectDetailStart } from "./__start/project-detail__start";
import { getDetailIllustrations } from "./lib/illustrations";
import type { ProjectDetailProps } from "./project-detail.types";

export function ProjectDetail({
    project,
    similar,
    relatedBuilt,
    leadForm,
    similarCarousel,
    startVisit,
    startQuote,
}: ProjectDetailProps) {
    const renders = project.renders.slice(0, 12);
    const illustrations = getDetailIllustrations(project.slug);
    const plans = project.floorPlans.length
        ? project.floorPlans
        : illustrations
          ? [{ floor: illustrations.plan.floor, url: illustrations.plan.src }]
          : [];
    const facades = illustrations?.facades ?? [];
    const nav: DetailNavItem[] = [];
    if (plans.length > 0) {
        nav.push({
            href: "#pd-plans",
            label: DETAIL_NAV_PLANS,
            icon: "plans",
        });
    }
    if (facades.length > 0) {
        nav.push({
            href: "#pd-facades",
            label: DETAIL_NAV_FACADES,
            icon: "facades",
        });
    }
    if (relatedBuilt.length > 0) {
        nav.push({
            href: "#pd-built",
            label: DETAIL_NAV_BUILT,
            icon: "built",
        });
    }
    if (project.variants.length > 0) {
        nav.push({
            href: "#complectation-section",
            label: DETAIL_NAV_PACKAGES,
            icon: "packages",
        });
    }
    if (startVisit && startQuote) {
        nav.push({
            href: "#pd-start",
            label: DETAIL_NAV_START,
            icon: "start",
        });
    }

    return (
        <main className="pb-16">
            <section data-section="detail-hero">
                <ProjectDetailGallery project={project} />
            </section>
            <ProjectDetailNav items={nav} />
            <ProjectDetailFacts project={project} />

            {plans.length > 0 ? (
                <section
                    id="pd-plans"
                    data-section="detail-plans"
                    className="border-b border-ink-150 bg-ink-50/30"
                    data-stub={project.floorPlans.length === 0 ? "true" : undefined}
                >
                    <div className="container-page py-10 md:py-14">
                        {project.floorPlans.length === 0 ? (
                            <p className="mb-4 text-sm text-ink-500">
                                {DETAIL_PLANS_LEAD}
                            </p>
                        ) : null}
                        <ProjectDetailPlans project={project} plans={plans} />
                    </div>
                </section>
            ) : null}

            {facades.length > 0 ? (
                <section
                    id="pd-facades"
                    data-section="detail-facades"
                    className="border-b border-ink-150 bg-white"
                >
                    <div className="container-page py-10 md:py-14">
                        <h2 className="font-display text-h1 text-ink-950">
                            {DETAIL_FACADES_HEADING}
                        </h2>
                        <div className="mt-6">
                            <ProjectDetailFacades facades={facades} stub />
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
                                        unoptimized={src.startsWith("/media/")}
                                        className="object-cover"
                                        sizes="(min-width:1024px) 33vw, 100vw"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {relatedBuilt.length > 0 ? (
                <section
                    id="pd-built"
                    data-section="detail-built"
                    className="border-b border-ink-150 bg-white"
                >
                    <div className="container-page py-10 md:py-14">
                        <div className="eyebrow text-accent">
                            {WORKS_EYEBROW}
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

            {project.variants.length > 0 ? (
                <section
                    id="complectation-section"
                    data-section="detail-packages"
                    className="border-b border-ink-150 bg-ink-50/40"
                >
                    <div className="container-page py-12 md:py-16">
                        <ProjectDetailPackages project={project} />
                    </div>
                </section>
            ) : null}

            {startVisit && startQuote ? (
                <section
                    id="pd-start"
                    data-section="detail-start"
                    className="border-b border-ink-150 bg-white"
                >
                    <div className="container-page py-10 md:py-14">
                        <h2 className="font-display text-h1 text-ink-950">
                            {DETAIL_START_HEADING}
                        </h2>
                        <div className="mt-6">
                            <ProjectDetailStart
                                visit={startVisit}
                                quote={startQuote}
                            />
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
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <h2 className="font-display text-h1">
                                {DETAIL_SIMILAR}
                            </h2>
                            <Link href="/projects" className="text-sm font-semibold text-ink-700 hover:text-ink-950">
                                {DETAIL_ALL_PROJECTS}
                            </Link>
                        </div>
                        <div className="mt-6">{similarCarousel}</div>
                    </div>
                </section>
            ) : null}
        </main>
    );
}
