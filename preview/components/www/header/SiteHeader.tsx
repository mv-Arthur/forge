"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/www/ui/Container";
import { CallbackModal } from "@/components/CallbackModal";
import { settings } from "@/lib/settings";
import topStyles from "./TopBar.module.css";
import navStyles from "./MainNav.module.css";

const NAV = [
    { href: "/projects", label: "Проекты" },
    { href: "/works", label: "Наши работы" },
];

export function SiteHeader() {
    const pathname = usePathname();
    const stickyRef = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [callbackOpen, setCallbackOpen] = useState(false);

    useEffect(() => {
        const node = stickyRef.current;
        if (!node) return;
        const update = () => {
            document.documentElement.style.setProperty(
                "--site-header-height",
                `${node.offsetHeight}px`,
            );
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(node);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <header
            ref={stickyRef}
            className="sticky top-0 z-50 bg-[var(--color-bg)]"
        >
            <div className={topStyles.bar}>
                <Container className={topStyles.inner}>
                    <div className={topStyles.left}>
                        <span className={topStyles.cityLabel}>Ваш город:</span>
                        <span className={topStyles.item}>
                            {settings.cityLabel}
                        </span>
                    </div>
                    <div className={topStyles.right}>
                        <span className={topStyles.item}>
                            {settings.officeHoursLabel}
                        </span>
                        <span className={topStyles.dot} aria-hidden />
                        <a
                            href="mailto:info@ncottage.ru"
                            className={topStyles.item}
                        >
                            info@ncottage.ru
                        </a>
                    </div>
                </Container>
            </div>

            <div>
                <div
                    className={`${navStyles.bar} ${scrolled ? navStyles.barScrolled : ""}`}
                >
                    <Container className={navStyles.inner}>
                        <Link
                            href="/"
                            className={navStyles.logo}
                            aria-label="Главная"
                        >
                            <Image
                                src="/images/logo.png"
                                alt="Новый Коттедж"
                                width={772}
                                height={317}
                                priority
                            />
                        </Link>

                        <nav
                            className={navStyles.nav}
                            aria-label="Основная навигация"
                        >
                            {NAV.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/" &&
                                        pathname?.startsWith(`${item.href}/`));
                                return (
                                    <div
                                        key={item.href}
                                        className={navStyles.navItem}
                                    >
                                        <Link
                                            href={item.href}
                                            className={navStyles.navLink}
                                            data-active={
                                                isActive || undefined
                                            }
                                        >
                                            {item.label}
                                        </Link>
                                    </div>
                                );
                            })}
                        </nav>

                        <div className={navStyles.actions}>
                            <a
                                href={`tel:${settings.phoneClean}`}
                                className={navStyles.phone}
                            >
                                {settings.phone}
                            </a>
                            <button
                                type="button"
                                className={navStyles.cta}
                                onClick={() => setCallbackOpen(true)}
                            >
                                Заказать звонок
                            </button>
                        </div>

                        <div className={navStyles.mobileSlot}>
                            <a
                                href={`tel:${settings.phoneClean}`}
                                className={navStyles.iconBtn}
                                aria-label="Позвонить"
                            >
                                ☎
                            </a>
                            <button
                                type="button"
                                className={navStyles.burgerBtn}
                                aria-label={
                                    mobileOpen ? "Закрыть меню" : "Меню"
                                }
                                aria-expanded={mobileOpen}
                                onClick={() => setMobileOpen((v) => !v)}
                            >
                                <span
                                    style={{
                                        display: "block",
                                        width: 18,
                                        height: 2,
                                        background: "currentColor",
                                        boxShadow:
                                            "0 6px 0 currentColor, 0 -6px 0 currentColor",
                                    }}
                                />
                            </button>
                        </div>
                    </Container>
                </div>

                {mobileOpen ? (
                    <div
                        style={{
                            borderBottom: "1px solid var(--color-line)",
                            background: "var(--color-bg)",
                            padding: "12px 24px 20px",
                        }}
                    >
                        <nav
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                            }}
                        >
                            {NAV.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={{
                                        padding: "12px 0",
                                        fontWeight: 500,
                                        borderBottom:
                                            "1px solid var(--color-line)",
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                type="button"
                                className={navStyles.cta}
                                style={{
                                    marginTop: 16,
                                    justifyContent: "center",
                                    width: "100%",
                                }}
                                onClick={() => {
                                    setMobileOpen(false);
                                    setCallbackOpen(true);
                                }}
                            >
                                Заказать звонок
                            </button>
                        </nav>
                    </div>
                ) : null}
            </div>

            <CallbackModal
                open={callbackOpen}
                onClose={() => setCallbackOpen(false)}
            />
        </header>
    );
}
