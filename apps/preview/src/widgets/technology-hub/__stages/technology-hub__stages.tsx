"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { TechnologyHubStageColumn } from "../technology-hub.types";
import styles from "../technology-hub.module.css";

export function TechnologyHubStages({
    heading,
    columns,
}: {
    heading: string;
    columns: TechnologyHubStageColumn[];
}) {
    const [open, setOpen] = useState<string | null>(null);

    return (
        <section data-section="technology-stages" className={styles.block}>
            <h2 className={styles.blockTitle}>{heading}</h2>
            <div className={styles.stages}>
                {columns.map((column) => {
                    const isOpen = open === column.id;
                    return (
                        <article
                            key={column.id}
                            className={styles.stage}
                            data-open={isOpen || undefined}
                            onClick={() => setOpen(isOpen ? null : column.id)}
                        >
                            <span className={styles.stageMedia}>
                                <Image
                                    src={column.image}
                                    alt=""
                                    fill
                                    unoptimized={column.image.startsWith(
                                        "/media/",
                                    )}
                                    sizes="(min-width: 768px) 30vw, 100vw"
                                    className={styles.stageImage}
                                    priority
                                />
                            </span>
                            <span className={styles.stageShade} />
                            <div className={styles.stageFooter}>
                                <h3 className={styles.stageTitle}>
                                    {column.title}
                                </h3>
                                {column.moreHref ? (
                                    <Link
                                        href={column.moreHref}
                                        className={styles.stageMore}
                                        onClick={(event) =>
                                            event.stopPropagation()
                                        }
                                    >
                                        {column.moreLabel}
                                    </Link>
                                ) : null}
                            </div>
                            <div className={styles.stagePanel}>
                                <h3 className={styles.stagePanelTitle}>
                                    {column.title}
                                </h3>
                                {column.lead ? (
                                    <p className={styles.stageLead}>
                                        {column.lead}
                                    </p>
                                ) : null}
                                {column.links.length > 0 ? (
                                    <ul className={styles.stageList}>
                                        {column.links.map((link) => (
                                            <li key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    onClick={(event) =>
                                                        event.stopPropagation()
                                                    }
                                                >
                                                    {link.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                                {column.ctaHref && column.ctaLabel ? (
                                    <Link
                                        href={column.ctaHref}
                                        className={styles.stageCta}
                                        onClick={(event) =>
                                            event.stopPropagation()
                                        }
                                    >
                                        {column.ctaLabel}
                                    </Link>
                                ) : null}
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
