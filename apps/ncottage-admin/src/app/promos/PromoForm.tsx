"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Promo } from "@forge/shared";
import { TextareaField, TextField } from "@/components/form/fields";
import { StringListField } from "@/components/form/string-list-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
    emptyPromoValues,
    formValuesToPromo,
    type PromoFormValues,
    promoSchema,
    promoToFormValues,
} from "@/lib/promo-schema";
import { savePromoAction } from "./actions";

type V = PromoFormValues;

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

export function PromoForm({
    initial,
    submitLabel,
}: {
    initial?: Promo;
    submitLabel: string;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(promoSchema),
        defaultValues: initial ? promoToFormValues(initial) : emptyPromoValues(),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await savePromoAction(
            initial?.slug ?? null,
            formValuesToPromo(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(initial ? "Акция сохранена" : "Акция создана");
        router.push("/promos");
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
                            placeholder="frame-houses-special-price"
                        />
                        <TextField<V>
                            name="shortTitle"
                            label="Краткое название"
                            placeholder="Каркасные дома"
                        />
                    </div>
                    <TextField<V> name="title" label="Заголовок" />
                    <TextField<V> name="eyebrow" label="Надзаголовок" />
                    <TextareaField<V>
                        name="lead"
                        label="Вступление"
                        rows={3}
                    />
                    <TextField<V>
                        name="projectsHref"
                        label="Ссылка на проекты"
                        placeholder="/projects/frame"
                    />
                </Section>

                <Section title="Цена">
                    <TextField<V>
                        name="price"
                        label="Цена"
                        placeholder="от 20 000 ₽/м²"
                    />
                    <TextField<V> name="priceNote" label="Подпись цены" />
                    <TextareaField<V>
                        name="period"
                        label="Примечание о сроках"
                        rows={2}
                    />
                </Section>

                <Section title="Комплектация">
                    <StringListField<V>
                        name="includes"
                        addLabel="Добавить пункт"
                        emptyMessage="Пунктов нет"
                    />
                </Section>

                <Section title="Условия">
                    <StringListField<V>
                        name="terms"
                        addLabel="Добавить условие"
                        emptyMessage="Условий нет"
                        itemNoun="Условие"
                    />
                </Section>

                <Section title="Описание">
                    <StringListField<V>
                        name="details"
                        addLabel="Добавить абзац"
                        emptyMessage="Абзацев нет"
                        itemNoun="Абзац"
                        multiline
                        rows={4}
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
                        onClick={() => router.push("/promos")}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </Form>
    );
}
