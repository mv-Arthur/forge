"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Partner } from "@forge/shared";
import { TextField } from "@/components/form/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
    emptyPartnerValues,
    formValuesToPartner,
    type PartnerFormValues,
    partnerSchema,
    partnerToFormValues,
} from "@/lib/partner-schema";
import { savePartnerAction } from "./actions";

type V = PartnerFormValues;

export function PartnerForm({
    initial,
    submitLabel,
}: {
    initial?: Partner;
    submitLabel: string;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(partnerSchema),
        defaultValues: initial
            ? partnerToFormValues(initial)
            : emptyPartnerValues(),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await savePartnerAction(
            initial?.slug ?? null,
            formValuesToPartner(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(initial ? "Партнёр сохранён" : "Партнёр создан");
        router.push("/partners");
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
                        <CardTitle className="text-base">Партнёр</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField<V>
                                name="slug"
                                label="Slug"
                                placeholder="top-house"
                            />
                            <TextField<V>
                                name="name"
                                label="Название"
                                placeholder="Top House"
                            />
                        </div>
                        <TextField<V>
                            name="category"
                            label="Категория"
                            placeholder="домокомплекты"
                        />
                        <TextField<V>
                            name="href"
                            label="Сайт (опц.)"
                            placeholder="https://example.com"
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
                        onClick={() => router.push("/partners")}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </Form>
    );
}
