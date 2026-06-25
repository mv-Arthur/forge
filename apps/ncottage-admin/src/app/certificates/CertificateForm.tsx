"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Certificate } from "@forge/shared";
import { TextField } from "@/components/form/fields";
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
}: {
    initial?: Certificate;
    submitLabel: string;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(certificateSchema),
        defaultValues: initial
            ? certificateToFormValues(initial)
            : emptyCertificateValues(),
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
                        <TextField<V>
                            name="slug"
                            label="Slug"
                            placeholder="reestr-dobrosovestnyh-ispolniteley"
                        />
                        <TextField<V>
                            name="title"
                            label="Название документа"
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
