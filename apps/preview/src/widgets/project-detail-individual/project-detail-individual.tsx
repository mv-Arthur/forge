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
import { Container } from "@/ui/container";
import layout from "../project-detail/project-detail.module.css";

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
        <main className={layout.main}>
            <ProjectDetailIndividualHero
                project={project}
                images={images}
                lead={showcase.lead}
            />

            {showcase.about.length > 0 ? (
                <section data-section="detail-about" className={layout.band}>
                    <Container className={layout.aboutGrid}>
                        {showcase.about.map((block) => (
                            <article key={block.title}>
                                <h2 className={layout.heading}>{block.title}</h2>
                                <p className={layout.aboutText}>{block.text}</p>
                            </article>
                        ))}
                    </Container>
                </section>
            ) : null}

            {showcase.story ? (
                <ProjectDetailIndividualStory
                    story={showcase.story}
                    name={project.displayName}
                />
            ) : null}

            <section data-section="detail-layout-cta" className={layout.bandSoft}>
                <Container className={layout.layoutCta}>
                    <div>
                        <h2 className={layout.heading}>{DETAIL_LAYOUT_TITLE}</h2>
                        <p className={layout.aboutText}>{DETAIL_LAYOUT_LEAD}</p>
                    </div>
                    <a href="#detail-lead" className="btn btn-primary">
                        {DETAIL_LAYOUT_CTA}
                    </a>
                </Container>
            </section>

            {!bath && relatedBuilt.length > 0 ? (
                <section data-section="detail-related" className={layout.band}>
                    <Container className={layout.pad}>
                        <div className={`eyebrow ${layout.eyebrow}`}>
                            {WORKS_EYEBROW}
                        </div>
                        <h2 className={`${layout.heading} ${layout.headingGap}`}>
                            Смотрите также
                        </h2>
                        <p className={layout.lead}>{RELATED_HOUSES_LEAD}</p>
                        <div className={layout.cards}>
                            {relatedBuilt.map((o) => (
                                <BuiltObjectCard key={o.slug} object={o} />
                            ))}
                        </div>
                        <div className={layout.block}>
                            <Link href="/works" className="btn btn-light">
                                {SEE_HOUSES}
                            </Link>
                        </div>
                    </Container>
                </section>
            ) : null}

            <section
                id="detail-lead"
                data-section="detail-lead"
                className={layout.leadBandWhite}
            >
                <Container className={layout.leadGrid}>
                    <div>
                        <div className={`eyebrow ${layout.eyebrow}`}>
                            {LEAD_EYEBROW}
                        </div>
                        <h2 className={`${layout.heading} ${layout.headingGap}`}>
                            {bath ? DETAIL_LIKED_BATH : DETAIL_LIKED_HOUSE}
                        </h2>
                        <p className={layout.lead}>
                            Перезвоним по комплектации и срокам.
                        </p>
                    </div>
                    <div className={layout.leadBoxSoft}>{leadForm}</div>
                </Container>
            </section>

            {similar.length > 0 ? (
                <section data-section="detail-similar" className={layout.similar}>
                    <Container>
                        <div className={layout.similarHead}>
                            <h2 className={layout.heading}>{DETAIL_SIMILAR}</h2>
                            <Link href="/projects" className={layout.similarAll}>
                                {DETAIL_ALL_PROJECTS}
                            </Link>
                        </div>
                        <div className={layout.block}>{similarCarousel}</div>
                    </Container>
                </section>
            ) : null}
        </main>
    );
}
