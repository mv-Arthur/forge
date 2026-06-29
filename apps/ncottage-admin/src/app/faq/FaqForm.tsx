"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { FaqItem } from "@forge/shared";
import {
    NumberField,
    TextareaField,
    TextField,
} from "@/components/form/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
    emptyFaqValues,
    type FaqFormValues,
    faqSchema,
    faqToFormValues,
    formValuesToFaq,
} from "@/lib/faq-schema";
import { saveFaqAction } from "./actions";

type V = FaqFormValues;

export function FaqForm({
    initial,
    submitLabel,
    nextOrder = 0,
}: {
    initial?: FaqItem;
    submitLabel: string;
    nextOrder?: number;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(faqSchema),
        defaultValues: initial
            ? faqToFormValues(initial)
            : emptyFaqValues(nextOrder),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveFaqAction(
            initial?.slug ?? null,
            formValuesToFaq(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(initial ? "Вопрос сохранён" : "Вопрос создан");
        router.push("/faq");
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
                        <CardTitle className="text-base">Вопрос</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField<V>
                                name="slug"
                                label="Slug"
                                placeholder="karkasnye-doma-kruglyy-god"
                            />
                            <TextField<V>
                                name="group"
                                label="Раздел"
                                placeholder="Строительство"
                            />
                            <NumberField<V>
                                name="order"
                                label="Порядок вывода"
                            />
                        </div>
                        <TextField<V> name="question" label="Вопрос" />
                        <TextareaField<V>
                            name="answer"
                            label="Ответ"
                            rows={5}
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
                        onClick={() => router.push("/faq")}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </Form>
    );
}
