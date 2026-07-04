import type { Partner } from "@forge/shared";
import { z } from "zod";

export const partnerSchema = z.object({
    slug: z
        .string()
        .min(1, "Укажите slug")
        .regex(/^[a-z0-9-]+$/, "Только строчные латиница, цифры и дефис"),
    order: z.number({ message: "Укажите порядок" }).int().min(0),
    name: z.string().min(1, "Укажите название"),
    category: z.string().min(1, "Укажите категорию"),
    href: z.string(),
});

export type PartnerFormValues = z.infer<typeof partnerSchema>;

export function emptyPartnerValues(order = 0): PartnerFormValues {
    return { slug: "", order, name: "", category: "", href: "" };
}

export function partnerToFormValues(partner: Partner): PartnerFormValues {
    return {
        slug: partner.slug,
        order: partner.order,
        name: partner.name,
        category: partner.category,
        href: partner.href ?? "",
    };
}

export function formValuesToPartner(values: PartnerFormValues): Partner {
    // Всегда отправляем href (в т.ч. пустой), чтобы его можно было очистить.
    return {
        slug: values.slug.trim(),
        order: values.order,
        name: values.name.trim(),
        category: values.category.trim(),
        href: values.href.trim(),
    };
}
