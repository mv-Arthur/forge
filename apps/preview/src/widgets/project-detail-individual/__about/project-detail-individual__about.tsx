"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    DETAIL_ARCHITECT_NAME,
    DETAIL_ARCHITECT_PORTFOLIO,
    DETAIL_ARCHITECT_ROLE,
    DETAIL_NAV_ABOUT,
} from "@/lib/copy";
import { ChevronDownIcon } from "@/ui/icons";
import type { ShowcaseAboutBlock } from "@/types/catalog";
import styles from "./individual-about.module.css";

const ARCHITECT_PHOTO = "/media/detail/architect.jpg";

export function ProjectDetailIndividualAbout({
    about,
    portfolioHref,
    className,
}: {
    about: ShowcaseAboutBlock[];
    portfolioHref: string;
    className?: string;
}) {
    const scroller = useRef<HTMLDivElement>(null);
    const [canUp, setCanUp] = useState(false);
    const [canDown, setCanDown] = useState(false);

    const update = useCallback(() => {
        const el = scroller.current;
        if (!el) return;
        setCanUp(el.scrollTop > 4);
        setCanDown(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
    }, []);

    useEffect(() => {
        const el = scroller.current;
        if (!el) return;
        update();
        el.addEventListener("scroll", update, { passive: true });
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => {
            el.removeEventListener("scroll", update);
            ro.disconnect();
        };
    }, [update, about]);

    const overflow = canUp || canDown;

    if (about.length === 0) return null;

    const step = (dir: -1 | 1) => {
        scroller.current?.scrollBy({ top: dir * 140, behavior: "smooth" });
    };

    return (
        <section
            data-section="detail-about"
            className={className ? `${styles.root} ${className}` : styles.root}
        >
            <div className={styles.card}>
                <h2 className={styles.title}>{DETAIL_NAV_ABOUT}</h2>
                <div ref={scroller} className={styles.scroll}>
                    {about.map((block, i) => (
                        <div key={block.title + i} className={styles.block}>
                            {block.title &&
                            block.title !== DETAIL_NAV_ABOUT ? (
                                <h3 className={styles.blockTitle}>
                                    {block.title}
                                </h3>
                            ) : null}
                            <p className={styles.text}>{block.text}</p>
                        </div>
                    ))}
                </div>
                {overflow ? (
                    <div className={styles.arrows}>
                        <button
                            type="button"
                            className={styles.arrow}
                            onClick={() => step(-1)}
                            disabled={!canUp}
                            aria-label="Прокрутить текст вверх"
                        >
                            <ChevronDownIcon className={styles.arrowUp} />
                        </button>
                        <button
                            type="button"
                            className={styles.arrow}
                            onClick={() => step(1)}
                            disabled={!canDown}
                            aria-label="Прокрутить текст вниз"
                        >
                            <ChevronDownIcon />
                        </button>
                    </div>
                ) : null}
                <aside className={styles.arch}>
                    <Image
                        src={ARCHITECT_PHOTO}
                        alt={DETAIL_ARCHITECT_NAME}
                        width={200}
                        height={200}
                        unoptimized
                        className={styles.archPhoto}
                    />
                    <p className={styles.archRole}>{DETAIL_ARCHITECT_ROLE}</p>
                    <p className={styles.archName}>{DETAIL_ARCHITECT_NAME}</p>
                    <Link href={portfolioHref} className={styles.archLink}>
                        {DETAIL_ARCHITECT_PORTFOLIO}
                    </Link>
                </aside>
            </div>
        </section>
    );
}
