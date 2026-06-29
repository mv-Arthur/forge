"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Vacancy } from "@forge/shared";
import {
    NumberField,
    TextareaField,
    TextField,
} from "@/components/form/fields";
import { StringListField } from "@/components/form/string-list-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
    emptyVacancyValues,
    formValuesToVacancy,
    type VacancyFormValues,
    vacancySchema,
    vacancyToFormValues,
} from "@/lib/vacancy-schema";
import { saveVacancyAction } from "./actions";

type V = VacancyFormValues;

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

export function VacancyForm({
    initial,
    submitLabel,
    nextOrder = 0,
}: {
    initial?: Vacancy;
    submitLabel: string;
    nextOrder?: number;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(vacancySchema),
        defaultValues: initial
            ? vacancyToFormValues(initial)
            : emptyVacancyValues(nextOrder),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveVacancyAction(
            initial?.slug ?? null,
            formValuesToVacancy(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(initial ? "Вакансия сохранена" : "Вакансия создана");
        router.push("/vacancies");
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
                            placeholder="arhitektor"
                        />
                        <TextField<V>
                            name="title"
                            label="Должность"
                            placeholder="Архитектор"
                        />
                        <TextField<V>
                            name="salary"
                            label="Зарплата"
                            placeholder="от 100 000 ₽"
                        />
                        <TextField<V>
                            name="experience"
                            label="Опыт"
                            placeholder="3–6 лет"
                        />
                        <NumberField<V>
                            name="order"
                            label="Порядок вывода"
                        />
                    </div>
                    <TextareaField<V>
                        name="intro"
                        label="Описание"
                        rows={3}
                    />
                </Section>

                <Section title="Требования">
                    <StringListField<V>
                        name="requirements"
                        addLabel="Добавить требование"
                        emptyMessage="Требований нет"
                        itemNoun="Требование"
                        multiline
                        rows={2}
                    />
                </Section>

                <Section title="Условия">
                    <StringListField<V>
                        name="conditions"
                        addLabel="Добавить условие"
                        emptyMessage="Условий нет"
                        itemNoun="Условие"
                        multiline
                        rows={2}
                    />
                </Section>

                <div className="sticky bottom-0 flex items-center gap-2 border-t bg-background/95 py-4 backdrop-blur">
                    <Button type="submit" disabled={pending}>
                        {pending ? "Сохранение…" : submitLabel}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/vacancies")}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </Form>
    );
}
