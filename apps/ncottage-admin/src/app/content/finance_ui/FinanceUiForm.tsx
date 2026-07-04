"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { FinanceUi } from "@forge/shared";
import { TextField, TextareaField } from "@/components/form/fields";
import { RepeaterField } from "@/components/form/repeater-field";
import { Form } from "@/components/ui/form";
import {
    financeUiSchema,
    financeUiToFormValues,
    formValuesToFinanceUi,
    type FinanceUiFormValues,
} from "@/lib/settings-schema";
import { saveSettingAction } from "../actions";
import { SaveBar, Section } from "../form-parts";

type V = FinanceUiFormValues;

export function FinanceUiForm({ initial }: { initial: FinanceUi }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(financeUiSchema),
        defaultValues: financeUiToFormValues(initial),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveSettingAction(
            "finance_ui",
            formValuesToFinanceUi(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Финансовые лендинги сохранены");
        router.refresh();
    }

    return (
        <Form {...form} schema={financeUiSchema}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl space-y-6"
            >
                <Section
                    title="Кнопки в шапке"
                    description="Призывы под заголовком лендинга."
                >
                    <TextField<V>
                        name="primaryCtaLabel"
                        label="Основная кнопка (ведёт к форме)"
                    />
                    <TextField<V>
                        name="secondaryCta.label"
                        label="Вторая кнопка — подпись"
                    />
                    <TextField<V>
                        name="secondaryCta.href"
                        label="Вторая кнопка — ссылка"
                    />
                </Section>

                <Section
                    title="Единый сценарий"
                    description="Блок маршрута между шапкой и условиями. Номера шагов проставляются автоматически."
                >
                    <TextField<V> name="routeEyebrow" label="Надзаголовок" />
                    <TextField<V> name="routeTitle" label="Заголовок" />
                    <RepeaterField<V>
                        name="routeSteps"
                        addLabel="Добавить шаг"
                        emptyMessage="Шагов нет"
                        newItem={() => ({ title: "", text: "" })}
                        itemLabel={(i) =>
                            form.watch(`routeSteps.${i}.title`) ||
                            `Шаг ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <TextField<V>
                                    name={`routeSteps.${i}.title`}
                                    label="Заголовок"
                                />
                                <TextareaField<V>
                                    name={`routeSteps.${i}.text`}
                                    label="Текст"
                                    rows={2}
                                />
                            </div>
                        )}
                    />
                </Section>

                <Section
                    title="Надзаголовки секций"
                    description="Подписи над блоками условий, процесса, форматов и формы."
                >
                    <TextField<V>
                        name="conditionsEyebrow"
                        label="Над блоком условий"
                    />
                    <TextField<V>
                        name="stepsEyebrow"
                        label="Над блоком процесса"
                    />
                    <TextField<V>
                        name="banksEyebrow"
                        label="Над блоком форматов"
                    />
                    <TextField<V>
                        name="formEyebrow"
                        label="Над блоком заявки"
                    />
                </Section>

                <SaveBar pending={pending} />
            </form>
        </Form>
    );
}
