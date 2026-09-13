import Link from "next/link";
import {
    DETAIL_ALL_PROJECTS,
    DETAIL_DECOR_HEADING,
    DETAIL_DECOR_LEAD,
    DETAIL_FACADES_HEADING,
    DETAIL_NAV_ABOUT,
    DETAIL_NAV_BUILT,
    DETAIL_NAV_DECOR,
    DETAIL_NAV_FACADES,
    DETAIL_NAV_PACKAGES,
    DETAIL_NAV_PLANS,
    DETAIL_NAV_START,
    DETAIL_SIMILAR,
    DETAIL_START_HEADING,
    LEAD_EYEBROW,
    RELATED_HOUSES_LEAD,
    SEE_HOUSES,
    WORKS_EYEBROW,
} from "@/lib/copy";
import { BuiltObjectCard } from "@/widgets/built-object-card/built-object-card";
import { ProjectDetailDecor } from "@/widgets/project-detail/__decor/project-detail__decor";
import { ProjectDetailFacades } from "@/widgets/project-detail/__facades/project-detail__facades";
import { ProjectDetailFacts } from "@/widgets/project-detail/__facts/project-detail__facts";
import { ProjectDetailHike } from "@/widgets/project-detail/__hike/project-detail__hike";
import { ProjectDetailNav, type DetailNavItem } from "@/widgets/project-detail/__nav/project-detail__nav";
import { ProjectDetailPackages } from "@/widgets/project-detail/__packages/project-detail__packages";
import { ProjectDetailPlans } from "@/widgets/project-detail/__plans/project-detail__plans";
import { ProjectDetailStart } from "@/widgets/project-detail/__start/project-detail__start";
import { ProjectDetailSerialHero } from "./__hero/project-detail-serial__hero";
import type { ProjectDetailSerialProps } from "./project-detail-serial.types";

export function ProjectDetailSerial({
    project,
    showcase,
    similar,
    relatedBuilt,
    leadForm,
    similarCarousel,
    startVisit,
    startQuote,
}: ProjectDetailSerialProps) {
    const images = showcase.gallery.length
        ? showcase.gallery
        : project.renders;
    const plans = showcase.plans.length
        ? showcase.plans
        : project.floorPlans;
    const facades = showcase.facades;
    const decor = showcase.decor;
    const nav: DetailNavItem[] = [
        { href: "#pd-about", label: DETAIL_NAV_ABOUT, icon: "about" },
    ];
    if (plans.length > 0) {
        nav.push({ href: "#pd-plans", label: DETAIL_NAV_PLANS, icon: "plans" });
    }
    if (facades.length > 0) {
        nav.push({
            href: "#pd-facades",
            label: DETAIL_NAV_FACADES,
            icon: "facades",
        });
    }
    if (decor.length > 0) {
        nav.push({
            href: "#pd-decor",
            label: DETAIL_NAV_DECOR,
            icon: "decor",
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
            <ProjectDetailSerialHero
                project={project}
                images={images}
                lead={showcase.lead}
            />
            <ProjectDetailNav items={nav} />
            <ProjectDetailFacts
                project={project}
                priceHike={showcase.priceHike}
            />
            <ProjectDetailHike priceHike={showcase.priceHike} />

            {showcase.about.length > 0 ? (
                <section
                    data-section="detail-about"
                    className="border-b border-ink-150 bg-white"
                >
                    <div className="container-page grid gap-8 py-10 md:grid-cols-2 md:py-14">
                        {showcase.about.map((block) => (
                            <article key={block.title}>
                                <h2 className="font-display text-h1 text-ink-950">
                                    {block.title}
                                </h2>
                                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-600">
                                    {block.text}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}

            {plans.length > 0 ? (
                <section
                    id="pd-plans"
                    data-section="detail-plans"
                    className="border-b border-ink-150 bg-ink-50/30"
                    data-stub={
                        plans.some((p) => p.url.includes("/media/detail"))
                            ? "true"
                            : undefined
                    }
                >
                    <div className="container-page py-10 md:py-14">
                        <ProjectDetailPlans project={project} plans={plans} />
                    </div>
                </section>
            ) : null}

            {facades.length > 0 ? (
                <section
                    id="pd-facades"
                    data-section="detail-facades"
                    className="border-b border-ink-150 bg-white"
                    data-stub={
                        facades.some((f) => f.src.includes("/media/detail"))
                            ? "true"
                            : undefined
                    }
                >
                    <div className="container-page py-10 md:py-14">
                        <h2 className="font-display text-h1 text-ink-950">
                            {DETAIL_FACADES_HEADING}
                        </h2>
                        <div className="mt-6">
                            <ProjectDetailFacades
                                facades={facades}
                                stub={facades.some((f) =>
                                    f.src.includes("/media/detail"),
                                )}
                            />
                        </div>
                    </div>
                </section>
            ) : null}

            {decor.length > 0 ? (
                <section
                    id="pd-decor"
                    data-section="detail-decor"
                    className="border-b border-ink-150 bg-ink-50/30"
                >
                    <div className="container-page py-10 md:py-14">
                        <h2 className="font-display text-h1 text-ink-950">
                            {DETAIL_DECOR_HEADING}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm text-ink-500">
                            {DETAIL_DECOR_LEAD}
                        </p>
                        <div className="mt-6">
                            <ProjectDetailDecor items={decor} />
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
                            <Link
                                href="/projects"
                                className="text-sm font-semibold text-ink-700 hover:text-ink-950"
                            >
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
