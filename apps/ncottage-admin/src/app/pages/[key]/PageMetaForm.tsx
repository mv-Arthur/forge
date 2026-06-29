"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { TextareaField, TextField } from "@/components/form/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useUnsavedGuard } from "@/lib/use-unsaved-guard";
import { savePageMetaAction } from "../actions";

const schema = z.object({
    title: z.string().min(1, "Укажите название"),
    seoTitle: z.string().min(1, "Укажите SEO-заголовок"),
    seoDescription: z.string().min(1, "Укажите SEO-описание"),
});

type V = z.infer<typeof schema>;

export function PageMetaForm({
    pageKey,
    initial,
}: {
    pageKey: string;
    initial: V;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(schema),
        defaultValues: initial,
    });
    const isDirty = form.formState.isDirty;
    useUnsavedGuard(isDirty);

    async function onSubmit(values: V) {
        setPending(true);
        const result = await savePageMetaAction(pageKey, values);
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        form.reset(values);
        toast.success("Страница сохранена");
        router.refresh();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    Заголовок и SEO
                    {isDirty && (
                        <span className="text-xs font-normal text-amber-600">
                            ● Несохранённые изменения
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form} schema={schema}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <TextField<V> name="title" label="Название" />
                        <TextField<V> name="seoTitle" label="SEO-заголовок" />
                        <TextareaField<V>
                            name="seoDescription"
                            label="SEO-описание"
                            rows={2}
                        />
                        <Button type="submit" disabled={pending}>
                            {pending ? "Сохранение…" : "Сохранить"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
