"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    BATH_PROJECT_LABEL,
    DETAIL_BACK,
    DETAIL_CTA_LEAD,
} from "@/lib/copy";
import { formatArea } from "@/lib/format";
import { ChevronLeftIcon, ChevronRightIcon } from "@/ui/icons";
import type { MergedProject } from "@/types/catalog";
import { Container } from "@/ui/container";
import styles from "./individual-hero.module.css";

export function ProjectDetailIndividualHero({
    project,
    images,
    lead,
}: {
    project: MergedProject;
    images: string[];
    lead: string;
}) {
    const [i, setI] = useState(0);
    const n = images.length;
    const src = images[i] || project.heroImage || "";
    const bath = project.projectClass === "bath";

    const go = (dir: 1 | -1) => {
        if (n < 2) return;
        setI((x) => (x + dir + n) % n);
    };

    return (
        <section data-section="detail-hero" className={styles.root}>
            <Container className={styles.inner}>
                <div className={styles.top}>
                    <div>
                        <Link href="/projects" className={styles.back}>
                            <ChevronLeftIcon className={styles.icon} />
                            {DETAIL_BACK}
                        </Link>
                        <h1 className={styles.title}>{project.displayName}</h1>
                        <p className={styles.meta}>
                            {lead || project.subtitle}
                            {project.area != null
                                ? ` · ${formatArea(project.area)}`
                                : ""}
                        </p>
                        {bath ? (
                            <span className={styles.chip}>
                                {BATH_PROJECT_LABEL}
                            </span>
                        ) : null}
                    </div>
                    <a href="#detail-lead" className="btn btn-primary">
                        {DETAIL_CTA_LEAD}
                    </a>
                </div>
                <div className={styles.stage}>
                    {src ? (
                        <Image
                            src={src}
                            alt={project.displayName}
                            fill
                            priority
                            unoptimized={src.startsWith("/media/")}
                            className={styles.photo}
                            sizes="100vw"
                        />
                    ) : null}
                    {n > 1 ? (
                        <>
                            <button
                                type="button"
                                className={`${styles.arrow} ${styles.prev}`}
                                onClick={() => go(-1)}
                                aria-label="Предыдущее фото"
                            >
                                <ChevronLeftIcon className={styles.iconMd} />
                            </button>
                            <button
                                type="button"
                                className={`${styles.arrow} ${styles.next}`}
                                onClick={() => go(1)}
                                aria-label="Следующее фото"
                            >
                                <ChevronRightIcon className={styles.iconMd} />
                            </button>
                        </>
                    ) : null}
                </div>
                {n > 1 ? (
                    <div className={styles.thumbs}>
                        {images.map((img, idx) => (
                            <button
                                key={img + idx}
                                type="button"
                                className={styles.thumb}
                                data-active={idx === i}
                                aria-label={`Слайд ${idx + 1}`}
                                onClick={() => setI(idx)}
                            >
                                <Image
                                    src={img}
                                    alt=""
                                    fill
                                    unoptimized={img.startsWith("/media/")}
                                    sizes="90px"
                                    className={styles.photo}
                                />
                            </button>
                        ))}
                    </div>
                ) : null}
            </Container>
        </section>
    );
}
