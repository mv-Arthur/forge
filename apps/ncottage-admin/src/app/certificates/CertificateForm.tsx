"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Certificate } from "@forge/shared";
import { NumberField, TextField } from "@/components/form/fields";
import { MediaField } from "@/components/media/media-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
    type CertificateFormValues,
    certificateSchema,
    certificateToFormValues,
    emptyCertificateValues,
    formValuesToCertificate,
} from "@/lib/certificate-schema";
import { saveCertificateAction } from "./actions";

type V = CertificateFormValues;

export function CertificateForm({
    initial,
    submitLabel,
    nextOrder = 0,
}: {
    initial?: Certificate;
    submitLabel: string;
    nextOrder?: number;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(certificateSchema),
        defaultValues: initial
            ? certificateToFormValues(initial)
            : emptyCertificateValues(nextOrder),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveCertificateAction(
            initial?.slug ?? null,
            formValuesToCertificate(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(initial ? "Документ сохранён" : "Документ создан");
        router.push("/certificates");
        router.refresh();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl space-y-6"
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Документ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField<V>
                                name="slug"
                                label="Slug"
                                placeholder="reestr-dobrosovestnyh-ispolniteley"
                            />
                            <NumberField<V>
                                name="order"
                                label="Порядок вывода"
                            />
                        </div>
                        <TextField<V>
                            name="title"
                            label="Название документа"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Файл документа (опц.)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <MediaField<V>
                            name="imageUrl"
                            label="Картинка-превью"
                            folder="certificates"
                            description="Скан или фото документа для превью на сайте."
                        />
                        <MediaField<V>
                            name="fileUrl"
                            label="Файл (PDF и т.п.)"
                            folder="certificates"
                            description="Ссылка на сам документ — карточка станет кликабельной."
                        />
                    </CardContent>
                </Card>

                <div className="sticky bottom-0 flex items-center gap-2 border-t bg-background/95 py-4 backdrop-blur">
                    <Button type="submit" disabled={pending}>
                        {pending ? "Сохранение…" : submitLabel}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/certificates")}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </Form>
    );
}
