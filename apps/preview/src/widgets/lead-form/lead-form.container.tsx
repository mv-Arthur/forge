"use client";

import { useState } from "react";
import { submitLead } from "@/actions/leads/submit-lead";
import { LeadForm } from "./lead-form";
import type { LeadFormLayout, LeadFormVariant } from "./lead-form.types";

export function LeadFormContainer({
    source,
    prefill,
    ctaLabel = "Перезвоните мне",
    variant = "light",
    layout = "full",
    inline = false,
}: {
    source: string;
    prefill?: string;
    ctaLabel?: string;
    variant?: LeadFormVariant;
    layout?: LeadFormLayout;
    inline?: boolean;
}) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const withEmail = layout === "works" || layout === "unique";
    const [consent, setConsent] = useState(layout !== "works");
    const [sent, setSent] = useState(false);

    async function onSubmit() {
        if (!phone || !consent) return;
        const result = await submitLead({
            source,
            name,
            phone,
            email: withEmail ? email : undefined,
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
            layout={layout}
            inline={inline}
            values={{ name, phone, email, consent }}
            sent={sent}
            onNameChange={setName}
            onPhoneChange={setPhone}
            onEmailChange={setEmail}
            onConsentChange={setConsent}
            onSubmit={onSubmit}
        />
    );
}
