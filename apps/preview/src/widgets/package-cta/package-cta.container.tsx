"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { submitLead } from "@/actions/leads/submit-lead";
import {
    DETAIL_PACKAGE_CTA,
    DETAIL_PACKAGE_CTA_LEAD,
} from "@/lib/copy";
import { CloseIcon } from "@/ui/icons";
import { LeadForm } from "@/widgets/lead-form/lead-form";
import dialog from "@/ui/dialog/dialog.module.css";
import { PackageCta } from "./package-cta";

export function PackageCtaContainer({
    source,
    prefill,
}: {
    source: string;
    prefill: string;
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
            prefill,
        });
        if (result.success) setSent(true);
    }

    return (
        <div>
            <PackageCta onClick={() => setOpen(true)} />
            {open && mounted
                ? createPortal(
                      <div
                          className={dialog.overlay}
                          role="dialog"
                          aria-modal="true"
                          aria-labelledby="package-cta-title"
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
                                              id="package-cta-title"
                                              className={dialog.title}
                                          >
                                              {DETAIL_PACKAGE_CTA}
                                          </h2>
                                          <p className={dialog.lead}>
                                              {DETAIL_PACKAGE_CTA_LEAD}
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
                                      ctaLabel={DETAIL_PACKAGE_CTA}
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
        </div>
    );
}
