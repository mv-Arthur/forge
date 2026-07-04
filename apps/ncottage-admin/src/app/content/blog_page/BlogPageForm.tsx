"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { BlogPage } from "@forge/shared";
import { TextareaField, TextField } from "@/components/form/fields";
import { Form } from "@/components/ui/form";
import {
    type BlogPageFormValues,
    blogPageSchema,
    blogPageToFormValues,
    formValuesToBlogPage,
} from "@/lib/settings-schema";
import { saveSettingAction } from "../actions";
import { SaveBar, Section } from "../form-parts";

type V = BlogPageFormValues;

export function BlogPageForm({ initial }: { initial: BlogPage }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(blogPageSchema),
        defaultValues: blogPageToFormValues(initial),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveSettingAction(
            "blog_page",
            formValuesToBlogPage(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Страница блога сохранена");
        router.refresh();
    }

    return (
        <Form {...form} schema={blogPageSchema}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl space-y-6"
            >
                <Section
                    title="Шапка"
                    description="Верхний блок страницы блога."
                >
                    <TextField<V> name="hero.eyebrow" label="Надзаголовок" />
                    <TextField<V> name="hero.title" label="Заголовок" />
                    <TextareaField<V>
                        name="hero.lead"
                        label="Подзаголовок"
                        rows={3}
                    />
                    <TextField<V>
                        name="hero.panelLabel"
                        label="Подпись панели тем"
                    />
                </Section>

                <Section
                    title="Гид покупателя"
                    description="Блок с рекомендуемой статьёй."
                >
                    <TextField<V>
                        name="featured.eyebrow"
                        label="Надзаголовок"
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField<V>
                            name="featured.title"
                            label="Заголовок"
                        />
                        <TextField<V>
                            name="featured.titleAccent"
                            label="Акцент заголовка"
                        />
                    </div>
                    <TextareaField<V>
                        name="featured.lead"
                        label="Подзаголовок"
                        rows={3}
                    />
                </Section>

                <Section
                    title="Все статьи"
                    description="Заголовок секции со списком статей."
                >
                    <TextField<V> name="list.eyebrow" label="Надзаголовок" />
                    <TextField<V> name="list.title" label="Заголовок" />
                    <TextareaField<V>
                        name="list.lead"
                        label="Подзаголовок"
                        rows={3}
                    />
                </Section>

                <Section
                    title="Призыв к действию"
                    description="Нижний блок с кнопкой консультации."
                >
                    <TextField<V> name="cta.eyebrow" label="Надзаголовок" />
                    <TextField<V> name="cta.title" label="Заголовок" />
                    <TextareaField<V>
                        name="cta.text"
                        label="Текст"
                        rows={3}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField<V>
                            name="cta.buttonLabel"
                            label="Подпись кнопки"
                        />
                        <TextField<V>
                            name="cta.buttonHref"
                            label="Ссылка кнопки"
                            placeholder="/contacts"
                        />
                    </div>
                </Section>

                <SaveBar pending={pending} />
            </form>
        </Form>
    );
}
