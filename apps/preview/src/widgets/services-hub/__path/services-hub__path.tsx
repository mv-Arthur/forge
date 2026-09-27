"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ServicesHubPathStep } from "../services-hub.types";
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

const ICONS: Record<string, ReactNode> = {
    land: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M4 18h16M6 18 12 6l6 12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    project: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M7 4h7l4 4v12H7V4Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path
                d="M14 4v4h4M9 12h6M9 16h4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    ),
    prep: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M4 17h16M5 17V9l7-4 7 4v8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    build: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M4 20V9l8-5 8 5v11M10 20v-6h4v6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    control: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M14.5 14.5 20 20M10 17a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    ),
    handover: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M5 13.5 9.5 18 19 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    after: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12Zm-7 8c.4-3.2 3.2-5.5 7-5.5s6.6 2.3 7 5.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    ),
};

export function ServicesHubPath({
    heading,
    steps,
}: {
    heading: string;
    steps: ServicesHubPathStep[];
}) {
    const [active, setActive] = useState(steps[0]?.id ?? "");
    const current = steps.find((step) => step.id === active) ?? steps[0];
    if (!current) return null;

    return (
        <section data-section="services-path" className={styles.block}>
            <h2 className={styles.blockTitle}>{heading}</h2>
            <div className={styles.pathTabs} role="tablist">
                {steps.map((step) => {
                    const on = step.id === current.id;
                    return (
                        <button
                            key={step.id}
                            type="button"
                            role="tab"
                            aria-selected={on}
                            className={styles.pathTab}
                            aria-label={step.title}
                            onClick={() => setActive(step.id)}
                        >
                            <span className={styles.pathTabIcon}>
                                {ICONS[step.id]}
                            </span>
                            {step.title}
                        </button>
                    );
                })}
            </div>
            <div
                className={styles.pathPanel}
                role="tabpanel"
                data-path={current.id}
            >
                <div className={styles.pathCopy}>
                    <h3 className={styles.panelTitle}>{current.title}</h3>
                    <p className={styles.panelLead}>{current.lead}</p>
                    <ul className={styles.checks}>
                        {current.checks.map((check) => (
                            <li key={check}>{check}</li>
                        ))}
                    </ul>
                    <Link href={current.ctaHref} className={styles.panelCta}>
                        {current.ctaLabel}
                    </Link>
                </div>
                <div className={styles.pathOffers}>
                    {current.offers.map((offer) => (
                        <Link
                            key={offer.title}
                            href={offer.href}
                            className={
                                offer.image
                                    ? styles.pathOfferPhoto
                                    : styles.offer
                            }
                        >
                            {offer.image ? (
                                <span className={styles.pathOfferMedia}>
                                    <Image
                                        src={offer.image}
                                        alt=""
                                        fill
                                        unoptimized
                                        sizes="(min-width: 992px) 240px, 80vw"
                                        className={styles.pathOfferImage}
                                    />
                                    {offer.badge ? (
                                        <span className={styles.pathOfferBadge}>
                                            {offer.badge}
                                        </span>
                                    ) : null}
                                </span>
                            ) : null}
                            <span className={styles.pathOfferBody}>
                                <span className={styles.offerTitle}>
                                    {offer.title}
                                </span>
                                <span className={styles.offerMore}>
                                    {offer.moreLabel}
                                    <ArrowOut />
                                </span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
