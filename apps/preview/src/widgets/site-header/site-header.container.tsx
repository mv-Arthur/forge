"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/ui/container";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/ui/icons";
import { settings } from "@/lib/settings";
import { CTA_CALL, NAV_WORKS } from "@/lib/copy";
import { submitLead } from "@/actions/leads/submit-lead";
import { LeadForm } from "@/widgets/lead-form/lead-form";
import type { CatalogNavPayload } from "@/types/catalog";
import { SiteHeaderProjectsMenu } from "./__projects-menu/site-header__projects-menu";
import navStyles from "./__nav/site-header__nav.module.css";

const NAV = [
    { href: "/catalog", label: "Проекты" },
    { href: "/works", label: NAV_WORKS },
    { href: "/about", label: "О нас" },
    { href: "/contacts", label: "Контакты" },
];

function navActive(href: string, pathname: string | null) {
    if (!pathname) return false;
    if (href === "/catalog") {
        return (
            pathname === "/catalog" ||
            pathname.startsWith("/catalog/") ||
            pathname === "/projects" ||
            pathname.startsWith("/projects/")
        );
    }
    return (
        pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
    );
}

export function SiteHeaderContainer({
    catalogNav,
}: {
    catalogNav: CatalogNavPayload;
}) {
    const pathname = usePathname();
    const stickyRef = useRef<HTMLDivElement>(null);
    const closeMegaTimer = useRef<number | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [projectsOpen, setProjectsOpen] = useState(false);
    const [callbackOpen, setCallbackOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [consent, setConsent] = useState(true);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const node = stickyRef.current;
        if (!node) return;
        const update = () => {
            document.documentElement.style.setProperty(
                "--site-header-height",
                `${node.offsetHeight}px`
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
        setProjectsOpen(false);
    }, [pathname]);

    const openProjectsMenu = () => {
        if (closeMegaTimer.current) window.clearTimeout(closeMegaTimer.current);
        setProjectsOpen(true);
    };
    const closeProjectsMenu = () => {
        closeMegaTimer.current = window.setTimeout(() => {
            setProjectsOpen(false);
        }, 140);
    };

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

    useEffect(() => {
        if (!callbackOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setCallbackOpen(false);
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [callbackOpen]);

    async function onCallbackSubmit() {
        if (!phone || !consent) return;
        const result = await submitLead({
            source: "callback",
            name,
            phone,
            consent,
        });
        if (result.success) setSent(true);
    }

    return (
        <header
            ref={stickyRef}
            data-section="site-header"
            className={navStyles.sticky}
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
                            className={navStyles.logoImg}
                            priority
                        />
                    </Link>

                    <nav
                        className={navStyles.nav}
                        aria-label="Основная навигация"
                    >
                        {NAV.map((item) => {
                            const isActive = navActive(item.href, pathname);
                            const isProjects = item.href === "/catalog";
                            return (
                                <div
                                    key={item.href}
                                    className={navStyles.navItem}
                                    onMouseEnter={
                                        isProjects
                                            ? openProjectsMenu
                                            : undefined
                                    }
                                    onMouseLeave={
                                        isProjects
                                            ? closeProjectsMenu
                                            : undefined
                                    }
                                >
                                    <Link
                                        href={item.href}
                                        className={navStyles.navLink}
                                        data-active={
                                            isActive ||
                                            (isProjects && projectsOpen) ||
                                            undefined
                                        }
                                        aria-expanded={
                                            isProjects
                                                ? projectsOpen
                                                : undefined
                                        }
                                        aria-haspopup={
                                            isProjects ? "true" : undefined
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
                            {CTA_CALL}
                        </button>
                    </div>

                    <div className={navStyles.mobileSlot}>
                        <a
                            href={`tel:${settings.phoneClean}`}
                            className={navStyles.iconBtn}
                            aria-label="Позвонить"
                        >
                            <PhoneIcon className={navStyles.icon} />
                        </a>
                        <button
                            type="button"
                            className={navStyles.burgerBtn}
                            aria-label={mobileOpen ? "Закрыть меню" : "Меню"}
                            aria-expanded={mobileOpen}
                            onClick={() => setMobileOpen((v) => !v)}
                        >
                            {mobileOpen ? (
                                <CloseIcon className={navStyles.icon} />
                            ) : (
                                <MenuIcon className={navStyles.icon} />
                            )}
                        </button>
                    </div>
                </Container>
            </div>

            <div
                className={`${navStyles.mega} ${projectsOpen ? navStyles.megaOpen : ""}`}
                onMouseEnter={openProjectsMenu}
                onMouseLeave={closeProjectsMenu}
                aria-hidden={!projectsOpen}
                inert={!projectsOpen ? true : undefined}
            >
                <Container>
                    <SiteHeaderProjectsMenu
                        nav={catalogNav}
                        open={projectsOpen}
                    />
                </Container>
            </div>

            {mounted && mobileOpen
                ? createPortal(
                      <div
                          className={navStyles.overlay}
                          data-mobile-menu
                      >
                          <button
                              type="button"
                              data-mobile-menu-backdrop
                              className={navStyles.backdrop}
                              aria-label="Закрыть меню"
                              onClick={() => setMobileOpen(false)}
                          />
                          <div
                              data-mobile-menu-sheet
                              className={navStyles.sheet}
                          >
                              <div className={navStyles.sheetHead}>
                                  <span className={navStyles.sheetTitle}>
                                      Меню
                                  </span>
                                  <button
                                      type="button"
                                      className={navStyles.burgerBtn}
                                      aria-label="Закрыть панель"
                                      onClick={() => setMobileOpen(false)}
                                  >
                                      <CloseIcon className={navStyles.icon} />
                                  </button>
                              </div>
                              <nav className={navStyles.sheetNav}>
                                  {NAV.map((item) => (
                                      <div key={item.href}>
                                          <Link
                                              href={item.href}
                                              className={navStyles.sheetLink}
                                              onClick={() =>
                                                  setMobileOpen(false)
                                              }
                                          >
                                              {item.label}
                                          </Link>
                                          {item.href === "/catalog" ? (
                                              <div className={navStyles.sheetSub}>
                                                  {[
                                                      catalogNav.all,
                                                      ...catalogNav.types,
                                                      ...catalogNav.tiles,
                                                  ].map((card) => (
                                                      <Link
                                                          key={card.id}
                                                          href={card.href}
                                                          className={
                                                              navStyles.sheetSubLink
                                                          }
                                                          onClick={() =>
                                                              setMobileOpen(
                                                                  false,
                                                              )
                                                          }
                                                      >
                                                          {card.title}
                                                      </Link>
                                                  ))}
                                              </div>
                                          ) : null}
                                      </div>
                                  ))}
                                  <a
                                      href={`tel:${settings.phoneClean}`}
                                      className={navStyles.sheetLink}
                                  >
                                      {settings.phone}
                                  </a>
                                  <button
                                      type="button"
                                      className={`btn btn-primary btn-lg ${navStyles.sheetCta}`}
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
                      document.body
                  )
                : null}

            {callbackOpen && mounted
                ? createPortal(
                      <div
                          className={navStyles.dialog}
                          role="dialog"
                          aria-modal="true"
                          aria-labelledby="callback-title"
                      >
                          <button
                              type="button"
                              className={navStyles.backdrop}
                              aria-label="Закрыть"
                              onClick={() => setCallbackOpen(false)}
                          />
                          <div className={navStyles.dialogStage}>
                              <div className={navStyles.dialogCard}>
                                  <div className={navStyles.dialogHead}>
                                      <div>
                                          <h2
                                              id="callback-title"
                                              className={navStyles.dialogTitle}
                                          >
                                              Заказать звонок
                                          </h2>
                                          <p className={navStyles.dialogLead}>
                                              Оставьте телефон — перезвоним в
                                              рабочие часы.
                                          </p>
                                      </div>
                                      <button
                                          type="button"
                                          onClick={() => setCallbackOpen(false)}
                                          className={navStyles.dialogClose}
                                          aria-label="Закрыть"
                                      >
                                          ×
                                      </button>
                                  </div>
                                  <LeadForm
                                      source="callback"
                                      ctaLabel="Перезвоните мне"
                                      variant="light"
                                      values={{ name, phone, consent }}
                                      sent={sent}
                                      onNameChange={setName}
                                      onPhoneChange={setPhone}
                                      onConsentChange={setConsent}
                                      onSubmit={onCallbackSubmit}
                                  />
                              </div>
                          </div>
                      </div>,
                      document.body
                  )
                : null}
        </header>
    );
}
