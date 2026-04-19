"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import type { NavItem } from "@/lib/constants";
import {
    ChevronDownIcon,
    CompareIcon,
    FavouriteIcon,
    SaleIcon,
    SearchIcon,
} from "./icons";
import styles from "./Navbar.module.css";

interface NavbarProps {
    navItems: NavItem[];
    mobileOpen: boolean;
    onMobileClose: () => void;
    onSearchClick?: () => void;
    favouritesCount?: number;
    compareCount?: number;
}

const CLOSE_DELAY_MS = 120;

export function Navbar({
    navItems,
    mobileOpen,
    onMobileClose,
    onSearchClick,
    favouritesCount = 0,
    compareCount = 0,
}: NavbarProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [openMobileSections, setOpenMobileSections] = useState<Set<string>>(
        new Set()
    );
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        setOpenDropdown(null);
        setOpenMobileSections(new Set());
    }, [pathname]);

    const toggleMobileSection = useCallback((key: string) => {
        setOpenMobileSections((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }, []);

    const openMenu = useCallback((href: string | null) => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        setOpenDropdown(href);
    }, []);

    const scheduleClose = useCallback(() => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        closeTimerRef.current = setTimeout(() => {
            setOpenDropdown(null);
        }, CLOSE_DELAY_MS);
    }, []);

    const activeItem = openDropdown
        ? navItems.find((i) => i.href === openDropdown)
        : null;
    const hasActiveMega = Boolean(activeItem?.megaMenu);

    const [lastMegaItem, setLastMegaItem] = useState<NavItem | null>(null);
    useEffect(() => {
        if (activeItem?.megaMenu) {
            setLastMegaItem(activeItem);
        }
    }, [activeItem]);
    const megaToRender = hasActiveMega ? activeItem : lastMegaItem;

    return (
        <>
            <div className={styles.navBar}>
                <Container className={styles.navBarInner}>
                    <nav className={styles.nav}>
                        {navItems.map((item) => {
                            const hasDropdown = Boolean(
                                item.children || item.megaMenu
                            );
                            const isOpen = openDropdown === item.href;
                            return (
                                <div
                                    key={item.href}
                                    className={styles.navItem}
                                    onMouseEnter={() =>
                                        openMenu(
                                            hasDropdown ? item.href : null
                                        )
                                    }
                                    onMouseLeave={scheduleClose}
                                >
                                    <Link
                                        href={item.href}
                                        className={styles.navLink}
                                    >
                                        {item.badge === "sale" && (
                                            <SaleIcon
                                                className={styles.navBadge}
                                            />
                                        )}
                                        {item.label}
                                        {hasDropdown && (
                                            <ChevronDownIcon
                                                className={`${styles.navChevron} ${isOpen ? styles.navChevronOpen : ""}`}
                                            />
                                        )}
                                    </Link>

                                    {item.children && (
                                        <div
                                            className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ""}`}
                                        >
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
                            );
                        })}
                    </nav>

                    <div
                        className={styles.actions}
                        onMouseEnter={() => openMenu(null)}
                    >
                        <button
                            type="button"
                            className={styles.actionBtn}
                            aria-label="Поиск"
                            onClick={onSearchClick}
                        >
                            <SearchIcon />
                        </button>
                        <Link
                            href="/favourites"
                            className={styles.actionBtn}
                            aria-label="Избранное"
                        >
                            <FavouriteIcon />
                            <span className={styles.actionCounter}>
                                {favouritesCount}
                            </span>
                        </Link>
                        <Link
                            href="/compare"
                            className={styles.actionBtn}
                            aria-label="Сравнение"
                        >
                            <CompareIcon />
                            <span className={styles.actionCounter}>
                                {compareCount}
                            </span>
                        </Link>
                    </div>
                </Container>

                <div
                    className={`${styles.megaMenu} ${hasActiveMega ? styles.megaMenuOpen : ""}`}
                    onMouseEnter={() =>
                        activeItem && openMenu(activeItem.href)
                    }
                    onMouseLeave={scheduleClose}
                >
                    <Container className={styles.megaMenuInner}>
                        {megaToRender?.megaMenu?.map((column) => (
                                <div
                                    key={column.title}
                                    className={styles.megaColumn}
                                >
                                    <span className={styles.megaTitle}>
                                        {column.title}
                                    </span>
                                    <ul className={styles.megaList}>
                                        {column.items.map((sub) => (
                                            <li key={sub.href}>
                                                <Link
                                                    href={sub.href}
                                                    className={styles.megaLink}
                                                >
                                                    {sub.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                    </Container>
                </div>
            </div>

            <div
                className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ""}`}
                aria-hidden={!mobileOpen}
            >
                <Container>
                    {navItems.map((item) => {
                        const hasContent = Boolean(
                            item.children || item.megaMenu
                        );
                        const sectionKey = `nav:${item.href}`;
                        const sectionOpen =
                            openMobileSections.has(sectionKey);

                        if (!hasContent) {
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={styles.mobileLink}
                                    onClick={onMobileClose}
                                >
                                    {item.badge === "sale" && (
                                        <SaleIcon
                                            className={styles.navBadge}
                                        />
                                    )}
                                    {item.label}
                                </Link>
                            );
                        }

                        return (
                            <div
                                key={item.href}
                                className={styles.mobileSection}
                            >
                                <button
                                    type="button"
                                    className={`${styles.mobileToggle} ${sectionOpen ? styles.mobileToggleOpen : ""}`}
                                    aria-expanded={sectionOpen}
                                    onClick={() =>
                                        toggleMobileSection(sectionKey)
                                    }
                                >
                                    {item.badge === "sale" && (
                                        <SaleIcon
                                            className={styles.navBadge}
                                        />
                                    )}
                                    <span
                                        className={styles.mobileToggleLabel}
                                    >
                                        {item.label}
                                    </span>
                                    <ChevronDownIcon
                                        className={styles.mobileChevron}
                                    />
                                </button>

                                <div
                                    className={`${styles.mobileSubpanel} ${sectionOpen ? styles.mobileSubpanelOpen : ""}`}
                                >
                                    <div className={styles.mobileSubpanelInner}>
                                        {item.children?.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className={styles.mobileSubLink}
                                                onClick={onMobileClose}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                        {item.megaMenu?.map((column) => {
                                            const colKey = `col:${item.href}:${column.title}`;
                                            const colOpen =
                                                openMobileSections.has(colKey);
                                            return (
                                                <div
                                                    key={column.title}
                                                    className={
                                                        styles.mobileMegaGroup
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        className={`${styles.mobileToggle} ${styles.mobileToggleSub} ${colOpen ? styles.mobileToggleOpen : ""}`}
                                                        aria-expanded={colOpen}
                                                        onClick={() =>
                                                            toggleMobileSection(
                                                                colKey
                                                            )
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                styles.mobileMegaTitle
                                                            }
                                                        >
                                                            {column.title}
                                                        </span>
                                                        <ChevronDownIcon
                                                            className={
                                                                styles.mobileChevron
                                                            }
                                                        />
                                                    </button>
                                                    <div
                                                        className={`${styles.mobileSubpanel} ${colOpen ? styles.mobileSubpanelOpen : ""}`}
                                                    >
                                                        <div
                                                            className={
                                                                styles.mobileSubpanelInner
                                                            }
                                                        >
                                                            {column.items.map(
                                                                (sub) => (
                                                                    <Link
                                                                        key={
                                                                            sub.href
                                                                        }
                                                                        href={
                                                                            sub.href
                                                                        }
                                                                        className={
                                                                            styles.mobileSubLink
                                                                        }
                                                                        onClick={
                                                                            onMobileClose
                                                                        }
                                                                    >
                                                                        {
                                                                            sub.label
                                                                        }
                                                                    </Link>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div className={styles.mobileActions}>
                        <Link
                            href="/favourites"
                            className={styles.mobileActionItem}
                            onClick={onMobileClose}
                        >
                            <FavouriteIcon />
                            <span>Избранное ({favouritesCount})</span>
                        </Link>
                        <Link
                            href="/compare"
                            className={styles.mobileActionItem}
                            onClick={onMobileClose}
                        >
                            <CompareIcon />
                            <span>Сравнение ({compareCount})</span>
                        </Link>
                    </div>
                </Container>
            </div>
        </>
    );
}
