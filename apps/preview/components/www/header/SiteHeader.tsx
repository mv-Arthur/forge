"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/www/ui/Container";
import { CallbackModal } from "@/components/CallbackModal";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/Icons";
import { settings } from "@/lib/settings";
import { CTA_CALL, NAV_WORKS } from "@/lib/copy";
import navStyles from "./MainNav.module.css";

const NAV = [
    { href: "/projects", label: "Проекты" },
    { href: "/works", label: NAV_WORKS },
    { href: "/about", label: "О нас" },
    { href: "/contacts", label: "Контакты" },
];

export function SiteHeader() {
    const pathname = usePathname();
    const stickyRef = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [callbackOpen, setCallbackOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    useEffect(() => {
        if (!mobileOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [mobileOpen]);

    return (
        <header
            ref={stickyRef}
            data-section="site-header"
            className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90"
        >
            <div
                className={`${navStyles.bar} ${scrolled ? navStyles.barScrolled : ""}`}
            >
                <Container className={navStyles.inner}>
                    <Link
                        href="/"
                        className={navStyles.logo}
                        aria-label="Главная — Новый Коттедж"
                    >
                        <Image
                            src="/images/logo-header.png"
                            alt="Новый Коттедж"
                            width={220}
                            height={48}
                            className="h-10 w-auto md:h-11"
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
                                        data-active={isActive || undefined}
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
                            {CTA_CALL}
                        </button>
                    </div>

                    <div className={navStyles.mobileSlot}>
                        <a
                            href={`tel:${settings.phoneClean}`}
                            className={navStyles.iconBtn}
                            aria-label="Позвонить"
                        >
                            <PhoneIcon className="h-5 w-5" />
                        </a>
                        <button
                            type="button"
                            className={navStyles.burgerBtn}
                            aria-label={mobileOpen ? "Закрыть меню" : "Меню"}
                            aria-expanded={mobileOpen}
                            onClick={() => setMobileOpen((v) => !v)}
                        >
                            {mobileOpen ? (
                                <CloseIcon className="h-5 w-5" />
                            ) : (
                                <MenuIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </Container>
            </div>

            {mounted && mobileOpen
                ? createPortal(
                      <div
                          className="fixed inset-0 z-[80] md:hidden"
                          data-mobile-menu
                      >
                          <button
                              type="button"
                              data-mobile-menu-backdrop
                              className="absolute inset-0 bg-ink-950/55 backdrop-blur-[2px]"
                              aria-label="Закрыть меню"
                              onClick={() => setMobileOpen(false)}
                          />
                          <div
                              data-mobile-menu-sheet
                              className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] max-w-[86vw] flex-col bg-white shadow-lift"
                          >
                              <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink-150 px-4">
                                  <span className="font-display text-lg font-semibold text-ink-950">
                                      Меню
                                  </span>
                                  <button
                                      type="button"
                                      className={navStyles.burgerBtn}
                                      aria-label="Закрыть панель"
                                      onClick={() => setMobileOpen(false)}
                                  >
                                      <CloseIcon className="h-5 w-5" />
                                  </button>
                              </div>
                              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
                                  {NAV.map((item) => (
                                      <Link
                                          key={item.href}
                                          href={item.href}
                                          className="rounded-xl px-3 py-3.5 text-base font-semibold text-ink-950 hover:bg-ink-50"
                                          onClick={() => setMobileOpen(false)}
                                      >
                                          {item.label}
                                      </Link>
                                  ))}
                                  <a
                                      href={`tel:${settings.phoneClean}`}
                                      className="rounded-xl px-3 py-3.5 text-base font-semibold text-ink-950 hover:bg-ink-50"
                                  >
                                      {settings.phone}
                                  </a>
                                  <button
                                      type="button"
                                      className="btn btn-primary btn-lg mt-4 w-full justify-center"
                                      onClick={() => {
                                          setMobileOpen(false);
                                          setCallbackOpen(true);
                                      }}
                                  >
                                      {CTA_CALL}
                                  </button>
                              </nav>
                          </div>
                      </div>,
                      document.body,
                  )
                : null}

            <CallbackModal
                open={callbackOpen}
                onClose={() => setCallbackOpen(false)}
            />
        </header>
    );
}
