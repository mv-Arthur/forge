"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ServiceScenario } from "@forge/shared";
import {
    CheckboxGroupField,
    NumberField,
    TextareaField,
    TextField,
} from "@/components/form/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
    emptyScenarioValues,
    formValuesToScenario,
    scenarioToFormValues,
    serviceScenarioSchema,
    type ServiceScenarioFormValues,
} from "@/lib/service-scenario-schema";
import { saveScenarioAction } from "./actions";

type V = ServiceScenarioFormValues;

interface Option {
    value: string;
    label: string;
}

function Section({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    );
}

export function ScenarioForm({
    initial,
    submitLabel,
    nextOrder,
    serviceOptions,
}: {
    initial?: ServiceScenario;
    submitLabel: string;
    nextOrder: number;
    serviceOptions: Option[];
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(serviceScenarioSchema),
        defaultValues: initial
            ? scenarioToFormValues(initial)
            : emptyScenarioValues(nextOrder),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveScenarioAction(
            initial?.slug ?? null,
            formValuesToScenario(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(initial ? "Сценарий сохранён" : "Сценарий создан");
        router.push("/service-scenarios");
        router.refresh();
    }

    return (
        <Form {...form} schema={serviceScenarioSchema}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl space-y-6"
            >
                <Section title="Основное">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField<V>
                            name="slug"
                            label="Slug"
                            placeholder="land-plot"
                        />
                        <NumberField<V>
                            name="order"
                            label="Порядок вывода"
                        />
                    </div>
                    <TextField<V>
                        name="title"
                        label="Заголовок"
                        placeholder="Есть участок"
                    />
                    <TextareaField<V>
                        name="description"
                        label="Описание"
                        rows={2}
                    />
                    <TextField<V>
                        name="questionLabel"
                        label="Вопрос подбора (questionLabel)"
                    />
                    <TextareaField<V>
                        name="nextStep"
                        label="Следующий шаг (nextStep)"
                        rows={2}
                    />
                    <TextareaField<V>
                        name="pain"
                        label="Боль (pain, опц.)"
                        rows={2}
                    />
                    <TextareaField<V>
                        name="promise"
                        label="Обещание (promise, опц.)"
                        rows={2}
                    />
                    <TextareaField<V>
                        name="outcome"
                        label="Результат (outcome, опц.)"
                        rows={2}
                    />
                    <TextField<V> name="cta" label="CTA (опц.)" />
                </Section>

                <Section
                    title="Услуги сценария"
                    description="Мягкие ссылки по slug. Primary / next / optional задают группировку «персонального маршрута»; serviceSlugs — общий набор для фильтра карточек."
                >
                    <CheckboxGroupField<V>
                        name="serviceSlugs"
                        label="Все услуги сценария (serviceSlugs)"
                        options={serviceOptions}
                    />
                    <CheckboxGroupField<V>
                        name="primaryServiceSlugs"
                        label="Рекомендуем начать (primary)"
                        options={serviceOptions}
                    />
                    <CheckboxGroupField<V>
                        name="nextServiceSlugs"
                        label="Следующий этап (next)"
                        options={serviceOptions}
                    />
                    <CheckboxGroupField<V>
                        name="optionalServiceSlugs"
                        label="Можно позже (optional)"
                        options={serviceOptions}
                    />
                </Section>

                <Section
                    title="Персональный маршрут (план)"
                    description="Копия профиля сценария: заголовки, контекст, изображение и тексты трёх этапов плана."
                >
                    <TextField<V>
                        name="plan.title"
                        label="Заголовок плана"
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField<V>
                            name="plan.resultLabel"
                            label="Подпись результата"
                        />
                        <TextField<V>
                            name="plan.image"
                            label="Изображение (URL)"
                        />
                        <TextField<V>
                            name="plan.visualTitle"
                            label="Заголовок контекста"
                        />
                        <TextField<V>
                            name="plan.startLabel"
                            label="Подпись «Сначала»"
                        />
                    </div>
                    <TextareaField<V>
                        name="plan.visualCaption"
                        label="Подпись контекста"
                        rows={2}
                    />
                    <TextareaField<V>
                        name="plan.startText"
                        label="Текст «Сначала» (опц.)"
                        rows={2}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField<V>
                            name="plan.nextLabel"
                            label="Подпись «Затем»"
                        />
                        <TextField<V>
                            name="plan.optionalLabel"
                            label="Подпись «Если нужно»"
                        />
                    </div>
                    <TextareaField<V>
                        name="plan.nextText"
                        label="Текст «Затем»"
                        rows={2}
                    />
                    <TextareaField<V>
                        name="plan.optionalText"
                        label="Текст «Если нужно»"
                        rows={2}
                    />
                    <TextareaField<V>
                        name="plan.ctaText"
                        label="Текст призыва (ctaText)"
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
                        onClick={() => router.push("/service-scenarios")}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </Form>
    );
}
