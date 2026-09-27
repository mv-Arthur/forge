"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import {
    BuiltHousesIcon,
    CheckIcon,
    HouseIcon,
    InfoIcon,
    LayoutPlanIcon,
    SparklesIcon,
} from "@/ui/icons";
import { Container } from "@/ui/container";
import styles from "./project-detail__nav.module.css";

export type DetailNavItem = {
    href: string;
    label: string;
    icon:
        | "about"
        | "plans"
        | "facades"
        | "decor"
        | "built"
        | "package";
};

const ICONS: Record<
    DetailNavItem["icon"],
    ComponentType<SVGProps<SVGSVGElement>>
> = {
    about: InfoIcon,
    plans: LayoutPlanIcon,
    facades: HouseIcon,
    decor: SparklesIcon,
    built: BuiltHousesIcon,
    package: CheckIcon,
};

export function ProjectDetailNav({ items }: { items: DetailNavItem[] }) {
    const ids = useMemo(
        () => items.map((item) => item.href.replace("#", "")),
        [items],
    );
    const [active, setActive] = useState(ids[0] ?? "");

    useEffect(() => {
        if (ids.length === 0) return;
        const sections = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => Boolean(el));
        if (sections.length === 0) return;

        const visible = new Map<string, number>();
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    visible.set(entry.target.id, entry.intersectionRatio);
                }
                let best = ids[0];
                let bestRatio = 0;
                for (const id of ids) {
                    const ratio = visible.get(id) ?? 0;
                    if (ratio > bestRatio) {
                        bestRatio = ratio;
                        best = id;
                    }
                }
                if (bestRatio > 0) setActive(best);
            },
            {
                rootMargin: "-28% 0px -58% 0px",
                threshold: [0, 0.1, 0.25, 0.5, 1],
            },
        );
        for (const section of sections) io.observe(section);
        return () => io.disconnect();
    }, [ids]);

    if (items.length === 0) return null;

    return (
        <nav data-section="detail-nav" className={styles.root}>
            <Container>
                <ul className={styles.list}>
                    {items.map((item) => {
                        const Icon = ICONS[item.icon];
                        const id = item.href.replace("#", "");
                        const isActive = active === id;
                        return (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className={styles.link}
                                    data-active={isActive ? "true" : "false"}
                                    aria-current={
                                        isActive ? "location" : undefined
                                    }
                                    onClick={() => setActive(id)}
                                >
                                    <Icon />
                                    {item.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </Container>
        </nav>
    );
}
