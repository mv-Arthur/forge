import type { Certificate } from "@forge/shared";
import { z } from "zod";

export const certificateSchema = z.object({
    slug: z
        .string()
        .min(1, "Укажите slug")
        .regex(/^[a-z0-9-]+$/, "Только строчные латиница, цифры и дефис"),
    order: z.number({ message: "Укажите порядок" }).int().min(0),
    title: z.string().min(1, "Укажите название документа"),
    imageUrl: z.string(),
    fileUrl: z.string(),
});

export type CertificateFormValues = z.infer<typeof certificateSchema>;

export function emptyCertificateValues(order = 0): CertificateFormValues {
    return { slug: "", order, title: "", imageUrl: "", fileUrl: "" };
}

export function certificateToFormValues(
    certificate: Certificate
): CertificateFormValues {
    return {
        slug: certificate.slug,
        order: certificate.order,
        title: certificate.title,
        imageUrl: certificate.imageUrl ?? "",
        fileUrl: certificate.fileUrl ?? "",
    };
}

export function formValuesToCertificate(
    values: CertificateFormValues
): Certificate {
    // imageUrl/fileUrl всегда шлём (в т.ч. пустыми), чтобы их можно было очистить.
    return {
        slug: values.slug.trim(),
        order: values.order,
        title: values.title.trim(),
        imageUrl: values.imageUrl.trim(),
        fileUrl: values.fileUrl.trim(),
    };
}
