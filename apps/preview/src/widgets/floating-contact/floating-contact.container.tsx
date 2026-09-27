"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { settings } from "@/lib/settings";
import {
    ArrowUpIcon,
    CloseIcon,
    MessageIcon,
    PhoneIcon,
    MaxIcon,
    TelegramIcon,
} from "@/ui/icons";
import styles from "./floating-contact.module.css";

const SHOW_TOP_AFTER = 200;
const FAB_BOTTOM = 24;
const FOOTER_GAP = 20;

export function FloatingContactContainer() {
    const [open, setOpen] = useState(false);
    const [showTop, setShowTop] = useState(false);
    const [bottom, setBottom] = useState(FAB_BOTTOM);
    const pathname = usePathname();
    const showChat = pathname !== "/";

    useEffect(() => {
        const footer = document.querySelector("[data-section='site-footer']");
        const update = () => {
            setShowTop(window.scrollY > SHOW_TOP_AFTER);
            if (!footer) {
                setBottom(FAB_BOTTOM);
                return;
            }
            const footerTop = footer.getBoundingClientRect().top;
            if (footerTop >= window.innerHeight) {
                setBottom(FAB_BOTTOM);
                return;
            }
            const lift = window.innerHeight - footerTop + FOOTER_GAP;
            setBottom(lift > FAB_BOTTOM ? lift : FAB_BOTTOM);
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update, { passive: true });
        const ro = new ResizeObserver(update);
        ro.observe(document.documentElement);
        if (footer) ro.observe(footer);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
            ro.disconnect();
        };
    }, []);

    if (!showChat && !showTop) return null;

    return (
        <div
            className={styles.stack}
            style={{
                bottom: `calc(${bottom}px + env(safe-area-inset-bottom, 0px))`,
            }}
        >
            {open ? (
                <div className={styles.panel}>
                    <div className={styles.panelHead}>
                        <div>
                            <div className={styles.panelTitle}>Написать нам</div>
                            <p className={styles.panelLead}>
                                Ответим в рабочие часы,{" "}
                                {settings.officeHoursLabel.toLowerCase()}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className={styles.close}
                            aria-label="Закрыть"
                        >
                            <CloseIcon className={styles.icon} />
                        </button>
                    </div>
                    <div className={styles.actions}>
                        <a
                            href={settings.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-tg"
                        >
                            <TelegramIcon className={styles.icon} /> Telegram
                        </a>
                        <a
                            href={settings.max}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-max"
                        >
                            <MaxIcon className={styles.icon} /> MAX
                        </a>
                        <a
                            href={`tel:${settings.phoneClean}`}
                            className="btn btn-light"
                        >
                            <PhoneIcon className={styles.icon} /> {settings.phone}
                        </a>
                    </div>
                </div>
            ) : null}
            {showChat ? (
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className={styles.fab}
                    aria-label="Связаться"
                >
                    {open ? (
                        <CloseIcon className={styles.iconMd} />
                    ) : (
                        <MessageIcon className={styles.iconMd} />
                    )}
                </button>
            ) : null}
            <button
                type="button"
                onClick={(e) => {
                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                    e.currentTarget.blur();
                }}
                className={`${styles.fab} ${showTop ? "" : styles.fabHidden}`}
                aria-label="Наверх"
                tabIndex={showTop ? 0 : -1}
            >
                <ArrowUpIcon className={styles.iconLg} />
            </button>
        </div>
    );
}
