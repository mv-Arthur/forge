"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckIcon } from "./Icons";

interface LeadFormProps {
    source: string;
    prefill?: string;
    ctaLabel?: string;
    inline?: boolean;
    withDate?: boolean;
    variant?: "light" | "dark";
}

export function LeadForm({
    source,
    prefill,
    ctaLabel = "Отправить заявку",
    inline = false,
    withDate = false,
    variant = "light",
}: LeadFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState("");
    const [consent, setConsent] = useState(true);
    const [sent, setSent] = useState(false);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!phone || !consent) return;
        setSent(true);
    }

    if (sent) {
        return (
            <div className="flex items-start gap-3 rounded-xl border border-success/20 bg-success/5 p-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-success text-white">
                    <CheckIcon className="h-4 w-4" />
                </span>
                <div className="flex-1 text-sm">
                    <div className="font-semibold text-success">
                        Заявка принята
                    </div>
                    <p className="mt-1 text-ink-700">
                        Менеджер свяжется в течение 15 минут. В превью заявки
                        не отправляются — на проде уходят в CRM.
                    </p>
                </div>
            </div>
        );
    }

    const dark = variant === "dark";

    return (
        <form
            onSubmit={submit}
            className={inline ? "grid gap-3 md:grid-cols-[1fr_1fr_auto]" : "space-y-3"}
        >
            {prefill ? (
                <input type="hidden" name="prefill" value={prefill} />
            ) : null}
            <input type="hidden" name="source" value={source} />
            <div>
                {!inline ? (
                    <label className={dark ? "field-label !text-ink-300" : "field-label"}>
                        Имя
                    </label>
                ) : null}
                <input
                    className={dark ? "field !bg-white/5 !border-white/10 !text-white placeholder:!text-ink-400" : "field"}
                    placeholder="Иван Иванов"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                {!inline ? (
                    <label className={dark ? "field-label !text-ink-300" : "field-label"}>
                        Телефон
                    </label>
                ) : null}
                <input
                    className={dark ? "field !bg-white/5 !border-white/10 !text-white placeholder:!text-ink-400" : "field"}
                    placeholder="+7 (___) ___-__-__"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </div>
            {withDate ? (
                <div>
                    {!inline ? (
                        <label className={dark ? "field-label !text-ink-300" : "field-label"}>
                            Удобная дата
                        </label>
                    ) : null}
                    <div className="relative">
                        <input
                            className={dark ? "field !bg-white/5 !border-white/10 !text-white pr-10" : "field pr-10"}
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="ДД.ММ.ГГГГ"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
                            📅
                        </span>
                    </div>
                </div>
            ) : null}
            <button
                type="submit"
                className="btn btn-primary btn-lg w-full"
            >
                {ctaLabel}
            </button>
            <label className={inline ? "flex items-start gap-2 text-[12px] md:col-span-3 " + (dark ? "text-ink-400" : "text-ink-500") : "flex items-start gap-2 text-[12px] " + (dark ? "text-ink-400" : "text-ink-500")}>
                <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-accent"
                />
                <span>
                    Согласен на{" "}
                    <Link
                        href="/personal-data"
                        className={
                            dark
                                ? "underline decoration-white/30 underline-offset-2 hover:text-white"
                                : "underline decoration-ink-300 underline-offset-2 hover:text-ink-950"
                        }
                    >
                        обработку персональных данных
                    </Link>{" "}
                    согласно{" "}
                    <Link
                        href="/privacy"
                        className={
                            dark
                                ? "underline decoration-white/30 underline-offset-2 hover:text-white"
                                : "underline decoration-ink-300 underline-offset-2 hover:text-ink-950"
                        }
                    >
                        политике конфиденциальности
                    </Link>
                    .
                </span>
            </label>
        </form>
    );
}
