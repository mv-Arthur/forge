import type { FaqItem } from "@forge/shared";
import { z } from "zod";

export const faqSchema = z.object({
    slug: z
        .string()
        .min(1, "Укажите slug")
        .regex(/^[a-z0-9-]+$/, "Только строчные латиница, цифры и дефис"),
    group: z.string().min(1, "Укажите раздел"),
    question: z.string().min(1, "Укажите вопрос"),
    answer: z.string().min(1, "Укажите ответ"),
});

export type FaqFormValues = z.infer<typeof faqSchema>;

export function emptyFaqValues(): FaqFormValues {
    return { slug: "", group: "", question: "", answer: "" };
}

export function faqToFormValues(item: FaqItem): FaqFormValues {
    return {
        slug: item.slug,
        group: item.group,
        question: item.question,
        answer: item.answer,
    };
}

export function formValuesToFaq(values: FaqFormValues): FaqItem {
    return {
        slug: values.slug.trim(),
        group: values.group.trim(),
        question: values.question.trim(),
        answer: values.answer.trim(),
    };
}
