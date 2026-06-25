"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Review } from "@forge/shared";
import {
    CheckboxField,
    TextareaField,
    TextField,
} from "@/components/form/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
    emptyReviewValues,
    formValuesToReview,
    type ReviewFormValues,
    reviewSchema,
    reviewToFormValues,
} from "@/lib/review-schema";
import { saveReviewAction } from "./actions";

type V = ReviewFormValues;

export function ReviewForm({
    initial,
    submitLabel,
}: {
    initial?: Review;
    submitLabel: string;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(reviewSchema),
        defaultValues: initial
            ? reviewToFormValues(initial)
            : emptyReviewValues(),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveReviewAction(
            initial?.id ?? null,
            formValuesToReview(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(initial ? "Отзыв сохранён" : "Отзыв создан");
        router.push("/reviews");
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
                        <CardTitle className="text-base">Отзыв</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField<V>
                                name="author"
                                label="Автор"
                                placeholder="Алексей"
                            />
                            <TextField<V>
                                name="date"
                                label="Дата"
                                placeholder="2023 или 22.02.2019"
                            />
                        </div>
                        <TextField<V>
                            name="type"
                            label="Категория (опц.)"
                            placeholder="Каркасный дом"
                        />
                        <TextareaField<V>
                            name="text"
                            label="Текст отзыва"
                            rows={5}
                        />
                        <CheckboxField<V>
                            name="featured"
                            label="Показывать на главной (карусель)"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Медиа для карусели (опц.)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <TextField<V>
                            name="image"
                            label="Фото (URL)"
                            placeholder="https://…"
                        />
                        <TextField<V>
                            name="videoUrl"
                            label="Видео (YouTube embed URL)"
                            placeholder="https://www.youtube.com/embed/…"
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
                        onClick={() => router.push("/reviews")}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </Form>
    );
}
