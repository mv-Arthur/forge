import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBuiltObjects } from "@/data/built-objects";
import type { BuiltObject } from "@/domain/project";
import { WorksVisitForm } from "./WorksVisitForm";
import styles from "./works.module.css";

export const metadata: Metadata = {
    title: "Наши работы — построенные дома и карта объектов | Новый Коттедж",
    description:
        "Построенные дома компании Новый Коттедж на карте: СИП-панели, каркасные дома, газобетон и кирпич. Запишитесь на просмотр готового объекта.",
    alternates: { canonical: "/works" },
};

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

export default function WorksPage() {
    const objects = getBuiltObjects();
    const objectsWithCoords = objects.filter((object) => object.coords);
    const totalArea = getTotalArea(objects);
    const mapHighlights = objectsWithCoords.slice(0, 4);

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
                        eyebrow="Наши работы"
                        title="Построенные дома"
                        titleAccent="на карте"
                        lead="Готовые объекты в Санкт-Петербурге, Ленинградской области, Москве и соседних регионах. Покажем дома вживую, расскажем про технологию, сроки и реальную смету строительства."
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
                                объектов в подборке
                            </span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>
                                {objectsWithCoords.length}
                            </span>
                            <span className={styles.statLabel}>
                                отмечено на карте
                            </span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>
                                {totalArea.toLocaleString("ru-RU")}
                            </span>
                            <span className={styles.statLabel}>
                                м² построенной площади
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
                                Карта объектов
                            </span>
                            <h2 id="works-map" className={styles.sectionTitle}>
                                Где можно посмотреть наши дома
                            </h2>
                        </div>
                        <p className={styles.mapLead}>
                            Отмечаем регионы, где уже строили дома. Для
                            просмотра подберём ближайший объект и согласуем
                            удобное время с владельцем.
                        </p>
                    </div>

                    <div className={styles.mapCard}>
                        <div className={styles.mapCanvas} aria-hidden="true">
                            <span className={styles.mapLabelSpb}>
                                Санкт-Петербург
                            </span>
                            <span className={styles.mapLabelMsk}>Москва</span>
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
                                Маршрут просмотра
                            </span>
                            <h3 className={styles.mapAsideTitle}>
                                Запишитесь на просмотр готового дома
                            </h3>
                            <p className={styles.mapAsideText}>
                                Подберём ближайший объект по технологии и
                                площади, покажем качество строительства и
                                ответим на вопросы по смете.
                            </p>
                            <div className={styles.mapList}>
                                {mapHighlights.map((object) => (
                                    <span key={object.id}>
                                        {object.location}
                                    </span>
                                ))}
                            </div>
                            <a className={styles.mapAsideCta} href="#visit">
                                Записаться на просмотр
                            </a>
                        </div>
                    </div>
                </section>

                <section
                    className={styles.objectsSection}
                    aria-labelledby="works-list"
                >
                    <SectionHeading
                        eyebrow="Построенные объекты"
                        title="Дома, которые уже"
                        titleAccent="стоят"
                        lead="Подборка построенных объектов по разным технологиям и площадям. Для просмотра дома оставьте заявку — менеджер предложит ближайший объект."
                        align="left"
                        className={styles.listHeading}
                    />

                    <div id="works-list" className={styles.grid}>
                        {objects.map((object) => (
                            <article key={object.id} className={styles.card}>
                                <div className={styles.cardImage}>
                                    <img
                                        src={object.image}
                                        alt={object.title}
                                        loading="lazy"
                                        decoding="async"
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
                            </article>
                        ))}
                    </div>
                </section>

                <section id="visit" className={styles.visitSection}>
                    <div className={styles.visitContent}>
                        <span className={styles.eyebrow}>Просмотр объекта</span>
                        <h2 className={styles.visitTitle}>
                            Хотите увидеть качество строительства вживую?
                        </h2>
                        <p className={styles.visitText}>
                            Оставьте контакты — подберём построенный дом рядом с
                            вами, согласуем встречу и подготовим маршрут.
                        </p>
                    </div>
                    <WorksVisitForm />
                </section>
            </Container>
        </section>
    );
}
