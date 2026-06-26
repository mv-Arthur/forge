import type { ServiceScenario, ServiceScenarioPlan } from "@forge/shared";
import { z } from "zod";

// Form schema for service navigator scenarios. Slug arrays stay plain string[]
// (checkbox groups). Optional pain/promise/outcome/cta and plan.startText are
// kept as plain strings and omitted when empty (matching the stored shape).

const planSchema = z.object({
    title: z.string().min(1, "Укажите заголовок"),
    resultLabel: z.string().min(1, "Укажите подпись результата"),
    visualTitle: z.string().min(1, "Укажите заголовок контекста"),
    visualCaption: z.string().min(1, "Добавьте подпись контекста"),
    image: z.string().min(1, "Укажите изображение"),
    startLabel: z.string().min(1, "Укажите подпись этапа «Сначала»"),
    startText: z.string(),
    nextLabel: z.string().min(1, "Укажите подпись этапа «Затем»"),
    nextText: z.string().min(1, "Добавьте текст этапа «Затем»"),
    optionalLabel: z.string().min(1, "Укажите подпись этапа «Если нужно»"),
    optionalText: z.string().min(1, "Добавьте текст этапа «Если нужно»"),
    ctaText: z.string().min(1, "Добавьте текст призыва"),
});

export const serviceScenarioSchema = z.object({
    slug: z
        .string()
        .min(1, "Укажите slug")
        .regex(/^[a-z0-9-]+$/, "Только строчные латиница, цифры и дефис"),
    order: z.number({ message: "Укажите порядок" }).int().min(0),
    title: z.string().min(1, "Укажите заголовок"),
    description: z.string().min(1, "Добавьте описание"),
    questionLabel: z.string().min(1, "Укажите вопрос подбора"),
    pain: z.string(),
    promise: z.string(),
    outcome: z.string(),
    cta: z.string(),
    nextStep: z.string().min(1, "Укажите следующий шаг"),
    serviceSlugs: z.array(z.string()),
    primaryServiceSlugs: z.array(z.string()),
    nextServiceSlugs: z.array(z.string()),
    optionalServiceSlugs: z.array(z.string()),
    plan: planSchema,
});

export type ServiceScenarioFormValues = z.infer<typeof serviceScenarioSchema>;

function withOptional(key: string, value: string): Record<string, string> {
    const trimmed = value.trim();
    return trimmed.length ? { [key]: trimmed } : {};
}

export function emptyScenarioValues(order = 0): ServiceScenarioFormValues {
    return {
        slug: "",
        order,
        title: "",
        description: "",
        questionLabel: "",
        pain: "",
        promise: "",
        outcome: "",
        cta: "",
        nextStep: "",
        serviceSlugs: [],
        primaryServiceSlugs: [],
        nextServiceSlugs: [],
        optionalServiceSlugs: [],
        plan: {
            title: "",
            resultLabel: "",
            visualTitle: "",
            visualCaption: "",
            image: "",
            startLabel: "",
            startText: "",
            nextLabel: "",
            nextText: "",
            optionalLabel: "",
            optionalText: "",
            ctaText: "",
        },
    };
}

export function scenarioToFormValues(
    scenario: ServiceScenario
): ServiceScenarioFormValues {
    return {
        slug: scenario.slug,
        order: scenario.order,
        title: scenario.title,
        description: scenario.description,
        questionLabel: scenario.questionLabel,
        pain: scenario.pain ?? "",
        promise: scenario.promise ?? "",
        outcome: scenario.outcome ?? "",
        cta: scenario.cta ?? "",
        nextStep: scenario.nextStep,
        serviceSlugs: [...scenario.serviceSlugs],
        primaryServiceSlugs: [...scenario.primaryServiceSlugs],
        nextServiceSlugs: [...scenario.nextServiceSlugs],
        optionalServiceSlugs: [...scenario.optionalServiceSlugs],
        plan: {
            title: scenario.plan.title,
            resultLabel: scenario.plan.resultLabel,
            visualTitle: scenario.plan.visualTitle,
            visualCaption: scenario.plan.visualCaption,
            image: scenario.plan.image,
            startLabel: scenario.plan.startLabel,
            startText: scenario.plan.startText ?? "",
            nextLabel: scenario.plan.nextLabel,
            nextText: scenario.plan.nextText,
            optionalLabel: scenario.plan.optionalLabel,
            optionalText: scenario.plan.optionalText,
            ctaText: scenario.plan.ctaText,
        },
    };
}

export function formValuesToScenario(
    values: ServiceScenarioFormValues
): ServiceScenario {
    const plan: ServiceScenarioPlan = {
        title: values.plan.title.trim(),
        resultLabel: values.plan.resultLabel.trim(),
        visualTitle: values.plan.visualTitle.trim(),
        visualCaption: values.plan.visualCaption.trim(),
        image: values.plan.image.trim(),
        startLabel: values.plan.startLabel.trim(),
        ...withOptional("startText", values.plan.startText),
        nextLabel: values.plan.nextLabel.trim(),
        nextText: values.plan.nextText.trim(),
        optionalLabel: values.plan.optionalLabel.trim(),
        optionalText: values.plan.optionalText.trim(),
        ctaText: values.plan.ctaText.trim(),
    };

    return {
        slug: values.slug.trim(),
        order: values.order,
        title: values.title.trim(),
        description: values.description.trim(),
        questionLabel: values.questionLabel.trim(),
        ...withOptional("pain", values.pain),
        ...withOptional("promise", values.promise),
        ...withOptional("outcome", values.outcome),
        ...withOptional("cta", values.cta),
        nextStep: values.nextStep.trim(),
        serviceSlugs: values.serviceSlugs,
        primaryServiceSlugs: values.primaryServiceSlugs,
        nextServiceSlugs: values.nextServiceSlugs,
        optionalServiceSlugs: values.optionalServiceSlugs,
        plan,
    };
}
