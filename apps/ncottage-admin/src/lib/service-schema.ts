import type { Service, ServiceSeoContent } from "@forge/shared";
import { z } from "zod";

// Form schema mirroring the shared Service contract. Free-text string arrays are
// wrapped as { value } for stable field-array keys; slug-reference arrays stay
// plain string[] (checkbox groups). Optional detail* strings are kept as plain
// strings and omitted when empty (matching the stored optional shape).

const wrappedString = z.object({ value: z.string().min(1, "Не пусто") });

const detailVariantSchema = z.object({
    title: z.string().min(1, "Укажите заголовок"),
    description: z.string().min(1, "Добавьте описание"),
});

const timingSchema = z.object({
    label: z.string().min(1, "Укажите подпись"),
    value: z.string().min(1, "Укажите значение"),
    description: z.string().min(1, "Добавьте описание"),
});

const exampleSchema = z.object({
    title: z.string().min(1, "Укажите заголовок"),
    description: z.string().min(1, "Добавьте описание"),
    result: z.string().min(1, "Добавьте результат"),
});

const faqSchema = z.object({
    question: z.string().min(1, "Укажите вопрос"),
    answer: z.string().min(1, "Добавьте ответ"),
});

const seoContentSchema = z.object({
    priceNote: z.string().min(1, "Добавьте заметку о цене"),
    timingLead: z.string().min(1, "Добавьте вводный текст сроков"),
    timing: z.array(timingSchema),
    examplesLead: z.string().min(1, "Добавьте вводный текст примеров"),
    examples: z.array(exampleSchema),
    faq: z.array(faqSchema),
});

