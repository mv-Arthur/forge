"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { submitLead } from "@/actions/leads/submit-lead";
import { CATALOG_CONSULT_CTA, CATALOG_CONSULT_TITLE } from "@/lib/copy";
import { CloseIcon } from "@/ui/icons";
import { LeadForm } from "@/widgets/lead-form/lead-form";
import { CatalogConsult } from "./catalog-consult";

export function CatalogConsultContainer() {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [consent, setConsent] = useState(true);
    const [sent, setSent] = useState(false);

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
            source: "catalog-consult",
            name,
            phone,
            consent,
            prefill: CATALOG_CONSULT_TITLE,
        });
        if (result.success) setSent(true);
    }

    return (
        <div>
            <CatalogConsult onCta={() => setOpen(true)} />
            {open && mounted
                ? createPortal(
                      <div
                          className="fixed inset-0 z-[80]"
                          role="dialog"
                          aria-modal="true"
                          aria-labelledby="catalog-consult-title"
                      >
                          <button
                              type="button"
                              className="absolute inset-0 bg-ink-950/50 backdrop-blur-[2px]"
                              aria-label="Закрыть"
                              onClick={() => setOpen(false)}
                          />
                          <div className="pointer-events-none relative flex h-full items-center justify-center p-4">
                              <div className="pointer-events-auto relative z-10 w-full max-w-md rounded-2xl border border-ink-150 bg-white p-6 shadow-lift">
                                  <div className="mb-4 flex items-start justify-between gap-3">
                                      <div>
                                          <h2
                                              id="catalog-consult-title"
                                              className="font-display text-2xl font-bold text-ink-950"
                                          >
                                              {CATALOG_CONSULT_CTA}
                                          </h2>
                                          <p className="mt-1 text-sm text-ink-500">
                                              Оставьте телефон - перезвоним в
                                              рабочие часы.
                                          </p>
                                      </div>
                                      <button
                                          type="button"
                                          onClick={() => setOpen(false)}
                                          className="grid h-9 w-9 place-items-center rounded-full border border-ink-150 text-ink-600 hover:border-ink-900 hover:text-ink-950"
                                          aria-label="Закрыть"
                                      >
                                          <CloseIcon className="h-4 w-4" />
                                      </button>
                                  </div>
                                  <LeadForm
                                      source="catalog-consult"
                                      ctaLabel="Перезвоните мне"
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
                      document.body
                  )
                : null}
        </div>
    );
}
