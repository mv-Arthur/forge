"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { BuiltObject } from "@forge/shared";
import { NumberField, TextField } from "@/components/form/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
    type BuiltObjectFormValues,
    builtObjectSchema,
    builtObjectToFormValues,
    emptyBuiltObjectValues,
    formValuesToBuiltObject,
} from "@/lib/built-object-schema";
import { saveBuiltObjectAction } from "./actions";

type V = BuiltObjectFormValues;

export function BuiltObjectForm({
    initial,
    submitLabel,
}: {
    initial?: BuiltObject;
    submitLabel: string;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(builtObjectSchema),
        defaultValues: initial
            ? builtObjectToFormValues(initial)
            : emptyBuiltObjectValues(),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveBuiltObjectAction(
            initial?.id ?? null,
            formValuesToBuiltObject(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(initial ? "Объект сохранён" : "Объект создан");
        router.push("/built-objects");
        router.refresh();
    }

    return (
        <Form {...form} schema={builtObjectSchema}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl space-y-6"
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Объект</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField<V>
                                name="id"
                                label="Идентификатор"
                                placeholder="nizhnie-oselki"
                            />
                            <TextField<V>
                                name="title"
                                label="Название"
                                placeholder="Дом из СИП-панелей"
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField<V>
                                name="location"
                                label="Локация (опц.)"
                            />
                            <NumberField<V> name="area" label="Площадь, м²" />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField<V>
                                name="type"
                                label="Тип (опц.)"
                                placeholder="Дом / Баня"
                                description="Пусто — выводится по заголовку"
                            />
                            <TextField<V>
                                name="technology"
                                label="Технология (опц.)"
                                placeholder="Каркас / СИП-панели / …"
                                description="Пусто — выводится по заголовку"
                            />
                        </div>
                        <TextField<V>
                            name="image"
                            label="Фото (URL)"
                            placeholder="https://…"
                        />
                        <TextField<V>
                            name="href"
                            label="Ссылка на объект"
                            placeholder="/our-works/..."
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Координаты на карте (опц.)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <NumberField<V> name="lat" label="Широта" />
                            <NumberField<V> name="lng" label="Долгота" />
                        </div>
                    </CardContent>
                </Card>

                <div className="sticky bottom-0 flex items-center gap-2 border-t bg-background/95 py-4 backdrop-blur">
                    <Button type="submit" disabled={pending}>
                        {pending ? "Сохранение…" : submitLabel}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/built-objects")}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </Form>
    );
}
