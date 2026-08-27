"use client";

import { useEffect, useId, useState } from "react";
import { submitLead } from "@/actions/leads/submit-lead";
import { LeadForm } from "@/widgets/lead-form/lead-form";

export function VisitLauncherContainer({
    buttonClassName = "btn btn-primary btn-lg",
    buttonLabel = "Записаться на просмотр",
}: {
    buttonClassName?: string;
    buttonLabel?: string;
}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [consent, setConsent] = useState(true);
    const [sent, setSent] = useState(false);
    const titleId = useId();

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open]);

    async function onSubmit() {
        if (!phone || !consent) return;
        const result = await submitLead({
            source: "works-catalog-visit",
            name,
            phone,
            consent,
            prefill: "Запись на просмотр дома",
        });
        if (result.success) setSent(true);
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={buttonClassName}
            >
                {buttonLabel}
            </button>
            {open ? (
                <div
                    className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                >
                    <button
                        type="button"
                        className="absolute inset-0 bg-ink-950/50 backdrop-blur-[2px]"
                        aria-label="Закрыть"
                        onClick={() => setOpen(false)}
                    />
                    <div className="relative z-10 w-full max-w-md rounded-t-2xl border border-ink-150 bg-white p-6 shadow-lift sm:rounded-2xl md:p-8">
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                                <h2
                                    id={titleId}
                                    className="font-display text-2xl font-bold text-ink-950"
                                >
                                    Запись на просмотр
                                </h2>
                                <p className="mt-1 text-sm text-ink-500">
                                    Около часа. Покажем дом и ответим по срокам
                                    и смете.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full border border-ink-150 text-ink-600 hover:border-ink-900 hover:text-ink-950"
                                aria-label="Закрыть"
                            >
                                ×
                            </button>
                        </div>
                        <LeadForm
                            source="works-catalog-visit"
                            prefill="Запись на просмотр дома"
                            ctaLabel="Записаться"
                            variant="light"
                            values={{ name, phone, consent }}
                            sent={sent}
                            onNameChange={setName}
                            onPhoneChange={setPhone}
                            onConsentChange={setConsent}
                            onSubmit={onSubmit}
                        />
                    </div>
                </div>
            ) : null}
        </>
    );
}
