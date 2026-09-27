"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { submitLead } from "@/actions/leads/submit-lead";
import {
    DETAIL_SERVICES_ARCHITECT_DIALOG,
    DETAIL_SERVICES_ARCHITECT_DIALOG_LEAD,
    DETAIL_SERVICES_SITE_DIALOG,
    DETAIL_SERVICES_SITE_DIALOG_LEAD,
    DETAIL_SERVICES_SUBMIT,
    DETAIL_SERVICES_VISIT_DIALOG,
    DETAIL_SERVICES_VISIT_DIALOG_LEAD,
} from "@/lib/copy";
import { CloseIcon } from "@/ui/icons";
import { LeadForm } from "@/widgets/lead-form/lead-form";
import dialog from "@/ui/dialog/dialog.module.css";
import { ProjectDetailServices } from "./project-detail-services";
import type { ServicesKind } from "./project-detail-services.types";

const COPY: Record<
    ServicesKind,
    { title: string; lead: string; prefill: (name: string) => string }
> = {
    visit: {
        title: DETAIL_SERVICES_VISIT_DIALOG,
        lead: DETAIL_SERVICES_VISIT_DIALOG_LEAD,
        prefill: (name) => `Просмотр готового дома: ${name}`,
    },
    site: {
        title: DETAIL_SERVICES_SITE_DIALOG,
        lead: DETAIL_SERVICES_SITE_DIALOG_LEAD,
        prefill: (name) => `Экскурсия на стройку: ${name}`,
    },
    architect: {
        title: DETAIL_SERVICES_ARCHITECT_DIALOG,
        lead: DETAIL_SERVICES_ARCHITECT_DIALOG_LEAD,
        prefill: (name) => `Консультация архитектора: ${name}`,
    },
};

export function ProjectDetailServicesContainer({
    source,
    projectName,
}: {
    source: string;
    projectName: string;
}) {
    const [kind, setKind] = useState<ServicesKind>("visit");
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [consent, setConsent] = useState(true);
    const [sent, setSent] = useState(false);
    const copy = COPY[kind];
    const prefill = copy.prefill(projectName);
    const formSource = `${source}-${kind}`;

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

    function onOpen(next: ServicesKind) {
        setKind(next);
        setSent(false);
        setOpen(true);
    }

    async function onSubmit() {
        if (!phone || !consent) return;
        const result = await submitLead({
            source: formSource,
            name,
            phone,
            consent,
            prefill,
        });
        if (result.success) setSent(true);
    }

    return (
        <div>
            <ProjectDetailServices onOpen={onOpen} />
            {open && mounted
                ? createPortal(
                      <div
                          className={dialog.overlay}
                          role="dialog"
                          aria-modal="true"
                          aria-labelledby="detail-services-title"
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
                                              id="detail-services-title"
                                              className={dialog.title}
                                          >
                                              {copy.title}
                                          </h2>
                                          <p className={dialog.lead}>
                                              {copy.lead}
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
                                      source={formSource}
                                      prefill={prefill}
                                      ctaLabel={DETAIL_SERVICES_SUBMIT}
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
