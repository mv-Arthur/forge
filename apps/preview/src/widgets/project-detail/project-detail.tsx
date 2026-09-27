import Image from "next/image";
import {
    DETAIL_NAV_BUILT,
    DETAIL_NAV_FACADES,
    DETAIL_NAV_PLANS,
    DETAIL_PLANS_LEAD,
    PROJECT_GALLERY_HEADING,
} from "@/lib/copy";
import { routes } from "@/lib/routes";
import { ProjectDetailBuilt } from "./__built/project-detail__built";
import { ProjectDetailGallery } from "./__gallery/project-detail__gallery";
import { ProjectDetailPlans } from "./__plans/project-detail__plans";
import { ProjectDetailNav, type DetailNavItem } from "./__nav/project-detail__nav";
import { ProjectDetailFacts } from "./__facts/project-detail__facts";
import { ProjectDetailFacades } from "./__facades/project-detail__facades";
import { getDetailIllustrations } from "./lib/illustrations";
import type { ProjectDetailProps } from "./project-detail.types";
import { Container } from "@/ui/container";
import styles from "./project-detail.module.css";

export function ProjectDetail({
    project,
    relatedBuilt,
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
                        <ProjectDetailPlans plans={plans} />
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
                        <ProjectDetailFacades
                            facades={facades}
                            customersHref={routes.worksGallery()}
                            stub
                        />
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
                        <ProjectDetailBuilt objects={relatedBuilt} />
                    </Container>
                </section>
            ) : null}
        </main>
    );
}
