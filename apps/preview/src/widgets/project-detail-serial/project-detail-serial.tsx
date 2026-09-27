import Link from "next/link";
import {
    DETAIL_NAV_ABOUT,
    DETAIL_NAV_BUILT,
    DETAIL_NAV_DECOR,
    DETAIL_NAV_FACADES,
    DETAIL_NAV_PACKAGE,
    DETAIL_NAV_PLANS,
    DETAIL_SIMILAR,
} from "@/lib/copy";
import { routes } from "@/lib/routes";
import { ArrowUpRightIcon } from "@/ui/icons";
import { ProjectCard } from "@/widgets/project-card/project-card";
import { ProjectDetailBuilt } from "@/widgets/project-detail/__built/project-detail__built";
import { ProjectDetailDecor } from "@/widgets/project-detail/__decor/project-detail__decor";
import { ProjectDetailFacades } from "@/widgets/project-detail/__facades/project-detail__facades";
import { ProjectDetailFacts } from "@/widgets/project-detail/__facts/project-detail__facts";
import { ProjectDetailHikeContainer } from "@/widgets/project-detail-hike/project-detail-hike.container";
import { ProjectDetailMosaic } from "@/widgets/project-detail/__mosaic/project-detail__mosaic";
import {
    ProjectDetailNav,
    type DetailNavItem,
} from "@/widgets/project-detail/__nav/project-detail__nav";
import { PackageCtaContainer } from "@/widgets/package-cta/package-cta.container";
import { ProjectDetailPackage } from "@/widgets/project-detail/__package/project-detail__package";
import { ProjectDetailCalcContainer } from "@/widgets/project-detail-calc/project-detail-calc.container";
import { ProjectDetailServicesContainer } from "@/widgets/project-detail-services/project-detail-services.container";
import { ProjectDetailPlans } from "@/widgets/project-detail/__plans/project-detail__plans";
import { ProjectDetailVideos } from "@/widgets/project-detail/__videos/project-detail__videos";
import { ProjectDetailSerialHero } from "./__hero/project-detail-serial__hero";
import type { ProjectDetailSerialProps } from "./project-detail-serial.types";
import { Container } from "@/ui/container";
import layout from "../project-detail/project-detail.module.css";

export function ProjectDetailSerial({
    project,
    showcase,
    relatedBuilt,
    similar,
}: ProjectDetailSerialProps) {
    const images = showcase.gallery.length ? showcase.gallery : project.renders;
    const plans = showcase.plans.length ? showcase.plans : project.floorPlans;
    const facades = showcase.facades;
    const decor = showcase.decor;
    const builtPhotos = showcase.builtPhotos;
    const showBuilt = builtPhotos.length > 0 || relatedBuilt.length > 0;
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
    if (showBuilt) {
        nav.push({
            href: "#pd-built",
            label: DETAIL_NAV_BUILT,
            icon: "built",
        });
    }
    if (showcase.complectation) {
        nav.push({
            href: "#pd-package",
            label: DETAIL_NAV_PACKAGE,
            icon: "package",
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
            <ProjectDetailHikeContainer
                priceHike={showcase.priceHike}
                source={`hike-${project.slug}`}
            />

            {plans.length > 0 ? (
                <section
                    id="pd-plans"
                    data-section="detail-plans"
                    className={layout.band}
                >
                    <Container className={layout.pad}>
                        <ProjectDetailPlans
                            plans={plans}
                            alts={showcase.customerAlts}
                        />
                    </Container>
                </section>
            ) : null}

            {showcase.mosaic ? (
                <section data-section="detail-mosaic" className={layout.band}>
                    <Container className={layout.pad}>
                        <ProjectDetailMosaic mosaic={showcase.mosaic} />
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
                        <ProjectDetailFacades
                            facades={facades}
                            alts={showcase.customerAlts}
                            stub={facades.some((f) =>
                                f.src.includes("/media/detail")
                            )}
                        />
                    </Container>
                </section>
            ) : null}

            {showcase.heatCalc ? (
                <section
                    id="pd-calc"
                    data-section="detail-calc"
                    className={layout.calcBand}
                >
                    <Container>
                        <ProjectDetailCalcContainer
                            projectName={project.displayName}
                            envelope={showcase.heatCalc}
                        />
                    </Container>
                </section>
            ) : null}

            {decor.length > 0 ? (
                <section
                    id="pd-decor"
                    data-section="detail-decor"
                    className={layout.bleed}
                >
                    <ProjectDetailDecor items={decor} />
                </section>
            ) : null}

            {showBuilt ? (
                <section
                    id="pd-built"
                    data-section="detail-built"
                    className={layout.band}
                >
                    <Container className={layout.pad}>
                        <ProjectDetailBuilt
                            objects={relatedBuilt}
                            photos={builtPhotos}
                        />
                    </Container>
                </section>
            ) : null}

            {showcase.videos.length > 0 ? (
                <section
                    id="pd-video"
                    data-section="detail-videos"
                    className={layout.band}
                >
                    <Container className={layout.pad}>
                        <ProjectDetailVideos
                            videos={showcase.videos}
                            projectName={project.displayName}
                            alts={showcase.customerAlts}
                        />
                    </Container>
                </section>
            ) : null}

            {showcase.complectation ? (
                <section
                    id="pd-package"
                    data-section="detail-package"
                    className={layout.band}
                >
                    <Container className={layout.pad}>
                        <ProjectDetailPackage
                            complectation={showcase.complectation}
                            price={project.priceFrom}
                            cta={
                                <PackageCtaContainer
                                    source={`project-${project.slug}-presentation`}
                                    prefill={`Презентация: ${project.displayName}`}
                                />
                            }
                        />
                    </Container>
                </section>
            ) : null}

            <section
                id="pd-services"
                data-section="detail-services"
                className={layout.band}
            >
                <Container className={layout.pad}>
                    <ProjectDetailServicesContainer
                        source={`project-${project.slug}-services`}
                        projectName={project.displayName}
                    />
                </Container>
            </section>

            {similar.length > 0 ? (
                <section
                    id="pd-similar"
                    data-section="detail-similar"
                    className={layout.similar}
                >
                    <Container>
                        <div className={layout.similarHead}>
                            <h2 className={layout.heading}>{DETAIL_SIMILAR}</h2>
                            <Link
                                href={routes.projects()}
                                className={layout.similarAll}
                            >
                                Все{" "}
                                <span className={layout.similarAllWide}>
                                    проекты
                                </span>
                                <ArrowUpRightIcon />
                            </Link>
                        </div>
                        <div className={layout.similarGrid}>
                            {similar.map((p) => (
                                <ProjectCard
                                    key={p.slug}
                                    project={p}
                                    layout="similar"
                                />
                            ))}
                        </div>
                    </Container>
                </section>
            ) : null}
        </main>
    );
}
