"use client";

import { useState } from "react";
import { ServiceCtaLink } from "./ServiceCtaLink";
import styles from "./detail.module.css";

export type SignatureLayout =
    | "packages"
    | "timeline"
    | "matrix"
    | "systems"
    | "levels"
    | "experience"
    | "launch"
    | "site"
    | "protocol";

export interface SignatureItem {
    title: string;
    description: string;
    kicker?: string;
    meta?: string[];
}

export interface ServiceSignatureData {
    layout: SignatureLayout;
    eyebrow: string;
    title: string;
    lead: string;
    items: SignatureItem[];
    asideItems: string[];
}

interface ServiceSignatureProps {
    signature: ServiceSignatureData;
    detailNextStep: string;
    detailPromise: string;
    detailCta: string;
    ctaHref: string;
    serviceSlug: string;
    serviceTitle: string;
    sectionId?: string;
}

const SIGNATURE_LAYOUT_CLASSES: Record<SignatureLayout, string> = {
    packages: styles.signaturePackages,
    timeline: styles.signatureTimeline,
    matrix: styles.signatureMatrix,
    systems: styles.signatureSystems,
    levels: styles.signatureLevels,
    experience: styles.signatureExperience,
    launch: styles.signatureLaunch,
    site: styles.signatureSite,
    protocol: styles.signatureProtocol,
};

function cn(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function ServiceSignature({
    signature,
    detailNextStep,
    detailPromise,
    detailCta,
    ctaHref,
    serviceSlug,
    serviceTitle,
    sectionId,
}: ServiceSignatureProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeItem = signature.items[activeIndex] ?? signature.items[0];

    return (
        <section
            id={sectionId}
            className={cn(
                styles.serviceStudio,
                SIGNATURE_LAYOUT_CLASSES[signature.layout]
            )}
        >
            <div className={styles.studioHeader}>
                <p className={styles.eyebrow}>{signature.eyebrow}</p>
                <h2>{signature.title}</h2>
                <p>{signature.lead}</p>
            </div>

            <div className={styles.studioGrid}>
                <article className={styles.studioMedia}>
                    <div className={styles.studioBlueprint} aria-hidden="true">
                        <span />
                        <span />
                        <span />
                        <i />
                        <i />
                    </div>
                    <div className={styles.studioMediaShade} />
                    <div className={styles.studioOverlay} aria-live="polite">
                        <span>
                            {String(activeIndex + 1).padStart(2, "0")}
                        </span>
                        <h3>{activeItem.title}</h3>
                        <p>{activeItem.description}</p>
                        {activeItem.meta && (
                            <ul>
                                {activeItem.meta.map((meta) => (
                                    <li key={meta}>{meta}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </article>

                <div className={styles.studioControls}>
                    {signature.items.map((item, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <button
                                key={item.title}
                                type="button"
                                className={cn(
                                    styles.studioControl,
                                    isActive && styles.studioControlActive
                                )}
                                onClick={() => setActiveIndex(index)}
                                aria-pressed={isActive}
                            >
                                <small>
                                    {item.kicker ??
                                        String(index + 1).padStart(2, "0")}
                                </small>
                                <strong>{item.title}</strong>
                                <span>{item.description}</span>
                            </button>
                        );
                    })}
                </div>

                <aside className={styles.studioBrief}>
                    <span>Следующий шаг</span>
                    <h3>{detailNextStep}</h3>
                    <p>{detailPromise}</p>
                    <ul>
                        {signature.asideItems.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                    <ServiceCtaLink
                        href={ctaHref}
                        serviceSlug={serviceSlug}
                        serviceTitle={serviceTitle}
                        action="request"
                        placement="signature"
                    >
                        {detailCta}
                    </ServiceCtaLink>
                </aside>
            </div>
        </section>
    );
}
