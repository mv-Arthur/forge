"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { submitLead } from "@/actions/leads/submit-lead";
import {
    DETAIL_LAYOUT_CTA,
    DETAIL_LAYOUT_LEAD,
    DETAIL_LAYOUT_SUBMIT,
    DETAIL_LAYOUT_TITLE,
} from "@/lib/copy";
import { CloseIcon } from "@/ui/icons";
import { LeadForm } from "@/widgets/lead-form/lead-form";
import dialog from "@/ui/dialog/dialog.module.css";
import styles from "./individual-layout-cta.module.css";

export function ProjectDetailIndividualLayoutCta({
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
    const [email, setEmail] = useState("");
    const [consent, setConsent] = useState(false);
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
            email,
            consent,
            prefill,
        });
        if (result.success) setSent(true);
    }

    return (
        <section
            data-section="detail-layout-cta"
            className={styles.root}
        >
            <div className={styles.inner}>
                <h2 className={styles.title}>{DETAIL_LAYOUT_TITLE}</h2>
                <p className={styles.lead}>{DETAIL_LAYOUT_LEAD}</p>
                <button
                    type="button"
                    className={`btn btn-primary ${styles.btn}`}
                    onClick={() => {
                        setSent(false);
                        setOpen(true);
                    }}
                >
                    {DETAIL_LAYOUT_CTA}
                </button>
            </div>
            {open && mounted
                ? createPortal(
                      <div
                          className={dialog.overlay}
                          role="dialog"
                          aria-modal="true"
                          aria-labelledby="layout-cta-title"
                      >
                          <button
                              type="button"
                              className={dialog.backdrop}
                              aria-label="Закрыть"
                              onClick={() => setOpen(false)}
                          />
                          <div className={dialog.stage}>
                              <div className={`${dialog.card} ${styles.card}`}>
                                  <div className={dialog.head}>
                                      <h2
                                          id="layout-cta-title"
                                          className={`${dialog.title} ${styles.dialogTitle}`}
                                      >
                                          {DETAIL_LAYOUT_CTA}
                                      </h2>
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
                                      prefill={prefill}
                                      ctaLabel={DETAIL_LAYOUT_SUBMIT}
                                      variant="light"
                                      layout="dialog"
                                      values={{ name, phone, email, consent }}
                                      sent={sent}
                                      onNameChange={setName}
                                      onPhoneChange={setPhone}
                                      onEmailChange={setEmail}
                                      onConsentChange={setConsent}
                                      onSubmit={onSubmit}
                                  />
                              </div>
                          </div>
                      </div>,
                      document.body,
                  )
                : null}
        </section>
    );
}
