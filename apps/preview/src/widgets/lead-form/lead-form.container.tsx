"use client";

import { useState } from "react";
import { submitLead } from "@/actions/leads/submit-lead";
import { LeadForm } from "./lead-form";
import type { LeadFormVariant } from "./lead-form.types";

export function LeadFormContainer({
    source,
    prefill,
    ctaLabel = "Перезвоните мне",
    variant = "light",
    inline = false,
}: {
    source: string;
    prefill?: string;
    ctaLabel?: string;
    variant?: LeadFormVariant;
    inline?: boolean;
}) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [consent, setConsent] = useState(true);
    const [sent, setSent] = useState(false);

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
        <LeadForm
            source={source}
            prefill={prefill}
            ctaLabel={ctaLabel}
            variant={variant}
            inline={inline}
            values={{ name, phone, consent }}
            sent={sent}
            onNameChange={setName}
            onPhoneChange={setPhone}
            onConsentChange={setConsent}
            onSubmit={onSubmit}
        />
    );
}
