"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PHONES, EMAIL, NAV_ITEMS } from "@/lib/constants";
import styles from "./Header.module.css";

export function Header() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className={styles.header}>
            {/* Top bar: logo + address + contacts + CTA */}
            <div className={styles.topBar}>
                <Container className={styles.topBarInner}>
                    <Link href="/" className={styles.logo}>
                        <Image
                            src="/images/logo.png"
                            alt="Новый Коттедж"
                            width={160}
                            height={45}
                            priority
                        />
                    </Link>
                    <div className={styles.contacts}>
                        <span className={styles.schedule}>
                            Пн-Пт: 10:00 до 19:00
                        </span>
                        <a href={`mailto:${EMAIL}`} className={styles.email}>
                            {EMAIL}
                        </a>
                    </div>
                    <div className={styles.phones}>
                        <a
                            href={`tel:${PHONES.spb.number}`}
                            className={styles.phone}
                        >
                            {PHONES.spb.display}
                        </a>
                        <a
                            href={`tel:${PHONES.msk.number}`}
                            className={styles.phone}
                        >
                            {PHONES.msk.display}
                        </a>
                        <button className={styles.callBtn}>
                            Заказать звонок
                        </button>
                    </div>
                </Container>
            </div>

            {/* Green nav bar */}
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
                        className={styles.burger}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Меню"
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
        </header>
    );
}
