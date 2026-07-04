import {
    PROJECT_FEATURES,
    PROJECT_LIVING_TYPES,
    PROJECT_STYLES,
    type ProjectSelection,
    SELECTION_GROUPS,
    type SelectionFilter,
} from "@forge/shared";
import { z } from "zod";

export const SELECTION_GROUP_LABELS: Record<string, string> = {
    purpose: "Назначение",
    floors: "Этажность",
    area: "Площадь",
    features: "Особенности",
    styles: "Стили",
};

const wrappedString = z.object({ value: z.string().min(1, "Не пусто") });

// Опциональные селекты используют сентинел "any" (Radix не допускает "" value).
export const selectionSchema = z.object({
    slug: z
        .string()
        .min(1, "Укажите slug")
        .regex(/^[a-z0-9-]+$/, "Только строчные латиница, цифры и дефис"),
    group: z.enum(SELECTION_GROUPS),
    title: z.string().min(1, "Укажите заголовок"),
    shortTitle: z.string().min(1, "Укажите краткое название"),
    description: z.string().min(1, "Добавьте описание"),
    metaDescription: z.string().min(1, "Добавьте SEO-описание"),
    mode: z.enum(["all", "match"]),
    matchAny: z.boolean(),
    livingType: z.enum(["any", ...PROJECT_LIVING_TYPES]),
    floors: z.number({ message: "Число" }).int().positive().optional(),
    areaMax: z.number({ message: "Число" }).int().positive().optional(),
    style: z.enum(["any", ...PROJECT_STYLES]),
    styleIn: z.array(z.enum(PROJECT_STYLES)),
    featuresAll: z.array(z.enum(PROJECT_FEATURES)),
    descriptionIncludes: z.array(wrappedString),
});

export type SelectionFormValues = z.infer<typeof selectionSchema>;

export function emptySelectionValues(): SelectionFormValues {
    return {
        slug: "",
        group: "purpose",
        title: "",
        shortTitle: "",
        description: "",
        metaDescription: "",
        mode: "match",
        matchAny: false,
        livingType: "any",
        floors: undefined,
        areaMax: undefined,
        style: "any",
        styleIn: [],
        featuresAll: [],
        descriptionIncludes: [],
    };
}

export function selectionToFormValues(
    selection: ProjectSelection
): SelectionFormValues {
    const f = selection.filter;
    return {
        slug: selection.slug,
        group: selection.group,
        title: selection.title,
        shortTitle: selection.shortTitle,
        description: selection.description,
        metaDescription: selection.metaDescription,
        mode: f.mode,
        matchAny: f.matchAny ?? false,
        livingType: f.livingType ?? "any",
        floors: f.floors,
        areaMax: f.areaMax,
        style: f.style ?? "any",
        styleIn: f.styleIn ?? [],
        featuresAll: f.featuresAll ?? [],
        descriptionIncludes: (f.descriptionIncludes ?? []).map((value) => ({
            value,
        })),
    };
}

export function formValuesToSelection(
    values: SelectionFormValues
): ProjectSelection {
    let filter: SelectionFilter;
    if (values.mode === "all") {
        filter = { mode: "all" };
    } else {
        const descriptionIncludes = values.descriptionIncludes
            .map((i) => i.value.trim())
            .filter(Boolean);
        filter = {
            mode: "match",
            ...(values.matchAny ? { matchAny: true } : {}),
            ...(values.livingType !== "any"
                ? { livingType: values.livingType }
                : {}),
            ...(values.floors !== undefined ? { floors: values.floors } : {}),
            ...(values.areaMax !== undefined
                ? { areaMax: values.areaMax }
                : {}),
            ...(values.style !== "any" ? { style: values.style } : {}),
            ...(values.styleIn.length ? { styleIn: values.styleIn } : {}),
            ...(values.featuresAll.length
                ? { featuresAll: values.featuresAll }
                : {}),
            ...(descriptionIncludes.length ? { descriptionIncludes } : {}),
        };
    }
    return {
        slug: values.slug.trim(),
        group: values.group,
        title: values.title.trim(),
        shortTitle: values.shortTitle.trim(),
        description: values.description.trim(),
        metaDescription: values.metaDescription.trim(),
        filter,
    };
}
