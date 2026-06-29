"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Footer } from "@forge/shared";
import {
    CheckboxField,
    TextField,
    TextareaField,
} from "@/components/form/fields";
import { RepeaterField } from "@/components/form/repeater-field";
import { Form } from "@/components/ui/form";
import {
    type FooterFormValues,
    footerSchema,
    footerToFormValues,
    formValuesToFooter,
} from "@/lib/settings-schema";
import { saveSettingAction } from "../actions";
import { Section, SaveBar } from "../form-parts";

type V = FooterFormValues;

export function FooterForm({ initial }: { initial: Footer }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(footerSchema),
        defaultValues: footerToFormValues(initial),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveSettingAction(
            "footer",
            formValuesToFooter(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Футер сохранён");
        router.refresh();
    }

    return (
        <Form {...form} schema={footerSchema}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl space-y-6"
            >
                <Section title="Основное">
                    <TextareaField<V> name="tagline" label="Слоган" rows={2} />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField<V>
                            name="contactsTitle"
                            label="Заголовок контактов"
                        />
                        <TextField<V> name="email" label="Email" />
                        <TextField<V> name="workHours" label="Часы работы" />
                        <TextField<V>
                            name="socialLabel"
                            label="Подпись соцсетей"
                        />
                    </div>
                </Section>

                <Section title="Меню">
                    <TextField<V> name="navTitle" label="Заголовок меню" />
                    <RepeaterField<V>
                        name="navItems"
                        addLabel="Добавить ссылку"
                        emptyMessage="Ссылок нет"
                        newItem={() => ({
                            label: "",
                            href: "",
                            external: false,
                        })}
                        itemLabel={(i) =>
                            form.watch(`navItems.${i}.label`) ||
                            `Ссылка ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <TextField<V>
                                        name={`navItems.${i}.label`}
                                        label="Название"
                                    />
                                    <TextField<V>
                                        name={`navItems.${i}.href`}
                                        label="Ссылка"
                                    />
                                </div>
                                <CheckboxField<V>
                                    name={`navItems.${i}.external`}
                                    label="Внешняя ссылка"
                                />
                            </div>
                        )}
                    />
                </Section>

                <Section title="Офисы">
                    <RepeaterField<V>
                        name="offices"
                        addLabel="Добавить офис"
                        emptyMessage="Офисов нет"
                        newItem={() => ({
                            label: "",
                            address: "",
                            phoneNumber: "",
                            phoneDisplay: "",
                        })}
                        itemLabel={(i) =>
                            form.watch(`offices.${i}.label`) || `Офис ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <TextField<V>
                                        name={`offices.${i}.label`}
                                        label="Город"
                                    />
                                    <TextField<V>
                                        name={`offices.${i}.address`}
                                        label="Адрес"
                                    />
                                    <TextField<V>
                                        name={`offices.${i}.phoneNumber`}
                                        label="Телефон (tel:)"
                                        placeholder="+78123093818"
                                    />
                                    <TextField<V>
                                        name={`offices.${i}.phoneDisplay`}
                                        label="Телефон (отображение)"
                                        placeholder="+7 (812) 309-38-18"
                                    />
                                </div>
                            </div>
                        )}
                    />
                </Section>

                <Section title="Реквизиты">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <TextField<V> name="legal.ogrn" label="ОГРН" />
                        <TextField<V> name="legal.inn" label="ИНН" />
                        <TextField<V> name="legal.kpp" label="КПП" />
                    </div>
                </Section>

                <Section title="Нижняя строка">
                    <RepeaterField<V>
                        name="bottomLinks"
                        label="Ссылки внизу"
                        addLabel="Добавить ссылку"
                        emptyMessage="Ссылок нет"
                        newItem={() => ({
                            label: "",
                            href: "",
                            external: false,
                        })}
                        itemLabel={(i) =>
                            form.watch(`bottomLinks.${i}.label`) ||
                            `Ссылка ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <TextField<V>
                                        name={`bottomLinks.${i}.label`}
                                        label="Название"
                                    />
                                    <TextField<V>
                                        name={`bottomLinks.${i}.href`}
                                        label="Ссылка"
                                    />
                                </div>
                                <CheckboxField<V>
                                    name={`bottomLinks.${i}.external`}
                                    label="Внешняя ссылка"
                                />
                            </div>
                        )}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField<V> name="copyright" label="Копирайт" />
                        <TextField<V>
                            name="toTopLabel"
                            label="Подпись «Наверх»"
                        />
                    </div>
                    <TextareaField<V>
                        name="disclaimer"
                        label="Дисклеймер"
                        rows={3}
                    />
                </Section>

                <SaveBar pending={pending} />
            </form>
        </Form>
    );
}
