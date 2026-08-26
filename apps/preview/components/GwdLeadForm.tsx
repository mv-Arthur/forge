"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckIcon } from "./Icons";

interface Props {
    source: string;
    prefill?: string;
    ctaLabel?: string;
    variant?: "light" | "dark";
}

/** GWD-style callback form: name / phone / consent + fake success. */
export function GwdLeadForm({
    source,
    prefill,
    ctaLabel = "Перезвоните мне",
    variant = "light",
}: Props) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [consent, setConsent] = useState(true);
    const [sent, setSent] = useState(false);
    const dark = variant === "dark";

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!phone || !consent) return;
        setSent(true);
    }

    if (sent) {
        return (
            <div
                data-gwd-lead
                className="flex items-start gap-3 rounded-xl border border-success/20 bg-success/5 p-5"
            >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-success text-white">
                    <CheckIcon className="h-4 w-4" />
                </span>
                <div className="text-sm">
                    <div className="font-semibold text-success">
                        Спасибо за заявку!
                    </div>
                    <p className="mt-1 text-ink-700">
                        В ближайшее время с вами свяжется менеджер.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form
            data-gwd-lead
            onSubmit={submit}
            className="space-y-3"
            data-source={source}
        >
            {prefill ? (
                <input type="hidden" name="prefill" value={prefill} />
            ) : null}
            <input type="hidden" name="source" value={source} />
            <div className="grid gap-3 sm:grid-cols-2">
                <div>
                    <label
                        className={
                            dark ? "field-label !text-ink-300" : "field-label"
                        }
                    >
                        Имя
                    </label>
                    <input
                        className={
                            dark
                                ? "field !border-white/10 !bg-white/5 !text-white placeholder:!text-ink-400"
                                : "field"
                        }
                        placeholder="Иван"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label
                        className={
                            dark ? "field-label !text-ink-300" : "field-label"
                        }
                    >
                        Телефон
                    </label>
                    <input
                        className={
                            dark
                                ? "field !border-white/10 !bg-white/5 !text-white placeholder:!text-ink-400"
                                : "field"
                        }
                        placeholder="+7 (___) ___-__-__"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
            </div>
            <button
                type="submit"
                className="btn btn-primary btn-lg w-full uppercase tracking-[0.06em] shadow-cta"
            >
                {ctaLabel}
            </button>
            <label
                className={
                    "flex items-start gap-2 text-xs " +
                    (dark ? "text-ink-400" : "text-ink-500")
                }
            >
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
                        className="underline underline-offset-2"
                    >
                        обработку персональных данных
                    </Link>
                    .
                </span>
            </label>
        </form>
    );
}

export { GwdLeadForm as LeadForm };
