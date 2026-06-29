import type { Article, ArticleSection } from "@forge/shared";
import { z } from "zod";

// Form schema mirroring the shared Article contract. String arrays are wrapped
// as { value } so useFieldArray has stable item keys; the converters unwrap them
// and drop the optional section `list` when empty (matching the stored shape).

const wrappedString = z.object({ value: z.string().min(1, "Не пусто") });

const sectionSchema = z.object({
    title: z.string().min(1, "Укажите заголовок"),
    body: z.array(wrappedString),
    list: z.array(wrappedString),
});

export const articleSchema = z.object({
    slug: z
        .string()
        .min(1, "Укажите slug")
        .regex(/^[a-z0-9-]+$/, "Только строчные латиница, цифры и дефис"),
    title: z.string().min(1, "Укажите заголовок"),
    description: z.string().min(1, "Добавьте описание"),
    category: z.string().min(1, "Укажите категорию"),
    date: z.string().min(1, "Укажите дату"),
    readTime: z.string().min(1, "Укажите время чтения"),
    heroNote: z.string().min(1, "Добавьте главную мысль"),
    image: z.string(),
    highlights: z.array(wrappedString),
    sections: z.array(sectionSchema),
    checklist: z.array(wrappedString),
    relatedSlugs: z.array(wrappedString),
    seoTitle: z.string(),
    seoDescription: z.string(),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;

const wrap = (values: string[]) => values.map((value) => ({ value }));
const unwrap = (items: { value: string }[]) =>
    items.map((i) => i.value.trim()).filter(Boolean);

export function emptyArticleValues(): ArticleFormValues {
    return {
        slug: "",
        title: "",
        description: "",
        category: "",
        date: "",
        readTime: "",
        heroNote: "",
        image: "",
        highlights: [],
        sections: [],
        checklist: [],
        relatedSlugs: [],
        seoTitle: "",
        seoDescription: "",
    };
}

export function articleToFormValues(article: Article): ArticleFormValues {
    return {
        slug: article.slug,
        title: article.title,
        description: article.description,
        category: article.category,
        date: article.date,
        readTime: article.readTime,
        heroNote: article.heroNote,
        image: article.image ?? "",
        highlights: wrap(article.highlights),
        sections: article.sections.map((s) => ({
            title: s.title,
            body: wrap(s.body),
            list: wrap(s.list ?? []),
        })),
        checklist: wrap(article.checklist),
        relatedSlugs: wrap(article.relatedSlugs),
        seoTitle: article.seoTitle ?? "",
        seoDescription: article.seoDescription ?? "",
    };
}

export function formValuesToArticle(values: ArticleFormValues): Article {
    return {
        slug: values.slug.trim(),
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category.trim(),
        date: values.date.trim(),
        readTime: values.readTime.trim(),
        heroNote: values.heroNote.trim(),
        image: values.image.trim(),
        highlights: unwrap(values.highlights),
        sections: values.sections.map((s): ArticleSection => {
            const list = unwrap(s.list);
            return {
                title: s.title.trim(),
                body: unwrap(s.body),
                ...(list.length ? { list } : {}),
            };
        }),
        checklist: unwrap(values.checklist),
        relatedSlugs: unwrap(values.relatedSlugs),
        seoTitle: values.seoTitle.trim(),
        seoDescription: values.seoDescription.trim(),
    };
}
