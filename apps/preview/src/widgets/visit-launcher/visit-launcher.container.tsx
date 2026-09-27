"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { submitLead } from "@/actions/leads/submit-lead";
import { CloseIcon } from "@/ui/icons";
import { LeadForm } from "@/widgets/lead-form/lead-form";
import dialog from "@/ui/dialog/dialog.module.css";

export function VisitLauncherContainer({
    buttonClassName = "btn btn-primary btn-lg",
    buttonLabel = "Записаться на просмотр",
    source = "works-catalog-visit",
    children,
}: {
    buttonClassName?: string;
    buttonLabel?: string;
    source?: string;
    children?: ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [consent, setConsent] = useState(true);
    const [sent, setSent] = useState(false);
    const titleId = useId();

    useEffect(() => {
        setMounted(true);
    }, []);

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
            source,
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
                {children}
                {buttonLabel}
            </button>
            {open && mounted
                ? createPortal(
                      <div
                          className={dialog.overlay}
                          role="dialog"
                          aria-modal="true"
                          aria-labelledby={titleId}
                      >
                          <button
                              type="button"
                              className={dialog.backdrop}
                              aria-label="Закрыть"
                              onClick={() => setOpen(false)}
                          />
                          <div className={dialog.stage}>
                              <div className={dialog.card}>
                                  <div className={dialog.head}>
                                      <div>
                                          <h2
                                              id={titleId}
                                              className={dialog.title}
                                          >
                                              Запись на просмотр
                                          </h2>
                                          <p className={dialog.lead}>
                                              Около часа. Покажем дом и ответим
                                              по срокам и смете.
                                          </p>
                                      </div>
                                      <button
                                          type="button"
                                          onClick={() => setOpen(false)}
                                          className={dialog.close}
                                          aria-label="Закрыть"
                                      >
                                          <CloseIcon className={dialog.icon} />
                                      </button>
                                  </div>
                                  <LeadForm
                                      source={source}
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
                      </div>,
                      document.body,
                  )
                : null}
        </>
    );
}
