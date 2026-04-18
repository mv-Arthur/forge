"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NAV_ITEMS } from "@/lib/constants";
import styles from "./Navbar.module.css";

export function Navbar() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <div className={styles.navBar}>
                <Container className={styles.navBarInner}>
                    <nav className={styles.nav}>
                        {NAV_ITEMS.map((item) => (
                            <div
                                key={item.href}
                                className={styles.navItem}
                                onMouseEnter={() =>
                                    item.children
                                        ? setOpenDropdown(item.href)
                                        : undefined
                                }
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <Link
                                    href={item.href}
                                    className={styles.navLink}
                                >
                                    {item.label}
                                </Link>
                                {item.children &&
                                    openDropdown === item.href && (
                                        <div className={styles.dropdown}>
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={
                                                        styles.dropdownLink
                                                    }
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </nav>

                    <button
                        type="button"
                        className={styles.burger}
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Меню"
                        aria-expanded={mobileOpen}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </Container>
            </div>

            {mobileOpen && (
                <div className={styles.mobileMenu}>
                    <Container>
                        {NAV_ITEMS.map((item) => (
                            <div key={item.href}>
                                <Link
                                    href={item.href}
                                    className={styles.mobileLink}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {item.label}
                                </Link>
                                {item.children?.map((child) => (
                                    <Link
                                        key={child.href}
                                        href={child.href}
                                        className={styles.mobileSubLink}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {child.label}
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </Container>
                </div>
            )}
        </>
    );
}
