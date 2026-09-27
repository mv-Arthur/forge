"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ServicesHubSituation } from "../services-hub.types";
import styles from "../services-hub.module.css";

function ArrowOut() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M7 17L17 7M17 7H8.5M17 7V15.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ArrowDown() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M12 5v14M5.5 12.5 12 19l6.5-6.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ServicesHubSituations({
    heading,
    lead,
    items,
}: {
    heading: string;
    lead: string;
    items: ServicesHubSituation[];
}) {
    const [active, setActive] = useState(items[0]?.id ?? "");
    const current = items.find((item) => item.id === active) ?? items[0];
    if (!current) return null;

    return (
        <section data-section="services-situations" className={styles.block}>
            <h2 className={styles.blockTitle}>{heading}</h2>
            <p className={styles.blockLead}>{lead}</p>
            <div className={styles.situationTabs} role="tablist">
                {items.map((item) => {
                    const on = item.id === current.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            aria-selected={on}
                            className={styles.situationTab}
                            onClick={() => setActive(item.id)}
                        >
                            <Image
                                src={item.image}
                                alt=""
                                fill
                                unoptimized
                                sizes="(min-width: 992px) 25vw, 70vw"
                                className={styles.situationTabImage}
                            />
                            <span className={styles.situationTabShade} />
                            <span className={styles.situationTabCopy}>
                                <span className={styles.situationTabTitle}>
                                    {item.title}
                                </span>
                                <span className={styles.situationTabLead}>
                                    {item.lead}
                                </span>
                            </span>
                            <span className={styles.situationTabIcon}>
                                {on ? <ArrowDown /> : <ArrowOut />}
                            </span>
                        </button>
                    );
                })}
            </div>
            <div
                className={styles.situationPanel}
                role="tabpanel"
                data-situation={current.id}
            >
                <div className={styles.situationCopy}>
                    <h3 className={styles.panelTitle}>{current.panelTitle}</h3>
                    <p className={styles.panelLead}>{current.panelLead}</p>
                    <Link href={current.ctaHref} className={styles.panelCta}>
                        {current.ctaLabel}
                        <ArrowOut />
                    </Link>
                </div>
                <div className={styles.offerGrid}>
                    {current.offers.map((offer) => (
                        <Link
                            key={offer.title}
                            href={offer.href}
                            className={styles.offer}
                        >
                            <span className={styles.offerMeta}>
                                {offer.kicker ? (
                                    <span className={styles.offerKicker}>
                                        {offer.kicker}
                                    </span>
                                ) : (
                                    <span />
                                )}
                                {offer.badge ? (
                                    <span className={styles.offerBadge}>
                                        {offer.badge}
                                    </span>
                                ) : null}
                            </span>
                            <span className={styles.offerMark} aria-hidden>
                                <ArrowOut />
                            </span>
                            <span className={styles.offerTitle}>
                                {offer.title}
                            </span>
                            <span className={styles.offerMore}>
                                {offer.moreLabel}
                                <ArrowOut />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
