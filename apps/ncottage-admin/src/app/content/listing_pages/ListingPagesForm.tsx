"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ListingPages } from "@forge/shared";
import { TextField, TextareaField } from "@/components/form/fields";
import { RepeaterField } from "@/components/form/repeater-field";
import { StringListField } from "@/components/form/string-list-field";
import { Form } from "@/components/ui/form";
import {
    formValuesToListingPages,
    listingPagesSchema,
    listingPagesToFormValues,
    type ListingPagesFormValues,
} from "@/lib/settings-schema";
import { saveSettingAction } from "../actions";
import { SaveBar, Section } from "../form-parts";

type V = ListingPagesFormValues;

export function ListingPagesForm({ initial }: { initial: ListingPages }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(listingPagesSchema),
        defaultValues: listingPagesToFormValues(initial),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveSettingAction(
            "listing_pages",
            formValuesToListingPages(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Страницы-листинги сохранены");
        router.refresh();
    }

    return (
        <Form {...form} schema={listingPagesSchema}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl space-y-6"
            >
                <Section
                    title="Отзывы — метрики"
                    description="Счётчики в шапке страницы /reviews."
                >
                    <RepeaterField<V>
                        name="reviews.metrics"
                        addLabel="Добавить метрику"
                        emptyMessage="Метрик нет"
                        newItem={() => ({ value: "", label: "" })}
                        itemLabel={(i) =>
                            form.watch(`reviews.metrics.${i}.value`) ||
                            `Метрика ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <TextField<V>
                                    name={`reviews.metrics.${i}.value`}
                                    label="Значение"
                                />
                                <TextField<V>
                                    name={`reviews.metrics.${i}.label`}
                                    label="Подпись"
                                />
                            </div>
                        )}
                    />
                </Section>

                <Section
                    title="Сертификаты — что проверяем"
                    description="Карточки чек-листа на странице /certificates."
                >
                    <RepeaterField<V>
                        name="certificates.checks"
                        addLabel="Добавить пункт"
                        emptyMessage="Пунктов нет"
                        newItem={() => ({ title: "", text: "" })}
                        itemLabel={(i) =>
                            form.watch(`certificates.checks.${i}.title`) ||
                            `Пункт ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <TextField<V>
                                    name={`certificates.checks.${i}.title`}
                                    label="Заголовок"
                                />
                                <TextareaField<V>
                                    name={`certificates.checks.${i}.text`}
                                    label="Текст"
                                    rows={3}
                                />
                            </div>
                        )}
                    />
                </Section>

                <Section
                    title="Партнёры — принципы"
                    description="Пронумерованные принципы подбора на странице /partners."
                >
                    <StringListField<V>
                        name="partners.principles"
                        addLabel="Добавить принцип"
                        emptyMessage="Принципов нет"
                        itemNoun="Принцип"
                        multiline
                    />
                </Section>

                <SaveBar pending={pending} />
            </form>
        </Form>
    );
}
