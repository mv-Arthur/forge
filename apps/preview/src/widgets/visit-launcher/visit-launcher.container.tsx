"use client";

import { useEffect, useId, useState } from "react";
import { submitLead } from "@/actions/leads/submit-lead";
import { LeadForm } from "@/widgets/lead-form/lead-form";
import styles from "./visit-launcher.module.css";

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
                    className={styles.overlay}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                >
                    <button
                        type="button"
                        className={styles.backdrop}
                        aria-label="Закрыть"
                        onClick={() => setOpen(false)}
                    />
                    <div className={styles.sheet}>
                        <div className={styles.head}>
                            <div>
                                <h2 id={titleId} className={styles.title}>
                                    Запись на просмотр
                                </h2>
                                <p className={styles.lead}>
                                    Около часа. Покажем дом и ответим по срокам
                                    и смете.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className={styles.close}
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
