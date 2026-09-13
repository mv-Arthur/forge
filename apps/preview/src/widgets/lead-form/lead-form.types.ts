export type LeadFormVariant = "light" | "dark";

export type LeadFormLayout = "full" | "home";

export type LeadFormValues = {
    name: string;
    phone: string;
    consent: boolean;
};

export type LeadFormProps = {
    source: string;
    prefill?: string;
    ctaLabel: string;
    variant: LeadFormVariant;
    layout?: LeadFormLayout;
    inline?: boolean;
    values: LeadFormValues;
    sent: boolean;
    onNameChange: (value: string) => void;
    onPhoneChange: (value: string) => void;
    onConsentChange: (value: boolean) => void;
    onSubmit: () => void;
};
