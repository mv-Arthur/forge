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
import { Container } from "@/ui/container";
import styles from "./project-detail.module.css";

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
        <main className={styles.main}>
            <section data-section="detail-hero">
                <ProjectDetailGallery project={project} />
            </section>
            <ProjectDetailNav items={nav} />
            <ProjectDetailFacts project={project} />

            {plans.length > 0 ? (
                <section
                    id="pd-plans"
                    data-section="detail-plans"
                    className={styles.bandMuted}
                    data-stub={project.floorPlans.length === 0 ? "true" : undefined}
                >
                    <Container className={styles.pad}>
                        {project.floorPlans.length === 0 ? (
                            <p className={styles.note}>{DETAIL_PLANS_LEAD}</p>
                        ) : null}
                        <ProjectDetailPlans project={project} plans={plans} />
                    </Container>
                </section>
            ) : null}

            {facades.length > 0 ? (
                <section
                    id="pd-facades"
                    data-section="detail-facades"
                    className={styles.band}
                >
                    <Container className={styles.pad}>
                        <h2 className={styles.heading}>
                            {DETAIL_FACADES_HEADING}
                        </h2>
                        <div className={styles.block}>
                            <ProjectDetailFacades facades={facades} stub />
                        </div>
                    </Container>
                </section>
            ) : null}

            {renders.length > 0 ? (
                <section data-section="detail-gallery" className={styles.band}>
                    <Container className={styles.pad}>
                        <div className={`eyebrow ${styles.eyebrow}`}>Галерея</div>
                        <h2 className={`${styles.heading} ${styles.headingGap}`}>
                            {PROJECT_GALLERY_HEADING}
                        </h2>
                        <div className={styles.photos}>
                            {renders.map((src, i) => (
                                <div key={src + i} className={styles.photo}>
                                    <Image
                                        src={src}
                                        alt={`${project.displayName} - ${i + 1}`}
                                        fill
                                        unoptimized={src.startsWith("/media/")}
                                        className={styles.photoImg}
                                        sizes="(min-width:1024px) 33vw, 100vw"
                                    />
                                </div>
                            ))}
                        </div>
                    </Container>
                </section>
            ) : null}

            {relatedBuilt.length > 0 ? (
                <section
                    id="pd-built"
                    data-section="detail-built"
                    className={styles.band}
                >
                    <Container className={styles.pad}>
                        <div className={`eyebrow ${styles.eyebrow}`}>
                            {WORKS_EYEBROW}
                        </div>
                        <h2 className={`${styles.heading} ${styles.headingGap}`}>
                            Похожие дома
                        </h2>
                        <p className={styles.lead}>{RELATED_HOUSES_LEAD}</p>
                        <div className={styles.cards}>
                            {relatedBuilt.map((o) => (
                                <BuiltObjectCard key={o.slug} object={o} />
                            ))}
                        </div>
                        <div className={styles.block}>
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
                    className={styles.bandSoft}
                >
                    <Container className={styles.padLg}>
                        <ProjectDetailPackages project={project} />
                    </Container>
                </section>
            ) : null}

            {startVisit && startQuote ? (
                <section
                    id="pd-start"
                    data-section="detail-start"
                    className={styles.band}
                >
                    <Container className={styles.pad}>
                        <h2 className={styles.heading}>{DETAIL_START_HEADING}</h2>
                        <div className={styles.block}>
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
                className={styles.leadBand}
            >
                <Container className={styles.leadGrid}>
                    <div>
                        <div className={`eyebrow ${styles.eyebrow}`}>
                            {LEAD_EYEBROW}
                        </div>
                        <h2 className={`${styles.heading} ${styles.headingGap}`}>
                            Уточнить смету по этому проекту
                        </h2>
                        <p className={styles.lead}>
                            Перезвоним по комплектации и срокам.
                        </p>
                    </div>
                    <div className={styles.leadBox}>{leadForm}</div>
                </Container>
            </section>

            {similar.length > 0 ? (
                <section data-section="detail-similar" className={styles.similar}>
                    <Container>
                        <div className={styles.similarHead}>
                            <h2 className={styles.heading}>{DETAIL_SIMILAR}</h2>
                            <Link href="/projects" className={styles.similarAll}>
                                {DETAIL_ALL_PROJECTS}
                            </Link>
                        </div>
                        <div className={styles.block}>{similarCarousel}</div>
                    </Container>
                </section>
            ) : null}
        </main>
    );
}
