"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@/ui/icons";
import type { HeaderListItem } from "../lib/list-menus";
import { NavMenuIcon } from "./icons";
import styles from "./site-header__list-menu.module.css";

export function SiteHeaderListMenu({
    open,
    items,
    align = "start",
}: {
    open: boolean;
    items: HeaderListItem[];
    align?: "start" | "end";
}) {
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        if (!open) setExpanded(null);
    }, [open]);

    return (
        <div
            className={styles.root}
            data-section="header-list-menu"
            data-open={open || undefined}
            data-align={align}
            aria-hidden={!open}
            inert={!open ? true : undefined}
        >
            <div className={styles.panel}>
                {items.map((item) => {
                    const isOpen = expanded === item.href;
                    return (
                        <div
                            key={item.href}
                            className={styles.item}
                            data-open={isOpen || undefined}
                        >
                            <Link href={item.href} className={styles.row}>
                                <span className={styles.icon} aria-hidden>
                                    <NavMenuIcon name={item.icon} />
                                </span>
                                {item.label}
                            </Link>
                            {item.children ? (
                                <button
                                    type="button"
                                    className={styles.chevron}
                                    aria-label={
                                        isOpen
                                            ? "Свернуть список"
                                            : "Открыть список"
                                    }
                                    aria-expanded={isOpen}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        setExpanded(isOpen ? null : item.href);
                                    }}
                                >
                                    <ChevronDownIcon />
                                </button>
                            ) : null}
                            {item.children && isOpen ? (
                                <div className={styles.children}>
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            className={styles.child}
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
