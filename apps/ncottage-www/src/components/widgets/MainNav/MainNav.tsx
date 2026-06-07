"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import type { CityCode, Phone } from "@/content/contacts";
import type { NavItem } from "@/content/site";
import { ChevronDownIcon, SearchIcon } from "@/components/ui/icons";
import { BurgerIcon, CompareIcon, FavouriteIcon, PhoneIcon } from "./icons";
import styles from "./MainNav.module.css";

interface MainNavProps {
    navItems: NavItem[];
    phones: Record<CityCode, Phone>;
    activeCity: CityCode;
    favouritesCount?: number;
    compareCount?: number;
    mobileMenuOpen?: boolean;
    onBurgerClick?: () => void;
    onSearchClick?: () => void;
    onCallbackClick?: () => void;
    searchOpen?: boolean;
    scrolled?: boolean;
}

const CLOSE_DELAY_MS = 120;

export function MainNav({
    navItems,
    phones,
    activeCity,
    favouritesCount = 0,
    compareCount = 0,
    mobileMenuOpen,
    onBurgerClick,
    onSearchClick,
    onCallbackClick,
    searchOpen,
    scrolled,
}: MainNavProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pathname = usePathname();
    const phone = phones[activeCity];

    useEffect(() => {
        setOpenDropdown(null);
    }, [pathname]);

    const openMenu = useCallback((href: string | null) => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        setOpenDropdown(href);
    }, []);

    const scheduleClose = useCallback(() => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        closeTimerRef.current = setTimeout(
            () => setOpenDropdown(null),
            CLOSE_DELAY_MS
        );
    }, []);

    return (
        <div className={`${styles.bar} ${scrolled ? styles.barScrolled : ""}`}>
            <Container className={styles.inner}>
                <Link href="/" className={styles.logo} aria-label="Главная">
                    <Image
                        src="/images/logo.png"
                        alt="Новый Коттедж"
                        width={160}
                        height={36}
                        priority
                    />
                </Link>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const hasDropdown = Boolean(item.children?.length);
                        const isOpen = openDropdown === item.href;
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/" &&
                                pathname?.startsWith(`${item.href}/`));
                        return (
                            <div
                                key={item.href}
                                className={styles.navItem}
                                onMouseEnter={() =>
                                    openMenu(hasDropdown ? item.href : null)
                                }
                                onMouseLeave={scheduleClose}
                            >
                                <Link
                                    href={item.href}
                                    className={styles.navLink}
                                    data-active={isActive || undefined}
                                >
                                    {item.label}
                                    {hasDropdown && (
                                        <ChevronDownIcon
                                            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                                        />
                                    )}
                                </Link>
                                {hasDropdown && (
                                    <div
                                        className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ""}`}
                                    >
                                        <ul className={styles.dropdownList}>
                                            {item.children!.map((child) => (
                                                <li key={child.href}>
                                                    <Link
                                                        href={child.href}
                                                        className={
                                                            styles.dropdownLink
                                                        }
                                                    >
                                                        {child.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.iconBtn}
                        aria-label="Поиск"
                        aria-expanded={searchOpen}
                        data-search-trigger
                        data-active={searchOpen || undefined}
                        onClick={onSearchClick}
                    >
                        <SearchIcon />
                    </button>
                    <Link
                        href="/favourites"
                        className={styles.iconBtn}
                        aria-label="Избранное"
                    >
                        <FavouriteIcon />
                        {favouritesCount > 0 && (
                            <span className={styles.counter}>
                                {favouritesCount}
                            </span>
                        )}
                    </Link>
                    <Link
                        href="/compare"
                        className={styles.iconBtn}
                        aria-label="Сравнение"
                    >
                        <CompareIcon />
                        {compareCount > 0 && (
                            <span className={styles.counter}>
                                {compareCount}
                            </span>
                        )}
                    </Link>
                    <span className={styles.divider} aria-hidden="true" />
                    <a href={`tel:${phone.number}`} className={styles.phone}>
                        <PhoneIcon className={styles.phoneIcon} />
                        {phone.display}
                    </a>
                    <button
                        type="button"
                        className={styles.cta}
                        onClick={onCallbackClick}
                    >
                        Заказать звонок
                    </button>
                </div>

                <div className={styles.mobileSlot}>
                    <button
                        type="button"
                        className={styles.iconBtn}
                        aria-label="Поиск"
                        aria-expanded={searchOpen}
                        data-search-trigger
                        data-active={searchOpen || undefined}
                        onClick={onSearchClick}
                    >
                        <SearchIcon />
                    </button>
                    <a
                        href={`tel:${phone.number}`}
                        className={styles.iconBtn}
                        aria-label="Позвонить"
                    >
                        <PhoneIcon />
                    </a>
                    <button
                        type="button"
                        className={styles.burgerBtn}
                        aria-label={mobileMenuOpen ? "Закрыть меню" : "Меню"}
                        aria-expanded={mobileMenuOpen}
                        onClick={onBurgerClick}
                    >
                        <BurgerIcon
                            className={styles.burgerIcon}
                            open={mobileMenuOpen}
                        />
                    </button>
                </div>
            </Container>
        </div>
    );
}
