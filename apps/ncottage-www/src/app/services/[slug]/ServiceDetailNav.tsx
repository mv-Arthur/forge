"use client";

import { useEffect, useState } from "react";
import styles from "./detail.module.css";

export interface ServiceDetailNavItem {
    href: string;
    label: string;
}

interface ServiceDetailNavProps {
    items: ServiceDetailNavItem[];
}

function getSectionId(href: string) {
    return href.replace(/^#/, "");
}

export function ServiceDetailNav({ items }: ServiceDetailNavProps) {
    const [activeHref, setActiveHref] = useState(items[0]?.href ?? "");

    useEffect(() => {
        const sections = items
            .map((item) => document.getElementById(getSectionId(item.href)))
            .filter((section): section is HTMLElement => Boolean(section));

        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const activeEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (current, next) =>
                            next.intersectionRatio - current.intersectionRatio
                    )[0];

                if (activeEntry) {
                    setActiveHref(`#${activeEntry.target.id}`);
                }
            },
            {
                rootMargin: "-32% 0px -58% 0px",
                threshold: [0.02, 0.18, 0.36],
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [items]);

    return (
        <nav
            className={styles.detailNav}
            aria-label="Навигация по странице услуги"
        >
            {items.map((item) => {
                const isActive = item.href === activeHref;

                return (
                    <a
                        key={item.href}
                        className={
                            isActive ? styles.detailNavLinkActive : undefined
                        }
                        href={item.href}
                        aria-current={isActive ? "location" : undefined}
                        onClick={() => setActiveHref(item.href)}
                    >
                        {item.label}
                    </a>
                );
            })}
        </nav>
    );
}
