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

const SHOW_TOP_AFTER = 200;
const FAB_BOTTOM = 24;
const FOOTER_GAP = 20;

const fabClass =
    "grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-ink shadow-cta transition hover:scale-105 hover:bg-accent-hover md:h-14 md:w-14";

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
            className="pointer-events-none fixed right-3 z-30 flex flex-col items-end gap-2 md:right-5 md:z-40"
            style={{
                bottom: `calc(${bottom}px + env(safe-area-inset-bottom, 0px))`,
            }}
        >
            {open ? (
                <div className="pointer-events-auto animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-ink-150 bg-white p-4 shadow-lift md:w-72">
                    <div className="mb-3 flex items-start justify-between">
                        <div>
                            <div className="font-semibold text-ink-950">
                                Написать нам
                            </div>
                            <p className="mt-0.5 text-xs text-ink-500">
                                Ответим в рабочие часы,{" "}
                                {settings.officeHoursLabel.toLowerCase()}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-md p-1 text-ink-500 hover:bg-ink-50"
                            aria-label="Закрыть"
                        >
                            <CloseIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="grid gap-2">
                        <a
                            href={settings.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-tg justify-start"
                        >
                            <TelegramIcon className="h-4 w-4" /> Telegram
                        </a>
                        <a
                            href={settings.max}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-max justify-start"
                        >
                            <MaxIcon className="h-4 w-4" /> MAX
                        </a>
                        <a
                            href={`tel:${settings.phoneClean}`}
                            className="btn btn-light justify-start"
                        >
                            <PhoneIcon className="h-4 w-4" /> {settings.phone}
                        </a>
                    </div>
                </div>
            ) : null}
            {showChat ? (
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className={`pointer-events-auto ${fabClass}`}
                    aria-label="Связаться"
                >
                    {open ? (
                        <CloseIcon className="h-5 w-5" />
                    ) : (
                        <MessageIcon className="h-5 w-5" />
                    )}
                </button>
            ) : null}
            <button
                type="button"
                onClick={(e) => {
                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                    e.currentTarget.blur();
                }}
                className={`${fabClass} duration-200 ${
                    showTop
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
                aria-label="Наверх"
                tabIndex={showTop ? 0 : -1}
            >
                <ArrowUpIcon className="h-6 w-6" />
            </button>
        </div>
    );
}
