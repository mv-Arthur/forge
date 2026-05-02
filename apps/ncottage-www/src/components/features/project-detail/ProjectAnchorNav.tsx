"use client";

import { useEffect, useState } from "react";
import styles from "./ProjectAnchorNav.module.css";

interface AnchorItem {
    id: string;
    label: string;
}

interface ProjectAnchorNavProps {
    items: AnchorItem[];
}

export function ProjectAnchorNav({ items }: ProjectAnchorNavProps) {
    const [active, setActive] = useState(items[0]?.id ?? "");

    useEffect(() => {
        if (items.length === 0) return;
        const elements = items
            .map((it) => document.getElementById(it.id))
            .filter((el): el is HTMLElement => Boolean(el));
        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top
                    );
                if (visible[0]) setActive(visible[0].target.id);
            },
            {
                rootMargin: "-160px 0px -55% 0px",
                threshold: 0,
            }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [items]);

    if (items.length <= 1) return null;

    return (
        <nav className={styles.nav} aria-label="Разделы проекта">
            <ul className={styles.list}>
                {items.map((it) => (
                    <li key={it.id}>
                        <a
                            href={`#${it.id}`}
                            className={`${styles.link} ${active === it.id ? styles.linkActive : ""}`}
                        >
                            {it.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
