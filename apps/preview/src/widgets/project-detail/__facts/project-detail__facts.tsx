import {
    DETAIL_FACT_AREA,
    DETAIL_FACT_SIZE,
    DETAIL_FACT_TECH,
    DETAIL_FACT_WARDROBE,
    DETAIL_PRICE_CUSTOM,
    DETAIL_PRICE_CUSTOM_LEAD,
    DETAIL_PRICE_HURRY,
    DETAIL_PRICE_ON,
    DETAIL_PRICE_SINCE,
} from "@/lib/copy";
import { Container } from "@/ui/container";
import {
    bathroomsWord,
    bedroomsWord,
    formatArea,
    formatPriceDetail,
    formatTechnologyBrand,
    pluralize,
} from "@/lib/format";
import type { MergedProject, ShowcasePriceHike } from "@/types/catalog";
import {
    BathIcon,
    BedIcon,
    DashedAreaIcon,
    InfoIcon,
    TerraceIcon,
    WardrobeIcon,
} from "@/ui/icons";
import type { ComponentType, SVGProps } from "react";
import styles from "./project-detail__facts.module.css";

function formatPriceDate(date: Date): string {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
        .format(date)
        .replace(/\s*г\.?\s*$/, "");
}

function formatDimensions(value: string): string {
    return `${value.replace(/\s*[xх×]\s*/gi, " × ")} м`;
}

function parseDay(iso: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }
    return date;
}

function startOfToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

type Metric = {
    key: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    label: string;
    hint?: string;
};

export function ProjectDetailFacts({
    project,
    priceHike = null,
}: {
    project: MergedProject;
    priceHike?: ShowcasePriceHike | null;
}) {
    const metrics: Metric[] = [];
    if (project.area != null) {
        metrics.push({
            key: "area",
            icon: DashedAreaIcon,
            label: formatArea(project.area),
            hint: DETAIL_FACT_AREA,
        });
    }
    if (project.bedrooms != null) {
        metrics.push({
            key: "beds",
            icon: BedIcon,
            label: `${project.bedrooms} ${bedroomsWord(project.bedrooms)}`,
        });
    }
    if (project.bathrooms != null) {
        metrics.push({
            key: "baths",
            icon: BathIcon,
            label: `${project.bathrooms} ${bathroomsWord(project.bathrooms)}`,
        });
    }
    if (project.hasWardrobe) {
        metrics.push({
            key: "wardrobe",
            icon: WardrobeIcon,
            label: `1 ${DETAIL_FACT_WARDROBE}`,
        });
    }
    if (project.hasTerrace) {
        metrics.push({
            key: "terrace",
            icon: TerraceIcon,
            label: `1 ${pluralize(1, ["терраса", "террасы", "террас"])}`,
        });
    }

    const rows: Array<{ label: string; value: string }> = [];
    if (project.dimensions) {
        rows.push({
            label: DETAIL_FACT_SIZE,
            value: formatDimensions(project.dimensions),
        });
    }
    if (project.technologies[0]) {
        rows.push({
            label: DETAIL_FACT_TECH,
            value: formatTechnologyBrand(project.technologies[0]),
        });
    }

    const activeVariant =
        project.variants.find(
            (item) => item.technology === project.technologies[0],
        ) ?? project.variants[0];
    const displayPrice = activeVariant?.priceFrom ?? project.priceFrom;
    const priced = displayPrice != null && displayPrice > 0;
    const hikeFrom = priceHike ? parseDay(priceHike.from) : null;
    const hikeNext =
        priceHike && Number.isFinite(priceHike.next) && priceHike.next > 0
            ? priceHike.next
            : null;
    const hikeOpen =
        hikeFrom != null &&
        hikeNext != null &&
        startOfToday() < hikeFrom;
    const shownPrice = hikeOpen
        ? displayPrice
        : hikeNext && hikeFrom && startOfToday() >= hikeFrom
          ? hikeNext
          : displayPrice;
    if (metrics.length === 0 && rows.length === 0 && !priced) return null;

    return (
        <section
            id="pd-about"
            data-section="detail-params"
            className={styles.section}
        >
            <Container className={styles.inner}>
                <div className={styles.card}>
                    {metrics.length > 0 ? (
                        <div className={styles.metrics}>
                            {metrics.map((metric) => {
                                const Icon = metric.icon;
                                return (
                                    <span key={metric.key} className={styles.metric}>
                                        <Icon />
                                        {metric.label}
                                        {metric.hint ? (
                                            <span
                                                className={styles.hint}
                                                title={metric.hint}
                                            >
                                                <InfoIcon />
                                            </span>
                                        ) : null}
                                    </span>
                                );
                            })}
                        </div>
                    ) : null}

                    <div className={styles.price}>
                        {priced && shownPrice != null ? (
                            <>
                                <div className={styles.priceDate}>
                                    {DETAIL_PRICE_ON} {formatPriceDate(new Date())}
                                </div>
                                {hikeOpen ? (
                                    <div className={styles.priceHurry}>
                                        {DETAIL_PRICE_HURRY}
                                    </div>
                                ) : null}
                                <div className={styles.priceValue}>
                                    {formatPriceDetail(shownPrice)}
                                </div>
                                {hikeOpen && hikeFrom && hikeNext ? (
                                    <>
                                        <div className={styles.priceNextDate}>
                                            {DETAIL_PRICE_SINCE}{" "}
                                            {formatPriceDate(hikeFrom)}
                                        </div>
                                        <div className={styles.priceNext}>
                                            {formatPriceDetail(hikeNext)}
                                        </div>
                                    </>
                                ) : null}
                            </>
                        ) : (
                            <>
                                <div className={styles.priceCustom}>
                                    {DETAIL_PRICE_CUSTOM}
                                </div>
                                <div className={styles.priceNote}>
                                    {DETAIL_PRICE_CUSTOM_LEAD}
                                </div>
                            </>
                        )}
                    </div>

                    {rows.length > 0 ? (
                        <dl className={styles.meta}>
                            {rows.map((row) => (
                                <div key={row.label}>
                                    <dt>{row.label}</dt>
                                    <dd>{row.value}</dd>
                                </div>
                            ))}
                        </dl>
                    ) : null}
                </div>
            </Container>
        </section>
    );
}
