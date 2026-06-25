"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Article } from "@forge/shared";
import { TextareaField, TextField } from "@/components/form/fields";
import { RepeaterField } from "@/components/form/repeater-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
    type ArticleFormValues,
    articleSchema,
    articleToFormValues,
    emptyArticleValues,
    formValuesToArticle,
} from "@/lib/blog-schema";
import { saveArticleAction } from "./actions";
import { RelatedArticlesField } from "./RelatedArticlesField";

type V = ArticleFormValues;

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    );
}

export function ArticleForm({
    initial,
    submitLabel,
}: {
    initial?: Article;
    submitLabel: string;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(articleSchema),
        defaultValues: initial
            ? articleToFormValues(initial)
            : emptyArticleValues(),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveArticleAction(
            initial?.slug ?? null,
            formValuesToArticle(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(initial ? "Статья сохранена" : "Статья создана");
        router.push("/blog");
        router.refresh();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl space-y-6"
            >
                <Section title="Основное">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField<V>
                            name="slug"
                            label="Slug"
                            placeholder="kak-vybrat-tehnologiyu-doma"
                        />
                        <TextField<V>
                            name="category"
                            label="Категория"
                            placeholder="Технологии"
                        />
                        <TextField<V>
                            name="date"
                            label="Дата"
                            type="date"
                        />
                        <TextField<V>
                            name="readTime"
                            label="Время чтения"
                            placeholder="8 минут"
                        />
                    </div>
                    <TextField<V>
                        name="title"
                        label="Заголовок"
                        placeholder="Как выбрать технологию строительства дома"
                    />
                    <TextareaField<V>
                        name="description"
                        label="Описание (для карточки и SEO)"
                        rows={3}
                    />
                    <TextareaField<V>
                        name="heroNote"
                        label="Главная мысль (hero)"
                        rows={3}
                    />
                </Section>

                <Section title="Коротко">
                    <RepeaterField<V>
                        name="highlights"
                        addLabel="Добавить тезис"
                        emptyMessage="Тезисов нет"
                        newItem={() => ({ value: "" })}
                        itemLabel={(i) => `Тезис ${i + 1}`}
                        renderItem={(i) => (
                            <TextareaField<V>
                                name={`highlights.${i}.value`}
                                rows={2}
                            />
                        )}
                    />
                </Section>

                <Section title="Разделы статьи">
                    <RepeaterField<V>
                        name="sections"
                        addLabel="Добавить раздел"
                        emptyMessage="Разделов нет"
                        newItem={() => ({ title: "", body: [], list: [] })}
                        itemLabel={(i) =>
                            form.watch(`sections.${i}.title`) ||
                            `Раздел ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <TextField<V>
                                    name={`sections.${i}.title`}
                                    label="Заголовок раздела"
                                />
                                <RepeaterField<V>
                                    name={`sections.${i}.body`}
                                    label="Абзацы"
                                    addLabel="Добавить абзац"
                                    emptyMessage="Абзацев нет"
                                    newItem={() => ({ value: "" })}
                                    itemLabel={(j) => `Абзац ${j + 1}`}
                                    renderItem={(j) => (
                                        <TextareaField<V>
                                            name={`sections.${i}.body.${j}.value`}
                                            rows={4}
                                        />
                                    )}
                                />
                                <RepeaterField<V>
                                    name={`sections.${i}.list`}
                                    label="Список (опц.)"
                                    addLabel="Добавить пункт"
                                    emptyMessage="Пунктов нет"
                                    newItem={() => ({ value: "" })}
                                    itemLabel={(j) => `Пункт ${j + 1}`}
                                    renderItem={(j) => (
                                        <TextField<V>
                                            name={`sections.${i}.list.${j}.value`}
                                        />
                                    )}
                                />
                            </div>
                        )}
                    />
                </Section>

                <Section title="Чек-лист">
                    <RepeaterField<V>
                        name="checklist"
                        addLabel="Добавить пункт"
                        emptyMessage="Пунктов нет"
                        newItem={() => ({ value: "" })}
                        itemLabel={(i) => `Пункт ${i + 1}`}
                        renderItem={(i) => (
                            <TextField<V> name={`checklist.${i}.value`} />
                        )}
                    />
                </Section>

                <Section title="Похожие статьи">
                    <RelatedArticlesField currentSlug={initial?.slug} />
                </Section>

                <div className="sticky bottom-0 flex items-center gap-2 border-t bg-background/95 py-4 backdrop-blur">
                    <Button type="submit" disabled={pending}>
                        {pending ? "Сохранение…" : submitLabel}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/blog")}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </Form>
    );
}
