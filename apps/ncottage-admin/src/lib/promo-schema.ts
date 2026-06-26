import type { Promo } from "@forge/shared";
import { z } from "zod";

const wrappedString = z.object({ value: z.string().min(1, "Не пусто") });
const wrap = (values: string[]) => values.map((value) => ({ value }));
const unwrap = (items: { value: string }[]) =>
    items.map((i) => i.value.trim()).filter(Boolean);

export const promoSchema = z.object({
    slug: z
        .string()
        .min(1, "Укажите slug")
        .regex(/^[a-z0-9-]+$/, "Только строчные латиница, цифры и дефис"),
    title: z.string().min(1, "Укажите заголовок"),
    shortTitle: z.string().min(1, "Укажите краткое название"),
    eyebrow: z.string().min(1, "Укажите надзаголовок"),
    lead: z.string().min(1, "Укажите вступление"),
    price: z.string().min(1, "Укажите цену"),
    priceNote: z.string().min(1, "Укажите подпись цены"),
    period: z.string().min(1, "Укажите примечание о сроках"),
    projectsHref: z.string().min(1, "Укажите ссылку на проекты"),
    terms: z.array(wrappedString),
    includes: z.array(wrappedString),
    details: z.array(wrappedString),
    seoTitle: z.string(),
    seoDescription: z.string(),
});

export type PromoFormValues = z.infer<typeof promoSchema>;

export function emptyPromoValues(): PromoFormValues {
    return {
        slug: "",
        title: "",
        shortTitle: "",
        eyebrow: "Специальное предложение",
        lead: "",
        price: "",
        priceNote: "",
        period: "",
        projectsHref: "",
        terms: [],
        includes: [],
        details: [],
        seoTitle: "",
        seoDescription: "",
    };
}

export function promoToFormValues(promo: Promo): PromoFormValues {
    return {
        slug: promo.slug,
        title: promo.title,
        shortTitle: promo.shortTitle,
        eyebrow: promo.eyebrow,
        lead: promo.lead,
        price: promo.price,
        priceNote: promo.priceNote,
        period: promo.period,
        projectsHref: promo.projectsHref,
        terms: wrap(promo.terms),
        includes: wrap(promo.includes),
        details: wrap(promo.details),
        seoTitle: promo.seoTitle ?? "",
        seoDescription: promo.seoDescription ?? "",
    };
}

export function formValuesToPromo(values: PromoFormValues): Promo {
    return {
        slug: values.slug.trim(),
        title: values.title.trim(),
        shortTitle: values.shortTitle.trim(),
        eyebrow: values.eyebrow.trim(),
        lead: values.lead.trim(),
        price: values.price.trim(),
        priceNote: values.priceNote.trim(),
        period: values.period.trim(),
        projectsHref: values.projectsHref.trim(),
        terms: unwrap(values.terms),
        includes: unwrap(values.includes),
        details: unwrap(values.details),
        seoTitle: values.seoTitle.trim(),
        seoDescription: values.seoDescription.trim(),
    };
}
