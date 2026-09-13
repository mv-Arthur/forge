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
import { Container } from "@/ui/container";
import layout from "../project-detail/project-detail.module.css";

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
        <main className={layout.main}>
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

            {plans.length > 0 ? (
                <section
                    id="pd-plans"
                    data-section="detail-plans"
                    className={layout.bandMuted}
                    data-stub={
                        plans.some((p) => p.url.includes("/media/detail"))
                            ? "true"
                            : undefined
                    }
                >
                    <Container className={layout.pad}>
                        <ProjectDetailPlans project={project} plans={plans} />
                    </Container>
                </section>
            ) : null}

            {facades.length > 0 ? (
                <section
                    id="pd-facades"
                    data-section="detail-facades"
                    className={layout.band}
                    data-stub={
                        facades.some((f) => f.src.includes("/media/detail"))
                            ? "true"
                            : undefined
                    }
                >
                    <Container className={layout.pad}>
                        <h2 className={layout.heading}>
                            {DETAIL_FACADES_HEADING}
                        </h2>
                        <div className={layout.block}>
                            <ProjectDetailFacades
                                facades={facades}
                                stub={facades.some((f) =>
                                    f.src.includes("/media/detail"),
                                )}
                            />
                        </div>
                    </Container>
                </section>
            ) : null}

            {decor.length > 0 ? (
                <section
                    id="pd-decor"
                    data-section="detail-decor"
                    className={layout.bandMuted}
                >
                    <Container className={layout.pad}>
                        <h2 className={layout.heading}>
                            {DETAIL_DECOR_HEADING}
                        </h2>
                        <p className={layout.lead}>{DETAIL_DECOR_LEAD}</p>
                        <div className={layout.block}>
                            <ProjectDetailDecor items={decor} />
                        </div>
                    </Container>
                </section>
            ) : null}

            {relatedBuilt.length > 0 ? (
                <section
                    id="pd-built"
                    data-section="detail-built"
                    className={layout.band}
                >
                    <Container className={layout.pad}>
                        <div className={`eyebrow ${layout.eyebrow}`}>
                            {WORKS_EYEBROW}
                        </div>
                        <h2 className={`${layout.heading} ${layout.headingGap}`}>
                            Похожие дома
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

            {project.variants.length > 0 ? (
                <section
                    id="complectation-section"
                    data-section="detail-packages"
                    className={layout.bandSoft}
                >
                    <Container className={layout.padLg}>
                        <ProjectDetailPackages project={project} />
                    </Container>
                </section>
            ) : null}

            {startVisit && startQuote ? (
                <section
                    id="pd-start"
                    data-section="detail-start"
                    className={layout.band}
                >
                    <Container className={layout.pad}>
                        <h2 className={layout.heading}>
                            {DETAIL_START_HEADING}
                        </h2>
                        <div className={layout.block}>
                            <ProjectDetailStart
                                visit={startVisit}
                                quote={startQuote}
                            />
                        </div>
                    </Container>
                </section>
            ) : null}

            <section
                id="detail-lead"
                data-section="detail-lead"
                className={layout.leadBand}
            >
                <Container className={layout.leadGrid}>
                    <div>
                        <div className={`eyebrow ${layout.eyebrow}`}>
                            {LEAD_EYEBROW}
                        </div>
                        <h2 className={`${layout.heading} ${layout.headingGap}`}>
                            Уточнить смету по этому проекту
                        </h2>
                        <p className={layout.lead}>
                            Перезвоним по комплектации и срокам.
                        </p>
                    </div>
                    <div className={layout.leadBox}>{leadForm}</div>
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
