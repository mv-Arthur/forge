"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Navigation } from "@forge/shared";
import { CheckboxField, TextField } from "@/components/form/fields";
import { RepeaterField } from "@/components/form/repeater-field";
import { Form } from "@/components/ui/form";
import {
    formValuesToNav,
    type NavFormValues,
    navSchema,
    navToFormValues,
} from "@/lib/settings-schema";
import { saveSettingAction } from "../actions";
import { Section, SaveBar } from "../form-parts";

type V = NavFormValues;

export function NavForm({ initial }: { initial: Navigation }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(navSchema),
        defaultValues: navToFormValues(initial),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveSettingAction("nav", formValuesToNav(values));
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Навигация сохранена");
        router.refresh();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl space-y-6"
            >
                <Section
                    title="Пункты меню"
                    description="Верхнее меню сайта. У пункта могут быть выпадающие подпункты."
                >
                    <RepeaterField<V>
                        name="items"
                        addLabel="Добавить пункт"
                        emptyMessage="Пунктов нет"
                        newItem={() => ({
                            label: "",
                            href: "",
                            badge: false,
                            children: [],
                        })}
                        itemLabel={(i) =>
                            form.watch(`items.${i}.label`) || `Пункт ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <TextField<V>
                                        name={`items.${i}.label`}
                                        label="Название"
                                    />
                                    <TextField<V>
                                        name={`items.${i}.href`}
                                        label="Ссылка"
                                        placeholder="/projects"
                                    />
                                </div>
                                <CheckboxField<V>
                                    name={`items.${i}.badge`}
                                    label="Бейдж «Акция»"
                                />
                                <RepeaterField<V>
                                    name={`items.${i}.children`}
                                    label="Подпункты"
                                    addLabel="Добавить подпункт"
                                    emptyMessage="Подпунктов нет"
                                    newItem={() => ({ label: "", href: "" })}
                                    itemLabel={(j) =>
                                        form.watch(
                                            `items.${i}.children.${j}.label`
                                        ) || `Подпункт ${j + 1}`
                                    }
                                    renderItem={(j) => (
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <TextField<V>
                                                name={`items.${i}.children.${j}.label`}
                                                label="Название"
                                            />
                                            <TextField<V>
                                                name={`items.${i}.children.${j}.href`}
                                                label="Ссылка"
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                    />
                </Section>

                <SaveBar pending={pending} />
            </form>
        </Form>
    );
}
