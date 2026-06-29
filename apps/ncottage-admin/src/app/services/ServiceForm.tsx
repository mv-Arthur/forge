"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Service } from "@forge/shared";
import {
    CheckboxGroupField,
    NumberField,
    TextareaField,
    TextField,
} from "@/components/form/fields";
import { RepeaterField } from "@/components/form/repeater-field";
import { StringListField } from "@/components/form/string-list-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
    emptyServiceValues,
    formValuesToService,
    serviceSchema,
    serviceToFormValues,
    type ServiceFormValues,
} from "@/lib/service-schema";
import { saveServiceAction } from "./actions";

type V = ServiceFormValues;

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

export function ServiceForm({
    initial,
    submitLabel,
    nextOrder,
    serviceOptions,
    scenarioOptions,
}: {
    initial?: Service;
    submitLabel: string;
    nextOrder: number;
    serviceOptions: Option[];
    scenarioOptions: Option[];
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(serviceSchema),
        defaultValues: initial
            ? serviceToFormValues(initial)
            : emptyServiceValues(nextOrder),
    });

    const relatedOptions = serviceOptions.filter(
        (o) => o.value !== initial?.slug
    );

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveServiceAction(
            initial?.slug ?? null,
            formValuesToService(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(initial ? "Услуга сохранена" : "Услуга создана");
        router.push("/services");
        router.refresh();
    }

    return (
        <Form {...form} schema={serviceSchema}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl space-y-6"
            >
                <Section title="Основное">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField<V>
                            name="slug"
                            label="Slug"
                            placeholder="design"
                        />
                        <NumberField<V>
                            name="order"
                            label="Порядок вывода"
                        />
                        <TextField<V>
                            name="shortTitle"
                            label="Короткий заголовок"
                            placeholder="Проектирование"
                        />
                        <TextField<V>
                            name="cta"
                            label="CTA"
                            placeholder="Обсудить проект дома"
                        />
                    </div>
                    <TextField<V>
                        name="title"
                        label="Заголовок"
                        placeholder="Индивидуальное проектирование домов"
                    />
                    <TextField<V>
                        name="sourceTitle"
                        label="Исходный заголовок (sourceTitle)"
                    />
                    <TextField<V>
                        name="eyebrow"
                        label="Надзаголовок (eyebrow)"
                    />
                    <TextField<V>
                        name="image"
                        label="Изображение (URL)"
                        placeholder="/images/projects/alaster.jpg"
                    />
                    <TextareaField<V>
                        name="description"
                        label="Описание (карточка / SEO)"
                        rows={2}
                    />
                    <TextareaField<V> name="lead" label="Лид" rows={2} />
                    <TextareaField<V>
                        name="summary"
                        label="Summary"
                        rows={3}
                    />
                </Section>

                <Section
                    title="Навигатор и обзор"
                    description="Тезисы, состав работ, этапы и преимущества."
                >
                    <StringListField<V>
                        name="highlights"
                        label="Highlights"
                        addLabel="Добавить тезис"
                        itemNoun="Тезис"
                        multiline
                        rows={2}
                    />
                    <StringListField<V>
                        name="scopes"
                        label="Scopes (состав)"
                        addLabel="Добавить пункт"
                    />
                    <StringListField<V>
                        name="stages"
                        label="Stages (этапы)"
                        addLabel="Добавить этап"
                        multiline
                        rows={2}
                    />
                    <StringListField<V>
                        name="advantages"
                        label="Advantages (преимущества)"
                        addLabel="Добавить преимущество"
                        multiline
                        rows={2}
                    />
                </Section>

                <Section
                    title="Состав и границы"
                    description="Блоки детальной страницы: кому подходит, что входит / не входит, факторы цены, результат."
                >
                    <StringListField<V>
                        name="fitFor"
                        label="Подходит, если (fitFor)"
                        addLabel="Добавить пункт"
                        multiline
                        rows={2}
                    />
                    <StringListField<V>
                        name="includes"
                        label="Что входит (includes)"
                        addLabel="Добавить пункт"
                        multiline
                        rows={2}
                    />
                    <StringListField<V>
                        name="notIncluded"
                        label="Что не входит (notIncluded)"
                        addLabel="Добавить пункт"
                        multiline
                        rows={2}
                    />
                    <StringListField<V>
                        name="priceFactors"
                        label="Факторы цены (priceFactors)"
                        addLabel="Добавить фактор"
                    />
                    <StringListField<V>
                        name="deliverables"
                        label="Результат (deliverables)"
                        addLabel="Добавить пункт"
                        multiline
                        rows={2}
                    />
                    <StringListField<V>
                        name="quickFacts"
                        label="Быстрые факты (quickFacts)"
                        addLabel="Добавить факт"
                        multiline
                        rows={2}
                    />
                </Section>

                <Section
                    title="Детальная страница"
                    description="Инженерный разбор, форматы работы и проверки перед расчётом."
                >
                    <TextareaField<V>
                        name="detailPain"
                        label="Боль (detailPain, опц.)"
                        rows={3}
                    />
                    <TextareaField<V>
                        name="detailPromise"
                        label="Обещание (detailPromise, опц.)"
                        rows={3}
                    />
                    <TextareaField<V>
                        name="detailNextStep"
                        label="Следующий шаг (detailNextStep, опц.)"
                        rows={2}
                    />
                    <TextField<V>
                        name="detailCta"
                        label="CTA детальной (detailCta, опц.)"
                    />
                    <StringListField<V>
                        name="detailChecks"
                        label="Проверим перед расчётом (detailChecks)"
                        addLabel="Добавить проверку"
                        multiline
                        rows={2}
                    />
                    <RepeaterField<V>
                        name="detailVariants"
                        label="Форматы работы (detailVariants)"
                        addLabel="Добавить формат"
                        emptyMessage="Форматов нет"
                        newItem={() => ({ title: "", description: "" })}
                        itemLabel={(i) =>
                            form.watch(`detailVariants.${i}.title`) ||
                            `Формат ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <TextField<V>
                                    name={`detailVariants.${i}.title`}
                                    label="Заголовок"
                                />
                                <TextareaField<V>
                                    name={`detailVariants.${i}.description`}
                                    label="Описание"
                                    rows={3}
                                />
                            </div>
                        )}
                    />
                </Section>

                <Section
                    title="SEO-блок"
                    description="Цена, сроки, типовые задачи и FAQ (раньше — SERVICE_SEO_CONTENT)."
                >
                    <TextareaField<V>
                        name="seoContent.priceNote"
                        label="Заметка о цене (priceNote)"
                        rows={2}
                    />
                    <TextareaField<V>
                        name="seoContent.timingLead"
                        label="Сроки — вводный текст (timingLead)"
                        rows={2}
                    />
                    <RepeaterField<V>
                        name="seoContent.timing"
                        label="Сроки (timing)"
                        addLabel="Добавить срок"
                        emptyMessage="Сроков нет"
                        newItem={() => ({
                            label: "",
                            value: "",
                            description: "",
                        })}
                        itemLabel={(i) =>
                            form.watch(`seoContent.timing.${i}.label`) ||
                            `Срок ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <TextField<V>
                                        name={`seoContent.timing.${i}.label`}
                                        label="Подпись"
                                    />
                                    <TextField<V>
                                        name={`seoContent.timing.${i}.value`}
                                        label="Значение"
                                    />
                                </div>
                                <TextareaField<V>
                                    name={`seoContent.timing.${i}.description`}
                                    label="Описание"
                                    rows={2}
                                />
                            </div>
                        )}
                    />
                    <TextareaField<V>
                        name="seoContent.examplesLead"
                        label="Примеры — вводный текст (examplesLead)"
                        rows={2}
                    />
                    <RepeaterField<V>
                        name="seoContent.examples"
                        label="Типовые задачи (examples)"
                        addLabel="Добавить пример"
                        emptyMessage="Примеров нет"
                        newItem={() => ({
                            title: "",
                            description: "",
                            result: "",
                        })}
                        itemLabel={(i) =>
                            form.watch(`seoContent.examples.${i}.title`) ||
                            `Пример ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <TextField<V>
                                    name={`seoContent.examples.${i}.title`}
                                    label="Заголовок"
                                />
                                <TextareaField<V>
                                    name={`seoContent.examples.${i}.description`}
                                    label="Описание"
                                    rows={2}
                                />
                                <TextareaField<V>
                                    name={`seoContent.examples.${i}.result`}
                                    label="Результат"
                                    rows={2}
                                />
                            </div>
                        )}
                    />
                    <RepeaterField<V>
                        name="seoContent.faq"
                        label="FAQ"
                        addLabel="Добавить вопрос"
                        emptyMessage="Вопросов нет"
                        newItem={() => ({ question: "", answer: "" })}
                        itemLabel={(i) =>
                            form.watch(`seoContent.faq.${i}.question`) ||
                            `Вопрос ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <TextField<V>
                                    name={`seoContent.faq.${i}.question`}
                                    label="Вопрос"
                                />
                                <TextareaField<V>
                                    name={`seoContent.faq.${i}.answer`}
                                    label="Ответ"
                                    rows={3}
                                />
                            </div>
                        )}
                    />
                </Section>

                <Section
                    title="Связи"
                    description="Смежные услуги и сценарии навигатора (мягкие ссылки по slug)."
                >
                    <CheckboxGroupField<V>
                        name="relatedSlugs"
                        label="Смежные услуги (relatedSlugs)"
                        options={relatedOptions}
                    />
                    <CheckboxGroupField<V>
                        name="scenarioSlugs"
                        label="Сценарии (scenarioSlugs)"
                        options={scenarioOptions}
                    />
                </Section>

                <Section title="SEO">
                    <TextField<V>
                        name="seoTitle"
                        label="SEO-заголовок"
                        placeholder="Необязательно — по умолчанию из контента"
                    />
                    <TextareaField<V>
                        name="seoDescription"
                        label="SEO-описание"
                        rows={2}
                        placeholder="Необязательно — по умолчанию из описания"
                    />
                </Section>

                <div className="sticky bottom-0 flex items-center gap-2 border-t bg-background/95 py-4 backdrop-blur">
                    <Button type="submit" disabled={pending}>
                        {pending ? "Сохранение…" : submitLabel}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/services")}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </Form>
    );
}