export const serviceSchema = z.object({
    slug: z
        .string()
        .min(1, "Укажите slug")
        .regex(/^[a-z0-9-]+$/, "Только строчные латиница, цифры и дефис"),
    order: z.number({ message: "Укажите порядок" }).int().min(0),
    title: z.string().min(1, "Укажите заголовок"),
    shortTitle: z.string().min(1, "Укажите короткий заголовок"),
    description: z.string().min(1, "Добавьте описание"),
    sourceTitle: z.string().min(1, "Укажите исходный заголовок"),
    eyebrow: z.string().min(1, "Укажите надзаголовок"),
    lead: z.string().min(1, "Добавьте лид"),
    summary: z.string().min(1, "Добавьте summary"),
    image: z.string().min(1, "Укажите изображение"),
    cta: z.string().min(1, "Укажите CTA"),
    highlights: z.array(wrappedString),
    scopes: z.array(wrappedString),
    stages: z.array(wrappedString),
    advantages: z.array(wrappedString),
    fitFor: z.array(wrappedString),
    includes: z.array(wrappedString),
    notIncluded: z.array(wrappedString),
    priceFactors: z.array(wrappedString),
    deliverables: z.array(wrappedString),
    quickFacts: z.array(wrappedString),
    detailPain: z.string(),
    detailPromise: z.string(),
    detailVariants: z.array(detailVariantSchema),
    detailChecks: z.array(wrappedString),
    detailNextStep: z.string(),
    detailCta: z.string(),
    relatedSlugs: z.array(z.string()),
    scenarioSlugs: z.array(z.string()),
    seoContent: seoContentSchema,
    seoTitle: z.string(),
    seoDescription: z.string(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

const wrap = (values: string[]) => values.map((value) => ({ value }));
const unwrap = (items: { value: string }[]) =>
    items.map((i) => i.value.trim()).filter(Boolean);

export function emptyServiceValues(order = 0): ServiceFormValues {
    return {
        slug: "",
        order,
        title: "",
        shortTitle: "",
        description: "",
        sourceTitle: "",
        eyebrow: "",
        lead: "",
        summary: "",
        image: "",
        cta: "",
        highlights: [],
        scopes: [],
        stages: [],
        advantages: [],
        fitFor: [],
        includes: [],
        notIncluded: [],
        priceFactors: [],
        deliverables: [],
        quickFacts: [],
        detailPain: "",
        detailPromise: "",
        detailVariants: [],
        detailChecks: [],
        detailNextStep: "",
        detailCta: "",
        relatedSlugs: [],
        scenarioSlugs: [],
        seoContent: {
            priceNote: "",
            timingLead: "",
            timing: [],
            examplesLead: "",
            examples: [],
            faq: [],
        },
        seoTitle: "",
        seoDescription: "",
    };
}

export function serviceToFormValues(service: Service): ServiceFormValues {
    return {
        slug: service.slug,
        order: service.order,
        title: service.title,
        shortTitle: service.shortTitle,
        description: service.description,
        sourceTitle: service.sourceTitle,
        eyebrow: service.eyebrow,
        lead: service.lead,
        summary: service.summary,
        image: service.image,
        cta: service.cta,
        highlights: wrap(service.highlights),
        scopes: wrap(service.scopes),
        stages: wrap(service.stages),
        advantages: wrap(service.advantages),
        fitFor: wrap(service.fitFor),
        includes: wrap(service.includes),
        notIncluded: wrap(service.notIncluded),
        priceFactors: wrap(service.priceFactors),
        deliverables: wrap(service.deliverables),
        quickFacts: wrap(service.quickFacts),
        detailPain: service.detailPain ?? "",
        detailPromise: service.detailPromise ?? "",
        detailVariants: service.detailVariants.map((v) => ({ ...v })),
        detailChecks: wrap(service.detailChecks),
        detailNextStep: service.detailNextStep ?? "",
        detailCta: service.detailCta ?? "",
        relatedSlugs: [...service.relatedSlugs],
        scenarioSlugs: [...service.scenarioSlugs],
        seoContent: {
            priceNote: service.seoContent.priceNote,
            timingLead: service.seoContent.timingLead,
            timing: service.seoContent.timing.map((t) => ({ ...t })),
            examplesLead: service.seoContent.examplesLead,
            examples: service.seoContent.examples.map((e) => ({ ...e })),
            faq: service.seoContent.faq.map((f) => ({ ...f })),
        },
        seoTitle: service.seoTitle ?? "",
        seoDescription: service.seoDescription ?? "",
    };
}

function withOptional(key: string, value: string): Record<string, string> {
    const trimmed = value.trim();
    return trimmed.length ? { [key]: trimmed } : {};
}

export function formValuesToService(values: ServiceFormValues): Service {
    const seoContent: ServiceSeoContent = {
        priceNote: values.seoContent.priceNote.trim(),
        timingLead: values.seoContent.timingLead.trim(),
        timing: values.seoContent.timing.map((t) => ({
            label: t.label.trim(),
            value: t.value.trim(),
            description: t.description.trim(),
        })),
        examplesLead: values.seoContent.examplesLead.trim(),
        examples: values.seoContent.examples.map((e) => ({
            title: e.title.trim(),
            description: e.description.trim(),
            result: e.result.trim(),
        })),
        faq: values.seoContent.faq.map((f) => ({
            question: f.question.trim(),
            answer: f.answer.trim(),
        })),
    };

    return {
        slug: values.slug.trim(),
        order: values.order,
        title: values.title.trim(),
        shortTitle: values.shortTitle.trim(),
        description: values.description.trim(),
        sourceTitle: values.sourceTitle.trim(),
        eyebrow: values.eyebrow.trim(),
        lead: values.lead.trim(),
        summary: values.summary.trim(),
        image: values.image.trim(),
        cta: values.cta.trim(),
        highlights: unwrap(values.highlights),
        scopes: unwrap(values.scopes),
        stages: unwrap(values.stages),
        advantages: unwrap(values.advantages),
        fitFor: unwrap(values.fitFor),
        includes: unwrap(values.includes),
        notIncluded: unwrap(values.notIncluded),
        priceFactors: unwrap(values.priceFactors),
        deliverables: unwrap(values.deliverables),
        quickFacts: unwrap(values.quickFacts),
        ...withOptional("detailPain", values.detailPain),
        ...withOptional("detailPromise", values.detailPromise),
        detailVariants: values.detailVariants.map((v) => ({
            title: v.title.trim(),
            description: v.description.trim(),
        })),
        detailChecks: unwrap(values.detailChecks),
        ...withOptional("detailNextStep", values.detailNextStep),
        ...withOptional("detailCta", values.detailCta),
        relatedSlugs: values.relatedSlugs,
        scenarioSlugs: values.scenarioSlugs,
        seoContent,
        seoTitle: values.seoTitle.trim(),
        seoDescription: values.seoDescription.trim(),
    };
}
