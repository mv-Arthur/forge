import type { Vacancy } from "@forge/shared";
import { z } from "zod";

const wrappedString = z.object({ value: z.string().min(1, "Не пусто") });
const wrap = (values: string[]) => values.map((value) => ({ value }));
const unwrap = (items: { value: string }[]) =>
    items.map((i) => i.value.trim()).filter(Boolean);

export const vacancySchema = z.object({
    slug: z
        .string()
        .min(1, "Укажите slug")
        .regex(/^[a-z0-9-]+$/, "Только строчные латиница, цифры и дефис"),
    order: z.number({ message: "Укажите порядок" }).int().min(0),
    title: z.string().min(1, "Укажите должность"),
    intro: z.string().min(1, "Добавьте описание"),
    salary: z.string().min(1, "Укажите зарплату"),
    experience: z.string().min(1, "Укажите опыт"),
    requirements: z.array(wrappedString),
    conditions: z.array(wrappedString),
});

export type VacancyFormValues = z.infer<typeof vacancySchema>;

export function emptyVacancyValues(order = 0): VacancyFormValues {
    return {
        slug: "",
        order,
        title: "",
        intro: "",
        salary: "",
        experience: "",
        requirements: [],
        conditions: [],
    };
}

export function vacancyToFormValues(vacancy: Vacancy): VacancyFormValues {
    return {
        slug: vacancy.slug,
        order: vacancy.order,
        title: vacancy.title,
        intro: vacancy.intro,
        salary: vacancy.salary,
        experience: vacancy.experience,
        requirements: wrap(vacancy.requirements),
        conditions: wrap(vacancy.conditions),
    };
}

export function formValuesToVacancy(values: VacancyFormValues): Vacancy {
    return {
        slug: values.slug.trim(),
        order: values.order,
        title: values.title.trim(),
        intro: values.intro.trim(),
        salary: values.salary.trim(),
        experience: values.experience.trim(),
        requirements: unwrap(values.requirements),
        conditions: unwrap(values.conditions),
    };
}
