export type SubmitLeadInput = {
    source: string;
    name: string;
    phone: string;
    email?: string;
    consent: boolean;
    prefill?: string;
};
