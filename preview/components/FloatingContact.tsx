"use client";

import { useState } from "react";
import { settings } from "@/lib/settings";
import {
    CloseIcon,
    PhoneIcon,
    TelegramIcon,
    WhatsappIcon,
} from "./Icons";

export function FloatingContact() {
    const [open, setOpen] = useState(false);
    return (
        <div className="fixed bottom-28 right-3 z-30 flex flex-col items-end gap-2 max-md:mb-[env(safe-area-inset-bottom)] md:bottom-4 md:right-4 md:z-40">
            {open ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-ink-150 bg-white p-4 shadow-lift md:w-72">
                    <div className="mb-3 flex items-start justify-between">
                        <div>
                            <div className="font-semibold text-ink-950">
                                Свяжемся быстрее
                            </div>
                            <p className="mt-0.5 text-xs text-ink-500">
                                Ответим за 15 минут, {settings.officeHoursLabel.toLowerCase()}
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
                            href={settings.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-wa justify-start"
                        >
                            <WhatsappIcon className="h-4 w-4" /> WhatsApp
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
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-ink shadow-cta transition hover:scale-105 hover:bg-accent-hover"
                aria-label="Связаться"
            >
                {open ? (
                    <CloseIcon className="h-5 w-5" />
                ) : (
                    <TelegramIcon className="h-5 w-5" />
                )}
            </button>
        </div>
    );
}
