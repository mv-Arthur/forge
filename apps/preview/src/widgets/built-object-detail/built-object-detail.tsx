import type { ReactNode } from "react";
import Image from "next/image";
import { Breadcrumb } from "@/ui/breadcrumb";
import { Container } from "@/ui/container";
import {
    formatArea,
    formatFloors,
    formatTechnologyBrand,
    photosWord,
} from "@/lib/format";
import {
    MORE_HOUSES,
    NAV_WORKS,
    OBJECT_GALLERY_HEADING,
    VISIT_HEADING,
    VISIT_LEAD,
} from "@/lib/copy";
import {
    BathIcon,
    BedIcon,
    MapPinIcon,
    RulerIcon,
    StairsIcon,
} from "@/ui/icons";
import { BuiltObjectCard } from "@/widgets/built-object-card/built-object-card";
import type { EnrichedBuiltObject } from "@/types/catalog";
import layout from "../project-detail/project-detail.module.css";
import styles from "./built-object-detail.module.css";

export function BuiltObjectDetail({
    object: obj,
    others,
    leadForm,
}: {
    object: EnrichedBuiltObject;
    others: EnrichedBuiltObject[];
    leadForm: ReactNode;
}) {
    const hero = obj.heroImage || obj.gallery[0] || null;

    return (
        <main className={layout.main}>
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Главная", href: "/" },
                        { label: NAV_WORKS, href: "/works" },
                        { label: obj.displayTitle },
                    ]}
                />
            </Container>
            <section data-section="object-hero" className={styles.hero}>
                {hero ? (
                    <Image
                        src={hero}
                        alt={obj.displayTitle}
                        fill
                        priority
                        unoptimized={hero.startsWith("/media/")}
                        className={styles.heroImg}
                        sizes="100vw"
                    />
                ) : null}
                <div className={styles.veil} />
                <Container className={styles.heroInner}>
                    <div>
                        <span
                            className={`badge ${
                                obj.status === "in-progress"
                                    ? "badge-progress"
                                    : "badge-built"
                            }`}
                        >
                            {obj.status === "in-progress"
                                ? "Строится"
                                : "Построен"}
                        </span>
                    </div>
                    <h1 className={styles.title}>{obj.displayTitle}</h1>
                    {obj.locationLabel ? (
                        <p className={styles.loc}>
                            <MapPinIcon className={styles.icon} />
                            {obj.locationLabel}
                        </p>
                    ) : null}
                </Container>
            </section>

            <section data-section="object-facts" className={layout.band}>
                <Container className={layout.pad}>
                    <div className={styles.facts}>
                        {obj.area != null ? (
                            <Fact
                                icon={<RulerIcon className={styles.icon} />}
                                label="Площадь"
                                value={formatArea(obj.area)}
                            />
                        ) : null}
                        {obj.floors ? (
                            <Fact
                                icon={<StairsIcon className={styles.icon} />}
                                label="Этажность"
                                value={formatFloors(obj.floors)}
                            />
                        ) : null}
                        {obj.bedrooms != null ? (
                            <Fact
                                icon={<BedIcon className={styles.icon} />}
                                label="Спальни"
                                value={String(obj.bedrooms)}
                            />
                        ) : null}
                        {obj.bathrooms != null ? (
                            <Fact
                                icon={<BathIcon className={styles.icon} />}
                                label="Санузлы"
                                value={String(obj.bathrooms)}
                            />
                        ) : null}
                        {obj.technology ? (
                            <Fact
                                icon={null}
                                label="Материал"
                                value={formatTechnologyBrand(obj.technology)}
                            />
                        ) : null}
                        {obj.gallery.length > 0 ? (
                            <Fact
                                icon={null}
                                label="Фото"
                                value={`${obj.gallery.length} ${photosWord(obj.gallery.length)}`}
                            />
                        ) : null}
                    </div>
                    {obj.metaDescription ? (
                        <p className={styles.desc}>{obj.metaDescription}</p>
                    ) : null}
                </Container>
            </section>

            {obj.gallery.length > 0 ? (
                <section
                    data-section="object-gallery"
                    className={layout.bandSoft}
                >
                    <Container className={layout.pad}>
                        <div className={`eyebrow ${layout.eyebrow}`}>Фото</div>
                        <h2 className={`${layout.heading} ${layout.headingGap}`}>
                            {OBJECT_GALLERY_HEADING}
                        </h2>
                        <div className={layout.photos}>
                            {obj.gallery.map((src, i) => (
                                <div key={src + i} className={layout.photo}>
                                    <Image
                                        src={src}
                                        alt={`${obj.displayTitle} - ${i + 1}`}
                                        fill
                                        unoptimized={src.startsWith("/media/")}
                                        className={layout.photoImg}
                                        sizes="(min-width:1024px) 33vw, 100vw"
                                    />
                                </div>
                            ))}
                        </div>
                    </Container>
                </section>
            ) : null}

            <section
                data-section="object-lead"
                className={layout.leadBandWhite}
            >
                <Container className={layout.leadGrid}>
                    <div>
                        <div className={`eyebrow ${layout.eyebrow}`}>Показ</div>
                        <h2 className={`${layout.heading} ${layout.headingGap}`}>
                            {VISIT_HEADING}
                        </h2>
                        <p className={layout.lead}>{VISIT_LEAD}</p>
                    </div>
                    <div className={layout.leadBoxSoft}>{leadForm}</div>
                </Container>
            </section>

            {others.length > 0 ? (
                <section className={layout.similar}>
                    <Container>
                        <div className={`eyebrow ${layout.eyebrow}`}>
                            {MORE_HOUSES}
                        </div>
                        <h2 className={`${layout.heading} ${layout.headingGap}`}>
                            {MORE_HOUSES}
                        </h2>
                        <div className={layout.cards}>
                            {others.map((o) => (
                                <BuiltObjectCard key={o.slug} object={o} />
                            ))}
                        </div>
                    </Container>
                </section>
            ) : null}
        </main>
    );
}

function Fact({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className={styles.fact}>
            <div className={styles.factLabel}>
                {icon}
                {label}
            </div>
            <div className={styles.factValue}>{value}</div>
        </div>
    );
}
