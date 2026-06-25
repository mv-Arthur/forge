"use client";

import { useEffect, useState } from "react";
import {
    type FieldArray,
    useFieldArray,
    useFormContext,
} from "react-hook-form";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { ArticleFormValues } from "@/lib/blog-schema";
import { type ArticleSummary, listArticleSummariesAction } from "./actions";

export function RelatedArticlesField({
    currentSlug,
}: {
    currentSlug?: string;
}) {
    const { control } = useFormContext<ArticleFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "relatedSlugs",
    });
    const [summaries, setSummaries] = useState<ArticleSummary[]>([]);

    useEffect(() => {
        listArticleSummariesAction().then(setSummaries);
    }, []);

    const selected = fields.map(
        (f) => (f as unknown as { value: string }).value
    );
    const titleFor = (slug: string) =>
        summaries.find((s) => s.slug === slug)?.title ?? slug;
    const options = summaries.filter(
        (s) => s.slug !== currentSlug && !selected.includes(s.slug)
    );

    return (
        <div className="space-y-3">
            <p className="text-sm font-medium">Похожие статьи</p>
            <div className="flex flex-wrap items-center gap-2">
                {fields.length === 0 && (
                    <span className="text-sm text-muted-foreground">
                        Не выбрано
                    </span>
                )}
                {fields.map((field, index) => {
                    const slug = (field as unknown as { value: string }).value;
                    return (
                        <Badge
                            key={field.id}
                            variant="secondary"
                            className="gap-1 py-1 pr-1 pl-2"
                        >
                            {titleFor(slug)}
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                aria-label="Убрать"
                                className="rounded-full p-0.5 hover:bg-background/60"
                            >
                                <X className="size-3" />
                            </button>
                        </Badge>
                    );
                })}
            </div>
            <Select
                value=""
                onValueChange={(slug) => {
                    if (slug) {
                        append({ value: slug } as FieldArray<
                            ArticleFormValues,
                            "relatedSlugs"
                        >);
                    }
                }}
            >
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Добавить статью…" />
                </SelectTrigger>
                <SelectContent>
                    {options.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            Нет доступных статей
                        </div>
                    ) : (
                        options.map((o) => (
                            <SelectItem key={o.slug} value={o.slug}>
                                {o.title}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}
