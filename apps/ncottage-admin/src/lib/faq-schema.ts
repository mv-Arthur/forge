import type { FaqItem } from "@forge/shared";
import { z } from "zod";

export const faqSchema = z.object({
    slug: z
        .string()
        .min(1, "Укажите slug")
        .regex(/^[a-z0-9-]+$/, "Только строчные латиница, цифры и дефис"),
    order: z.number({ message: "Укажите порядок" }).int().min(0),
    group: z.string().min(1, "Укажите раздел"),
    question: z.string().min(1, "Укажите вопрос"),
    answer: z.string().min(1, "Укажите ответ"),
});

export type FaqFormValues = z.infer<typeof faqSchema>;

export function emptyFaqValues(order = 0): FaqFormValues {
    return { slug: "", order, group: "", question: "", answer: "" };
}

export function faqToFormValues(item: FaqItem): FaqFormValues {
    return {
        slug: item.slug,
        order: item.order,
        group: item.group,
        question: item.question,
        answer: item.answer,
    };
}

export function formValuesToFaq(values: FaqFormValues): FaqItem {
    return {
        slug: values.slug.trim(),
        order: values.order,
        group: values.group.trim(),
        question: values.question.trim(),
        answer: values.answer.trim(),
    };
}
