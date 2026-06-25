"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Contacts } from "@forge/shared";
import { TextField } from "@/components/form/fields";
import { RepeaterField } from "@/components/form/repeater-field";
import { Form } from "@/components/ui/form";
import {
    type ContactsFormValues,
    contactsSchema,
    contactsToFormValues,
    formValuesToContacts,
} from "@/lib/settings-schema";
import { saveSettingAction } from "../actions";
import { Section, SaveBar } from "../form-parts";

type V = ContactsFormValues;

export function ContactsForm({ initial }: { initial: Contacts }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(contactsSchema),
        defaultValues: contactsToFormValues(initial),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveSettingAction(
            "contacts",
            formValuesToContacts(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Контакты сохранены");
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
                        <TextField<V> name="email" label="Email" />
                        <TextField<V> name="workHours" label="Часы работы" />
                    </div>
                </Section>

                <Section title="Телефоны">
                    <RepeaterField<V>
                        name="phones"
                        addLabel="Добавить телефон"
                        emptyMessage="Телефонов нет"
                        newItem={() => ({
                            code: "",
                            label: "",
                            number: "",
                            display: "",
                        })}
                        itemLabel={(i) =>
                            form.watch(`phones.${i}.label`) ||
                            `Телефон ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="grid gap-3 sm:grid-cols-2">
                                <TextField<V>
                                    name={`phones.${i}.code`}
                                    label="Код города"
                                    placeholder="spb"
                                />
                                <TextField<V>
                                    name={`phones.${i}.label`}
                                    label="Подпись"
                                    placeholder="Санкт-Петербург"
                                />
                                <TextField<V>
                                    name={`phones.${i}.number`}
                                    label="Номер (tel:)"
                                    placeholder="+78123093818"
                                />
                                <TextField<V>
                                    name={`phones.${i}.display`}
                                    label="Отображение"
                                    placeholder="+7 (812) 309-38-18"
                                />
                            </div>
                        )}
                    />
                </Section>

                <Section title="Адреса">
                    <RepeaterField<V>
                        name="addresses"
                        addLabel="Добавить адрес"
                        emptyMessage="Адресов нет"
                        newItem={() => ({ key: "", label: "", value: "" })}
                        itemLabel={(i) =>
                            form.watch(`addresses.${i}.label`) ||
                            `Адрес ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <TextField<V>
                                        name={`addresses.${i}.key`}
                                        label="Ключ"
                                        placeholder="spb"
                                    />
                                    <TextField<V>
                                        name={`addresses.${i}.label`}
                                        label="Подпись"
                                    />
                                </div>
                                <TextField<V>
                                    name={`addresses.${i}.value`}
                                    label="Адрес"
                                />
                            </div>
                        )}
                    />
                </Section>

                <Section title="Соцсети">
                    <RepeaterField<V>
                        name="social"
                        addLabel="Добавить соцсеть"
                        emptyMessage="Соцсетей нет"
                        newItem={() => ({ key: "", label: "", url: "" })}
                        itemLabel={(i) =>
                            form.watch(`social.${i}.label`) ||
                            `Соцсеть ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <TextField<V>
                                        name={`social.${i}.key`}
                                        label="Ключ"
                                        placeholder="telegram"
                                    />
                                    <TextField<V>
                                        name={`social.${i}.label`}
                                        label="Подпись"
                                    />
                                </div>
                                <TextField<V>
                                    name={`social.${i}.url`}
                                    label="Ссылка"
                                    placeholder="https://t.me/ncottage"
                                />
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

                <SaveBar pending={pending} />
            </form>
        </Form>
    );
}
