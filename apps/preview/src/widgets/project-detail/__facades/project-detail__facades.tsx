"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
    DETAIL_FACADES_CUSTOMERS,
    DETAIL_FACADES_HEADING,
    DETAIL_FACADES_NOTE,
} from "@/lib/copy";
import type { ShowcaseCustomerAlts } from "@/types/catalog";
import type { DetailFacade } from "../lib/illustrations";
import { ProjectDetailAlts } from "../__alts/project-detail__alts";
import styles from "./project-detail__facades.module.css";

export function ProjectDetailFacades({
    facades,
    alts = null,
    customersHref,
    stub = false,
}: {
    facades: DetailFacade[];
    alts?: ShowcaseCustomerAlts | null;
    customersHref?: string;
    stub?: boolean;
}) {
    const [activeId, setActiveId] = useState(facades[0]?.id ?? "");
    const [altsOpen, setAltsOpen] = useState(false);
    const current = facades.find((f) => f.id === activeId) ?? facades[0];
    if (!current) return null;
    const hasSection = facades.some((f) => f.sectionSrc);
    const showAlts = Boolean(alts);
    const showGallery = Boolean(customersHref) && !showAlts;

    return (
        <div data-stub={stub ? "true" : undefined}>
            <div className={styles.header}>
                <h2 className={styles.heading}>{DETAIL_FACADES_HEADING}</h2>
                {showAlts ? (
                    <button
                        type="button"
                        className={styles.cta}
                        onClick={() => setAltsOpen(true)}
                    >
                        {DETAIL_FACADES_CUSTOMERS}
                    </button>
                ) : null}
                {showGallery && customersHref ? (
                    <Link
                        href={customersHref}
                        className={styles.cta}
                    >
                        {DETAIL_FACADES_CUSTOMERS}
                    </Link>
                ) : null}
            </div>
            {altsOpen && alts
                ? createPortal(
                      <ProjectDetailAlts
                          alts={alts}
                          initialTab="facades"
                          onClose={() => setAltsOpen(false)}
                      />,
                      document.body,
                  )
                : null}
            <div className={styles.tabs} role="tablist">
                {facades.map((f) => (
                    <button
                        key={f.id}
                        type="button"
                        role="tab"
                        className={styles.tab}
                        aria-selected={f.id === current.id}
                        onClick={() => setActiveId(f.id)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
            <div
                className={hasSection ? styles.split : styles.single}
            >
                <div className={styles.frame}>
                    <Image
                        src={current.src}
                        alt={`${DETAIL_FACADES_HEADING}: ${current.label}`}
                        fill
                        unoptimized={current.src.startsWith("/media/")}
                        className={styles.img}
                        sizes={
                            hasSection
                                ? "(min-width:992px) 45vw, 100vw"
                                : "(min-width:1024px) 70vw, 100vw"
                        }
                    />
                </div>
                {current.sectionSrc ? (
                    <div className={styles.sectionCol}>
                        <div className={styles.frame}>
                            <Image
                                src={current.sectionSrc}
                                alt=""
                                fill
                                unoptimized={current.sectionSrc.startsWith(
                                    "/media/",
                                )}
                                className={styles.img}
                                sizes="(min-width:992px) 45vw, 100vw"
                            />
                        </div>
                        <p className={styles.note}>{DETAIL_FACADES_NOTE}</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
