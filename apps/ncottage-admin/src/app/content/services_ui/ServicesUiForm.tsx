"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ServicesUi } from "@forge/shared";
import { SelectField, TextField } from "@/components/form/fields";
import { RepeaterField } from "@/components/form/repeater-field";
import { StringListField } from "@/components/form/string-list-field";
import { Form } from "@/components/ui/form";
import {
    formValuesToServicesUi,
    SERVICE_SLUG_NONE,
    servicesUiSchema,
    servicesUiToFormValues,
    type ServicesUiFormValues,
} from "@/lib/settings-schema";
import { saveSettingAction } from "../actions";
import { SaveBar, Section } from "../form-parts";

type V = ServicesUiFormValues;

interface Option {
    value: string;
    label: string;
}

export function ServicesUiForm({
    initial,
    serviceOptions,
}: {
    initial: ServicesUi;
    serviceOptions: Option[];
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(servicesUiSchema),
        defaultValues: servicesUiToFormValues(initial),
    });

    const routeStepOptions: Option[] = [
        { value: SERVICE_SLUG_NONE, label: "— нет услуги —" },
        ...serviceOptions,
    ];

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveSettingAction(
            "services_ui",
            formValuesToServicesUi(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Навигатор услуг сохранён");
        router.refresh();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl space-y-6"
            >
                <Section
                    title="Мини-квиз"
                    description="Варианты ответов на шагах «Что строите?» и «Когда начать?»."
                >
                    <StringListField<V>
                        name="quiz.objectOptions"
                        label="Что планируете строить?"
                        addLabel="Добавить вариант"
                    />
                    <StringListField<V>
                        name="quiz.timingOptions"
                        label="Когда хотите начать?"
                        addLabel="Добавить вариант"
                    />
                </Section>

                <Section
                    title="Дорожная карта"
                    description="Этапы интерактивной карты. Услуга — узел этапа (или «нет услуги»)."
                >
                    <RepeaterField<V>
                        name="routeSteps"
                        addLabel="Добавить этап"
                        emptyMessage="Этапов нет"
                        newItem={() => ({
                            title: "",
                            description: "",
                            serviceSlug: SERVICE_SLUG_NONE,
                        })}
                        itemLabel={(i) =>
                            form.watch(`routeSteps.${i}.title`) ||
                            `Этап ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <TextField<V>
                                    name={`routeSteps.${i}.title`}
                                    label="Заголовок"
                                />
                                <TextField<V>
                                    name={`routeSteps.${i}.description`}
                                    label="Описание"
                                />
                                <SelectField<V>
                                    name={`routeSteps.${i}.serviceSlug`}
                                    label="Услуга этапа"
                                    options={routeStepOptions}
                                />
                            </div>
                        )}
                    />
                </Section>

                <Section
                    title="Дополнительные направления"
                    description="Теги-ссылки в нижней секции навигатора (ведут на услугу-родителя)."
                >
                    <RepeaterField<V>
                        name="additionalLinks"
                        addLabel="Добавить ссылку"
                        emptyMessage="Ссылок нет"
                        newItem={() => ({
                            title: "",
                            parentSlug: serviceOptions[0]?.value ?? "",
                        })}
                        itemLabel={(i) =>
                            form.watch(`additionalLinks.${i}.title`) ||
                            `Ссылка ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <TextField<V>
                                    name={`additionalLinks.${i}.title`}
                                    label="Заголовок"
                                />
                                <SelectField<V>
                                    name={`additionalLinks.${i}.parentSlug`}
                                    label="Услуга-родитель"
                                    options={serviceOptions}
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
