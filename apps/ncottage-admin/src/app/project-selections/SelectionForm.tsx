"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    PROJECT_FEATURES,
    PROJECT_LIVING_TYPES,
    PROJECT_STYLES,
    type ProjectSelection,
    SELECTION_GROUPS,
} from "@forge/shared";
import {
    CheckboxField,
    CheckboxGroupField,
    NumberField,
    SelectField,
    TextareaField,
    TextField,
} from "@/components/form/fields";
import { StringListField } from "@/components/form/string-list-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
    emptySelectionValues,
    formValuesToSelection,
    SELECTION_GROUP_LABELS,
    type SelectionFormValues,
    selectionSchema,
    selectionToFormValues,
} from "@/lib/selection-schema";
import { saveSelectionAction } from "./actions";

type V = SelectionFormValues;

const enumOptions = (values: readonly string[]) =>
    values.map((v) => ({ label: v, value: v }));

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

export function SelectionForm({
    initial,
    submitLabel,
}: {
    initial?: ProjectSelection;
    submitLabel: string;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(selectionSchema),
        defaultValues: initial
            ? selectionToFormValues(initial)
            : emptySelectionValues(),
    });
    const mode = form.watch("mode");

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveSelectionAction(
            initial?.slug ?? null,
            formValuesToSelection(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(initial ? "Подборка сохранена" : "Подборка создана");
        router.push("/project-selections");
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
                            placeholder="odnoetazhnye-doma"
                        />
                        <SelectField<V>
                            name="group"
                            label="Группа"
                            options={SELECTION_GROUPS.map((g) => ({
                                label: SELECTION_GROUP_LABELS[g] ?? g,
                                value: g,
                            }))}
                        />
                        <TextField<V> name="title" label="Заголовок (H1)" />
                        <TextField<V>
                            name="shortTitle"
                            label="Краткое название"
                        />
                    </div>
                    <TextareaField<V>
                        name="description"
                        label="Описание"
                        rows={3}
                    />
                    <TextareaField<V>
                        name="metaDescription"
                        label="SEO-описание (meta description)"
                        rows={2}
                    />
                </Section>

                <Section title="Фильтр проектов">
                    <SelectField<V>
                        name="mode"
                        label="Режим"
                        options={[
                            { label: "Все проекты", value: "all" },
                            { label: "По критериям", value: "match" },
                        ]}
                    />

                    {mode === "match" && (
                        <div className="space-y-4">
                            <CheckboxField<V>
                                name="matchAny"
                                label="Достаточно совпадения любого критерия (ИЛИ вместо И)"
                            />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <SelectField<V>
                                    name="livingType"
                                    label="Тип проживания"
                                    options={[
                                        { label: "— любой —", value: "any" },
                                        ...enumOptions(PROJECT_LIVING_TYPES),
                                    ]}
                                />
                                <SelectField<V>
                                    name="style"
                                    label="Стиль (точное совпадение)"
                                    options={[
                                        { label: "— любой —", value: "any" },
                                        ...enumOptions(PROJECT_STYLES),
                                    ]}
                                />
                                <NumberField<V>
                                    name="floors"
                                    label="Этажность (точно)"
                                />
                                <NumberField<V>
                                    name="areaMax"
                                    label="Площадь не более, м²"
                                />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Стиль из набора
                                </p>
                                <CheckboxGroupField<V>
                                    name="styleIn"
                                    options={enumOptions(PROJECT_STYLES)}
                                />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Все особенности из набора
                                </p>
                                <CheckboxGroupField<V>
                                    name="featuresAll"
                                    options={enumOptions(PROJECT_FEATURES)}
                                />
                            </div>
                            <StringListField<V>
                                name="descriptionIncludes"
                                label="Описание содержит (подстроки)"
                                addLabel="Добавить подстроку"
                                emptyMessage="Нет"
                                itemNoun="Подстрока"
                            />
                        </div>
                    )}
                </Section>

                <div className="sticky bottom-0 flex items-center gap-2 border-t bg-background/95 py-4 backdrop-blur">
                    <Button type="submit" disabled={pending}>
                        {pending ? "Сохранение…" : submitLabel}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/project-selections")}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </Form>
    );
}
