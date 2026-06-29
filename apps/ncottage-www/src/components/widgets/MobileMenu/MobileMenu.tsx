"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CitySelector } from "@/components/shared/CitySelector";
import type { City, CityCode, Phone } from "@/content/contacts";
import type { NavItem } from "@/content/site";
import { ChevronDownIcon, CloseIcon } from "@/components/ui/icons";
import { CompareIcon, FavouriteIcon } from "@/components/widgets/MainNav/icons";
import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
    navItems: NavItem[];
    cities: City[];
    activeCity: CityCode;
    onCityChange: (code: CityCode) => void;
    phones: Record<CityCode, Phone>;
    email: string;
    workHours: string;
    favouritesCount?: number;
    compareCount?: number;
    onCallbackClick?: () => void;
}

export function MobileMenu({
    open,
    onClose,
    navItems,
    cities,
    activeCity,
    onCityChange,
    phones,
    email,
    workHours,
    favouritesCount = 0,
    compareCount = 0,
    onCallbackClick,
}: MobileMenuProps) {
    const [openSections, setOpenSections] = useState<Set<string>>(new Set());
    const pathname = usePathname();
    const phone = phones[activeCity] ?? Object.values(phones)[0];

    useEffect(() => {
        if (!open) setOpenSections(new Set());
    }, [open]);

    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    // Закрытие по Escape (паттерн диалога).
    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    const toggle = useCallback((key: string) => {
        setOpenSections((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }, []);

    const handleCallbackClick = useCallback(() => {
        onClose();
        onCallbackClick?.();
    }, [onCallbackClick, onClose]);

    return (
        <div
            className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
            aria-hidden={!open}
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
        >
            <div className={styles.header}>
                <Link
                    href="/"
                    className={styles.logo}
                    onClick={onClose}
                    aria-label="Главная"
                >
                    <Image
                        src="/images/logo.png"
                        alt="Новый Коттедж"
                        width={140}
                        height={32}
                    />
                </Link>
                <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label="Закрыть меню"
                >
                    <CloseIcon />
                </button>
            </div>

            <div className={styles.body}>
                <div className={styles.cityRow}>
                    <span>Ваш город:</span>
                    <CitySelector
                        cities={cities}
                        activeCity={activeCity}
                        onCityChange={onCityChange}
                    />
                </div>

                {navItems.map((item) => {
                    const hasChildren = Boolean(item.children?.length);
                    const sectionKey = `nav:${item.href}`;
                    const sectionOpen = openSections.has(sectionKey);

                    if (!hasChildren) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={styles.link}
                                onClick={onClose}
                            >
                                {item.label}
                            </Link>
                        );
                    }

                    return (
                        <div key={item.href} className={styles.section}>
                            <button
                                type="button"
                                className={`${styles.sectionToggle} ${sectionOpen ? styles.sectionToggleOpen : ""}`}
                                aria-expanded={sectionOpen}
                                onClick={() => toggle(sectionKey)}
                            >
                                <span>{item.label}</span>
                                <ChevronDownIcon className={styles.chevron} />
                            </button>
                            <div
                                className={`${styles.subpanel} ${sectionOpen ? styles.subpanelOpen : ""}`}
                            >
                                <div className={styles.subpanelInner}>
                                    {item.children!.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            className={styles.subLink}
                                            onClick={onClose}
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className={styles.actions}>
                    <Link
                        href="/favourites"
                        className={styles.actionItem}
                        onClick={onClose}
                    >
                        <FavouriteIcon />
                        <span>Избранное ({favouritesCount})</span>
                    </Link>
                    <Link
                        href="/compare"
                        className={styles.actionItem}
                        onClick={onClose}
                    >
                        <CompareIcon />
                        <span>Сравнение ({compareCount})</span>
                    </Link>
                    <a href={`tel:${phone.number}`} className={styles.cta}>
                        {phone.display}
                    </a>
                    <button
                        type="button"
                        className={styles.cta}
                        onClick={handleCallbackClick}
                    >
                        Заказать звонок
                    </button>
                    <div className={styles.contacts}>
                        <span>{workHours}</span>
                        <a href={`mailto:${email}`}>{email}</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
