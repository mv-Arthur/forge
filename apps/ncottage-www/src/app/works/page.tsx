import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBuiltObjects } from "@/data/built-objects";
import { getPage, section } from "@/data/pages";
import { getSeo } from "@/data/settings";
import type { BuiltObject } from "@/domain/project";
import { buildPageMetadata } from "@/lib/seo";
import { WorksVisitForm } from "./WorksVisitForm";
import styles from "./works.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const [page, seo] = await Promise.all([getPage("works"), getSeo()]);
    return buildPageMetadata({
        seo,
        title: page?.seoTitle ?? "",
        description: page?.seoDescription ?? "",
        path: "/works",
    });
}

const mapBounds = {
    minLat: 55.3,
    maxLat: 60.9,
    minLng: 28.4,
    maxLng: 38.1,
};

function getTotalArea(objects: BuiltObject[]) {
    return objects.reduce((sum, object) => sum + (object.area ?? 0), 0);
}

function getObjectType(title: string) {
    if (title.toLowerCase().includes("бан")) return "Баня";
    return "Дом";
}

function getTechnology(title: string) {
    const normalized = title.toLowerCase();
    if (normalized.includes("сип")) return "СИП-панели";
    if (normalized.includes("каркас")) return "Каркас";
    if (normalized.includes("газобетон")) return "Газобетон";
    if (normalized.includes("кирпич")) return "Кирпич";
    return "Индивидуальный проект";
}

function getPinStyle(object: BuiltObject): CSSProperties | undefined {
    if (!object.coords) return undefined;

    const x =
        ((object.coords.lng - mapBounds.minLng) /
            (mapBounds.maxLng - mapBounds.minLng)) *
        100;
    const y =
        100 -
        ((object.coords.lat - mapBounds.minLat) /
            (mapBounds.maxLat - mapBounds.minLat)) *
            100;

    return {
        left: `${Math.min(94, Math.max(6, x))}%`,
        top: `${Math.min(88, Math.max(12, y))}%`,
    };
}

export default async function WorksPage() {
    const [objects, page] = await Promise.all([
        getBuiltObjects(),
        getPage("works"),
    ]);
    if (!page) notFound();

    const hero = section(page, "worksHero");
    const map = section(page, "worksMap");
    const listHeading = section(page, "sectionHeading");
    const visit = section(page, "leadForm");
    if (!hero || !map || !listHeading || !visit) notFound();

    const objectsWithCoords = objects.filter((object) => object.coords);
    const totalArea = getTotalArea(objects);
    const mapHighlights = objectsWithCoords.slice(0, 4);
    const statLabels = hero.statLabels;

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Наши работы" },
                    ]}
                />

                <section className={styles.hero}>
                    <SectionHeading
                        eyebrow={hero.eyebrow}
                        title={hero.title}
                        titleAccent={hero.titleAccent}
                        lead={hero.lead}
                        align="left"
                        tone="h1"
                        className={styles.heroHeading}
                    />
                    <div className={styles.stats}>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>
                                {objects.length}
                            </span>
                            <span className={styles.statLabel}>
                                {statLabels[0]}
                            </span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>
                                {objectsWithCoords.length}
                            </span>
                            <span className={styles.statLabel}>
                                {statLabels[1]}
                            </span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>
                                {totalArea.toLocaleString("ru-RU")}
                            </span>
                            <span className={styles.statLabel}>
                                {statLabels[2]}
                            </span>
                        </div>
                    </div>
                </section>

                <section
                    className={styles.mapSection}
                    aria-labelledby="works-map"
                >
                    <div className={styles.mapHead}>
                        <div>
                            <span className={styles.eyebrow}>
                                {map.eyebrow}
                            </span>
                            <h2 id="works-map" className={styles.sectionTitle}>
                                {map.heading}
                            </h2>
                        </div>
                        <p className={styles.mapLead}>{map.lead}</p>
                    </div>

                    <div className={styles.mapCard}>
                        <div className={styles.mapCanvas} aria-hidden="true">
                            <span className={styles.mapLabelSpb}>
                                {map.mapLabelSpb}
                            </span>
                            <span className={styles.mapLabelMsk}>
                                {map.mapLabelMsk}
                            </span>
                            <span className={styles.mapAreaPrimary} />
                            <span className={styles.mapAreaSecondary} />
                            <span className={styles.mapRoute} />
                            {objectsWithCoords.map((object) => (
                                <span
                                    key={object.id}
                                    className={styles.mapPin}
                                    style={getPinStyle(object)}
                                    title={object.title}
                                />
                            ))}
                        </div>
                        <div className={styles.mapAside}>
                            <span className={styles.mapAsideLabel}>
                                {map.mapAsideLabel}
                            </span>
                            <h3 className={styles.mapAsideTitle}>
                                {map.mapAsideTitle}
                            </h3>
                            <p className={styles.mapAsideText}>
                                {map.mapAsideText}
                            </p>
                            <div className={styles.mapList}>
                                {mapHighlights.map((object) => (
                                    <span key={object.id}>
                                        {object.location}
                                    </span>
                                ))}
                            </div>
                            <a className={styles.mapAsideCta} href="#visit">
                                {map.ctaLabel}
                            </a>
                        </div>
                    </div>
                </section>

                <section
                    className={styles.objectsSection}
                    aria-labelledby="works-list"
                >
                    <SectionHeading
                        eyebrow={listHeading.eyebrow}
                        title={listHeading.title ?? ""}
                        titleAccent={listHeading.titleAccent}
                        lead={listHeading.lead}
                        align="left"
                        className={styles.listHeading}
                    />

                    <div id="works-list" className={styles.grid}>
                        {objects.map((object) => (
                            <Link
                                key={object.id}
                                href={object.href}
                                className={styles.card}
                            >
                                <div className={styles.cardImage}>
                                    <Image
                                        src={object.image}
                                        alt={object.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 360px"
                                    />
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.tags}>
                                        <span className={styles.tag}>
                                            {getObjectType(object.title)}
                                        </span>
                                        <span className={styles.tag}>
                                            {getTechnology(object.title)}
                                        </span>
                                    </div>
                                    <h3 className={styles.cardTitle}>
                                        {object.title}
                                    </h3>
                                    <dl className={styles.cardMeta}>
                                        {object.location && (
                                            <div>
                                                <dt>Локация</dt>
                                                <dd>{object.location}</dd>
                                            </div>
                                        )}
                                        {object.area && (
                                            <div>
                                                <dt>Площадь</dt>
                                                <dd>{object.area} м²</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section id="visit" className={styles.visitSection}>
                    <div className={styles.visitContent}>
                        <span className={styles.eyebrow}>{visit.eyebrow}</span>
                        <h2 className={styles.visitTitle}>{visit.title}</h2>
                        <p className={styles.visitText}>{visit.lead}</p>
                    </div>
                    <WorksVisitForm submitLabel={visit.button} />
                </section>
            </Container>
        </section>
    );
}
