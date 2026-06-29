import type { Review } from "@forge/shared";
import { z } from "zod";

// id отзыва генерируется на сервере, в форме его нет.
export type ReviewInput = Omit<Review, "id">;

export const reviewSchema = z.object({
    order: z.number({ message: "Укажите порядок" }).int().min(0),
    author: z.string().min(1, "Укажите автора"),
    date: z.string().min(1, "Укажите дату"),
    text: z.string().min(1, "Укажите текст отзыва"),
    type: z.string(),
    image: z.string(),
    videoUrl: z.string(),
    featured: z.boolean(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

export function emptyReviewValues(order = 0): ReviewFormValues {
    return {
        order,
        author: "",
        date: "",
        text: "",
        type: "",
        image: "",
        videoUrl: "",
        featured: false,
    };
}

export function reviewToFormValues(review: Review): ReviewFormValues {
    return {
        order: review.order,
        author: review.author,
        date: review.date,
        text: review.text,
        type: review.type ?? "",
        image: review.image ?? "",
        videoUrl: review.videoUrl ?? "",
        featured: review.featured,
    };
}

export function formValuesToReview(values: ReviewFormValues): ReviewInput {
    // Всегда отправляем опциональные поля (в т.ч. пустые), чтобы их можно было
    // очистить: API хранит "", а toDomain опускает пустые → www берёт фолбэк.
    return {
        order: values.order,
        author: values.author.trim(),
        date: values.date.trim(),
        text: values.text.trim(),
        featured: values.featured,
        type: values.type.trim(),
        image: values.image.trim(),
        videoUrl: values.videoUrl.trim(),
    };
}
