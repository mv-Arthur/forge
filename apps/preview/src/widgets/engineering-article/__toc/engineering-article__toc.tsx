"use client";

import { useEffect, useState } from "react";
import { ENGINEERING_TOC } from "@/lib/copy";
import type { EngineeringTocItem } from "../engineering-article.types";
import styles from "./toc.module.css";

export function EngineeringArticleToc({ items }: { items: EngineeringTocItem[] }) {
    const [active, setActive] = useState(items[0]?.id ?? "");

    useEffect(() => {
        if (items.length === 0) return;
        const nodes = items
            .map((item) => document.getElementById(item.id))
            .filter((node): node is HTMLElement => node != null);
        if (nodes.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top,
                    );
                const id = visible[0]?.target.id;
                if (id) setActive(id);
            },
            { rootMargin: "-120px 0px -55% 0px", threshold: 0.05 },
        );
        for (const node of nodes) observer.observe(node);
        return () => observer.disconnect();
    }, [items]);

    if (items.length === 0) return null;

    const list = (
        <ol className={styles.list}>
            {items.map((item) => (
                <li
                    key={item.id}
                    className={item.level === 3 ? styles.child : undefined}
                >
                    <a
                        href={`#${item.id}`}
                        className={
                            item.id === active ? styles.linkActive : styles.link
                        }
                    >
                        {item.text}
                    </a>
                </li>
            ))}
        </ol>
    );

    return (
        <>
            <nav className={styles.desktop} aria-label={ENGINEERING_TOC}>
                <div className={styles.title}>{ENGINEERING_TOC}</div>
                {list}
            </nav>
            <details className={styles.mobile}>
                <summary className={styles.summary}>{ENGINEERING_TOC}</summary>
                {list}
            </details>
        </>
    );
}
