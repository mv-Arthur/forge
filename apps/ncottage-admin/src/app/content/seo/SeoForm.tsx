"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Seo, SeoIndexKey } from "@forge/shared";
import { SEO_INDEX_KEYS } from "@forge/shared";
import { TextareaField, TextField } from "@/components/form/fields";
import { Form } from "@/components/ui/form";
import {
    type SeoFormValues,
    formValuesToSeo,
    seoSchema,
    seoToFormValues,
} from "@/lib/settings-schema";
import { saveSettingAction } from "../actions";
import { SaveBar, Section } from "../form-parts";

type V = SeoFormValues;

const INDEX_LABELS: Record<SeoIndexKey, string> = {
    blog: "Блог (/blog)",
    services: "Услуги (/services)",
    projects: "Проекты (/projects)",
    promos: "Акции (/promos)",
    reviews: "Отзывы (/reviews)",
    faq: "Вопрос-ответ (/faq)",
    certificates: "Сертификаты (/certificates)",
    partners: "Партнёры (/partners)",
    vacancies: "Вакансии (/vacancies)",
    "project-selections": "Подборки (/project-selections)",
};

export function SeoForm({ initial }: { initial: Seo }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(seoSchema),
        defaultValues: seoToFormValues(initial),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveSettingAction("seo", formValuesToSeo(values));
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("SEO-настройки сохранены");
        router.refresh();
    }

    return (
        <Form {...form} schema={seoSchema}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl space-y-6"
            >
                <Section
                    title="Общие настройки"
                    description="Базовый адрес, дефолтные мета-теги и Open Graph."
                >
                    <TextField<V>
                        name="baseUrl"
                        label="Базовый URL сайта"
                        placeholder="https://ncottage.ru"
                    />
                    <TextField<V> name="siteName" label="Название сайта" />
                    <TextField<V>
                        name="defaultTitle"
                        label="Заголовок по умолчанию"
                    />
                    <TextareaField<V>
                        name="defaultDescription"
                        label="Описание по умолчанию"
                        rows={3}
                    />
                    <TextField<V>
                        name="ogImageUrl"
                        label="Open Graph изображение (URL)"
                        placeholder="https://… (необязательно)"
                    />
                </Section>

                <Section
                    title="Листинговые страницы"
                    description="Title и description страниц-списков, у которых нет своей сущности."
                >
                    {SEO_INDEX_KEYS.map((key) => (
                        <div
                            key={key}
                            className="space-y-4 rounded-md border p-4"
                        >
                            <p className="text-sm font-medium">
                                {INDEX_LABELS[key]}
                            </p>
                            <TextField<V>
                                name={`indexes.${key}.title`}
                                label="Заголовок"
                            />
                            <TextareaField<V>
                                name={`indexes.${key}.description`}
                                label="Описание"
                                rows={2}
                            />
                        </div>
                    ))}
                </Section>

                <SaveBar pending={pending} />
            </form>
        </Form>
    );
}
