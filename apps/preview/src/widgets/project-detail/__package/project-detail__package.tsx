"use client";

import { useState, type ReactNode } from "react";
import type { ShowcaseComplectation } from "@/types/catalog";
import {
    DETAIL_PACKAGE_HEADING,
    DETAIL_PACKAGE_PRICE,
    DETAIL_PACKAGE_STAGES,
} from "@/lib/copy";
import { formatPriceDetail } from "@/lib/format";
import {
    ChevronDownIcon,
    ChevronRightIcon,
    HouseIcon,
    LayoutPlanIcon,
    SparklesIcon,
    StairsIcon,
} from "@/ui/icons";
import styles from "./project-detail__package.module.css";

const STAGE_ICON = {
    site: LayoutPlanIcon,
    eng: StairsIcon,
    interior: SparklesIcon,
    facade: HouseIcon,
} as const;

function firstOpenId(section: ShowcaseComplectation["sections"][0] | undefined) {
    return section?.items.find((item) => item.text)?.id ?? null;
}

export function ProjectDetailPackage({
    complectation,
    price,
    cta,
}: {
    complectation: ShowcaseComplectation;
    price: number | null;
    cta: ReactNode;
}) {
    const [active, setActive] = useState(0);
    const [openId, setOpenId] = useState<string | null>(() =>
        firstOpenId(complectation.sections[0]),
    );
    const section = complectation.sections[active];
    if (!section) return null;

    const select = (index: number) => {
        setActive(index);
        setOpenId(firstOpenId(complectation.sections[index]));
    };

    return (
        <div>
            <h2 className={styles.heading}>{DETAIL_PACKAGE_HEADING}</h2>
            <div className={styles.main}>
                <div className={styles.aside}>
                    <div className={styles.tabs}>
                        {complectation.sections.map((item, index) => {
                            const on = index === active;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={styles.tab}
                                    aria-pressed={on}
                                    onClick={() => select(index)}
                                >
                                    <span className={styles.tabTitle}>
                                        {item.title}
                                    </span>
                                    <span className={styles.tabIcon} aria-hidden>
                                        <ChevronRightIcon />
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <p className={styles.about}>{complectation.about}</p>
                    <div className={styles.priceRow}>
                        <div className={styles.price}>
                            {DETAIL_PACKAGE_PRICE}
                            <span className={styles.priceValue}>
                                {formatPriceDetail(price).replace(" ₽", "")}
                            </span>
                        </div>
                        <div className={styles.cta}>{cta}</div>
                    </div>
                </div>
                <ol className={styles.details}>
                    {section.items.map((item) => {
                        const hasText = Boolean(item.text);
                        const open = hasText && openId === item.id;
                        return (
                            <li
                                key={item.id}
                                className={styles.detail}
                                data-open={open ? "true" : undefined}
                            >
                                {hasText ? (
                                    <button
                                        type="button"
                                        className={styles.detailHead}
                                        aria-expanded={open}
                                        onClick={() =>
                                            setOpenId(open ? null : item.id)
                                        }
                                    >
                                        <span className={styles.detailTitle}>
                                            {item.title}
                                        </span>
                                        <span
                                            className={styles.detailIcon}
                                            aria-hidden
                                        >
                                            <ChevronDownIcon />
                                        </span>
                                    </button>
                                ) : (
                                    <div className={styles.detailHead}>
                                        <span className={styles.detailTitle}>
                                            {item.title}
                                        </span>
                                    </div>
                                )}
                                {hasText && open ? (
                                    <p className={styles.detailBody}>
                                        {item.text}
                                    </p>
                                ) : null}
                            </li>
                        );
                    })}
                </ol>
            </div>
            {complectation.stages.length > 0 ? (
                <div>
                    <h3 className={styles.stagesHead}>
                        {DETAIL_PACKAGE_STAGES}
                    </h3>
                    <div className={styles.stages}>
                        {complectation.stages.map((stage) => {
                            const Icon =
                                STAGE_ICON[
                                    stage.id as keyof typeof STAGE_ICON
                                ] ?? HouseIcon;
                            return (
                                <article key={stage.id} className={styles.stage}>
                                    <span className={styles.stageIcon} aria-hidden>
                                        <Icon />
                                    </span>
                                    <h4 className={styles.stageTitle}>
                                        {stage.title}
                                    </h4>
                                    <p className={styles.stageText}>
                                        {stage.text}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
