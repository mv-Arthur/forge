"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { submitLead } from "@/actions/leads/submit-lead";
import { CATALOG_PROMO_CTA, CATALOG_PROMO_TITLE } from "@/lib/copy";
import type { ShowcasePriceHike } from "@/types/catalog";
import { CloseIcon } from "@/ui/icons";
import { LeadForm } from "@/widgets/lead-form/lead-form";
import { ProjectDetailHike } from "@/widgets/project-detail/__hike/project-detail__hike";
import dialog from "@/ui/dialog/dialog.module.css";

export function ProjectDetailHikeContainer({
    priceHike,
    source,
}: {
    priceHike: ShowcasePriceHike | null;
    source: string;
}) {
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
            source,
            name,
            phone,
            consent,
            prefill: CATALOG_PROMO_TITLE,
        });
        if (result.success) setSent(true);
    }

    return (
        <div>
            <ProjectDetailHike
                priceHike={priceHike}
                onCta={() => setOpen(true)}
            />
            {open && mounted
                ? createPortal(
                      <div
                          className={dialog.overlay}
                          role="dialog"
                          aria-modal="true"
                          aria-labelledby="detail-hike-title"
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
                                              id="detail-hike-title"
                                              className={dialog.title}
                                          >
                                              {CATALOG_PROMO_CTA}
                                          </h2>
                                          <p className={dialog.lead}>
                                              Оставьте телефон - перезвоним в
                                              рабочие часы.
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
