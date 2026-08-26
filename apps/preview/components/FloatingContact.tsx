"use client";

import { useState } from "react";
import { settings } from "@/lib/settings";
import {
    CloseIcon,
    MessageIcon,
    PhoneIcon,
    TelegramIcon,
    WhatsappIcon,
} from "./Icons";

export function FloatingContact() {
    const [open, setOpen] = useState(false);
    return (
        <div className="pointer-events-none fixed bottom-5 right-3 z-30 flex flex-col items-end gap-2 max-md:bottom-6 max-md:mb-[env(safe-area-inset-bottom)] md:bottom-6 md:right-5 md:z-40">

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
                className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-ink shadow-cta transition hover:scale-105 hover:bg-accent-hover md:h-14 md:w-14"
                aria-label="Связаться"
            >
                {open ? (
                    <CloseIcon className="h-5 w-5" />
                ) : (
                    <MessageIcon className="h-5 w-5" />
                )}
            </button>
        </div>
    );
}
