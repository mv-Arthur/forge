"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { TopBar } from "@/components/widgets/TopBar";
import { MainNav } from "@/components/widgets/MainNav";
import type { City, CityCode, Phone } from "@/content/contacts";
import type { NavItem } from "@/content/site";
import { useSelection } from "@/lib/selection";
import { useCallbackModal } from "@/lib/callback";
import styles from "./SiteHeader.module.css";

const MobileMenu = dynamic(
    () =>
        import("@/components/widgets/MobileMenu").then((mod) => mod.MobileMenu),
    { ssr: false }
);

const SiteSearch = dynamic(
    () =>
        import("@/components/shared/SiteSearch").then((mod) => mod.SiteSearch),
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
}

const SCROLL_THRESHOLD = 24;

export function SiteHeader({
    cities,
    phones,
    email,
    workHours,
    initialCity,
    navItems,
}: SiteHeaderProps) {
    const { favorites, compare } = useSelection();
    const { openCallback: openCallbackModal } = useCallbackModal();
    const favouritesCount = favorites.length;
    const compareCount = compare.length;
    const [city, setCity] = useState<CityCode>(initialCity ?? cities[0].code);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMobileViewport, setIsMobileViewport] = useState(false);
    const pathname = usePathname();
    const stickyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 1080px)");
        setIsMobileViewport(mql.matches);
        const onChange = (e: MediaQueryListEvent) =>
            setIsMobileViewport(e.matches);
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

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
        const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setSearchOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!mobileOpen) return;
        const prev = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = prev;
        };
    }, [mobileOpen]);

    const toggleBurger = useCallback(() => setMobileOpen((v) => !v), []);
    const closeMobile = useCallback(() => setMobileOpen(false), []);
    const toggleSearch = useCallback(() => setSearchOpen((v) => !v), []);
    const closeSearch = useCallback(() => setSearchOpen(false), []);
    const openCallback = useCallback(() => {
        setMobileOpen(false);
        setSearchOpen(false);
        openCallbackModal();
    }, [openCallbackModal]);

    return (
        <>
            <header>
                <TopBar
                    cities={cities}
                    activeCity={city}
                    onCityChange={setCity}
                    workHours={workHours}
                    email={email}
                />
                <div ref={stickyRef} className={styles.stickyWrapper}>
                    <MainNav
                        navItems={navItems}
                        phones={phones}
                        activeCity={city}
                        favouritesCount={favouritesCount}
                        compareCount={compareCount}
                        mobileMenuOpen={mobileOpen}
                        onBurgerClick={toggleBurger}
                        onSearchClick={toggleSearch}
                        onCallbackClick={openCallback}
                        searchOpen={searchOpen}
                        scrolled={scrolled}
                    />
                    <SiteSearch open={searchOpen} onClose={closeSearch} />
                </div>
            </header>
            {isMobileViewport && (
                <MobileMenu
                    open={mobileOpen}
                    onClose={closeMobile}
                    navItems={navItems}
                    cities={cities}
                    activeCity={city}
                    onCityChange={setCity}
                    phones={phones}
                    email={email}
                    workHours={workHours}
                    favouritesCount={favouritesCount}
                    compareCount={compareCount}
                    onCallbackClick={openCallback}
                />
            )}
        </>
    );
}
