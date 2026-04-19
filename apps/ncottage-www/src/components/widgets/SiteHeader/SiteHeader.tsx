"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/widgets/Header";
import { CitySelector } from "@/components/shared/CitySelector";
import type {
    City,
    CityCode,
    NavItem,
    Phone,
} from "@/lib/constants";
import styles from "./SiteHeader.module.css";

const Navbar = dynamic(
    () => import("@/components/widgets/Navbar").then((mod) => mod.Navbar),
    { ssr: true }
);

const SearchModal = dynamic(
    () =>
        import("@/components/shared/SearchModal").then(
            (mod) => mod.SearchModal
        ),
    { ssr: false }
);

interface SiteHeaderProps {
    cities: City[];
    phones: Record<CityCode, Phone>;
    addresses: Record<CityCode, string>;
    email: string;
    workHours: string;
    initialCity?: CityCode;
    navItems: NavItem[];
    favouritesCount?: number;
    compareCount?: number;
}

export function SiteHeader({
    cities,
    phones,
    addresses,
    email,
    workHours,
    initialCity,
    navItems,
    favouritesCount = 0,
    compareCount = 0,
}: SiteHeaderProps) {
    const [city, setCity] = useState<CityCode>(
        initialCity ?? cities[0].code
    );
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const pathname = usePathname();
    const stickyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const node = stickyRef.current;
        if (!node) return;

        const updateHeight = () => {
            document.documentElement.style.setProperty(
                "--site-header-height",
                `${node.offsetHeight}px`
            );
        };

        updateHeight();
        const observer = new ResizeObserver(updateHeight);
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setSearchOpen(false);
    }, [pathname]);

    useEffect(() => {
        const shouldLock = mobileOpen || searchOpen;
        if (shouldLock) {
            const prevOverflow = document.documentElement.style.overflow;
            document.documentElement.style.overflow = "hidden";
            return () => {
                document.documentElement.style.overflow = prevOverflow;
            };
        }
    }, [mobileOpen, searchOpen]);

    const toggleBurger = useCallback(() => setMobileOpen((v) => !v), []);
    const closeMobile = useCallback(() => setMobileOpen(false), []);
    const openSearch = useCallback(() => setSearchOpen(true), []);
    const closeSearch = useCallback(() => setSearchOpen(false), []);

    return (
        <>
            <div ref={stickyRef} className={styles.stickyWrapper}>
                <Header
                    cities={cities}
                    phones={phones}
                    addresses={addresses}
                    email={email}
                    workHours={workHours}
                    activeCity={city}
                    onCityChange={setCity}
                    mobileMenuOpen={mobileOpen}
                    onBurgerClick={toggleBurger}
                />
                <Navbar
                    navItems={navItems}
                    mobileOpen={mobileOpen}
                    onMobileClose={closeMobile}
                    onSearchClick={openSearch}
                    favouritesCount={favouritesCount}
                    compareCount={compareCount}
                />
                <div className={styles.mobileCityStrip}>
                    <Container className={styles.mobileCityInner}>
                        <span className={styles.mobileCityLabel}>
                            Ваш город:
                        </span>
                        <CitySelector
                            cities={cities}
                            activeCity={city}
                            onCityChange={setCity}
                        />
                    </Container>
                </div>
            </div>
            <SearchModal open={searchOpen} onClose={closeSearch} />
        </>
    );
}
