import type { Certificate } from "@forge/shared";
import { z } from "zod";

export const certificateSchema = z.object({
    slug: z
        .string()
        .min(1, "Укажите slug")
        .regex(/^[a-z0-9-]+$/, "Только строчные латиница, цифры и дефис"),
    title: z.string().min(1, "Укажите название документа"),
});

export type CertificateFormValues = z.infer<typeof certificateSchema>;

export function emptyCertificateValues(): CertificateFormValues {
    return { slug: "", title: "" };
}

export function certificateToFormValues(
    certificate: Certificate
): CertificateFormValues {
    return { slug: certificate.slug, title: certificate.title };
}

export function formValuesToCertificate(
    values: CertificateFormValues
): Certificate {
    return { slug: values.slug.trim(), title: values.title.trim() };
}
