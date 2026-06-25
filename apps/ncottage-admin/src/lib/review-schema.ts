import type { Review } from "@forge/shared";
import { z } from "zod";

// id отзыва генерируется на сервере, в форме его нет.
export type ReviewInput = Omit<Review, "id">;

export const reviewSchema = z.object({
    author: z.string().min(1, "Укажите автора"),
    date: z.string().min(1, "Укажите дату"),
    text: z.string().min(1, "Укажите текст отзыва"),
    type: z.string(),
    image: z.string(),
    videoUrl: z.string(),
    featured: z.boolean(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

export function emptyReviewValues(): ReviewFormValues {
    return {
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
    const type = values.type.trim();
    const image = values.image.trim();
    const videoUrl = values.videoUrl.trim();
    return {
        author: values.author.trim(),
        date: values.date.trim(),
        text: values.text.trim(),
        featured: values.featured,
        ...(type ? { type } : {}),
        ...(image ? { image } : {}),
        ...(videoUrl ? { videoUrl } : {}),
    };
}
