import Link from "next/link";
import {
    DETAIL_ALL_PROJECTS,
    DETAIL_LAYOUT_CTA,
    DETAIL_LAYOUT_LEAD,
    DETAIL_LAYOUT_TITLE,
    DETAIL_LIKED_BATH,
    DETAIL_LIKED_HOUSE,
    DETAIL_SIMILAR,
    LEAD_EYEBROW,
    RELATED_HOUSES_LEAD,
    SEE_HOUSES,
    WORKS_EYEBROW,
} from "@/lib/copy";
import { BuiltObjectCard } from "@/widgets/built-object-card/built-object-card";
import { ProjectDetailIndividualHero } from "./__hero/project-detail-individual__hero";
import { ProjectDetailIndividualStory } from "./__story/project-detail-individual__story";
import type { ProjectDetailIndividualProps } from "./project-detail-individual.types";

export function ProjectDetailIndividual({
    project,
    showcase,
    similar,
    relatedBuilt,
    leadForm,
    similarCarousel,
}: ProjectDetailIndividualProps) {
    const images = showcase.gallery.length
        ? showcase.gallery
        : project.renders;
    const bath = project.projectClass === "bath";

    return (
        <main className="pb-16">
            <ProjectDetailIndividualHero
                project={project}
                images={images}
                lead={showcase.lead}
            />

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

            {showcase.story ? (
                <ProjectDetailIndividualStory
                    story={showcase.story}
                    name={project.displayName}
                />
            ) : null}

            <section
                data-section="detail-layout-cta"
                className="border-b border-ink-150 bg-ink-50/40"
            >
                <div className="container-page flex flex-wrap items-end justify-between gap-6 py-10 md:py-14">
                    <div className="max-w-xl">
                        <h2 className="font-display text-h1 text-ink-950">
                            {DETAIL_LAYOUT_TITLE}
                        </h2>
                        <p className="mt-3 text-sm text-ink-600">
                            {DETAIL_LAYOUT_LEAD}
                        </p>
                    </div>
                    <a href="#detail-lead" className="btn btn-primary">
                        {DETAIL_LAYOUT_CTA}
                    </a>
                </div>
            </section>

            {!bath && relatedBuilt.length > 0 ? (
                <section
                    data-section="detail-related"
                    className="border-b border-ink-150 bg-white"
                >
                    <div className="container-page py-10 md:py-14">
                        <div className="eyebrow text-accent">
                            {WORKS_EYEBROW}
                        </div>
                        <h2 className="mt-2 font-display text-h1 text-ink-950">
                            Смотрите также
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
                className="bg-white"
            >
                <div className="container-page grid gap-10 py-12 md:grid-cols-2 md:py-16">
                    <div>
                        <div className="eyebrow text-accent">{LEAD_EYEBROW}</div>
                        <h2 className="mt-2 font-display text-h1 text-ink-950">
                            {bath ? DETAIL_LIKED_BATH : DETAIL_LIKED_HOUSE}
                        </h2>
                        <p className="mt-3 text-sm text-ink-500">
                            Перезвоним по комплектации и срокам.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-ink-150 bg-ink-50/50 p-5 md:p-6">
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
