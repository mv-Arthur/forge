import type { Partner } from "@forge/shared";
import { z } from "zod";

export const partnerSchema = z.object({
    slug: z
        .string()
        .min(1, "Укажите slug")
        .regex(/^[a-z0-9-]+$/, "Только строчные латиница, цифры и дефис"),
    name: z.string().min(1, "Укажите название"),
    category: z.string().min(1, "Укажите категорию"),
    href: z.string(),
});

export type PartnerFormValues = z.infer<typeof partnerSchema>;

export function emptyPartnerValues(): PartnerFormValues {
    return { slug: "", name: "", category: "", href: "" };
}

export function partnerToFormValues(partner: Partner): PartnerFormValues {
    return {
        slug: partner.slug,
        name: partner.name,
        category: partner.category,
        href: partner.href ?? "",
    };
}

export function formValuesToPartner(values: PartnerFormValues): Partner {
    // Всегда отправляем href (в т.ч. пустой), чтобы его можно было очистить.
    return {
        slug: values.slug.trim(),
        name: values.name.trim(),
        category: values.category.trim(),
        href: values.href.trim(),
    };
}
