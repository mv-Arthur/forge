// Доменный тип отзыва (коллекция). Общий для backend и www (fallback).
// type/image/videoUrl опциональны: страница /reviews использует текст+type,
// карусель на главной (эпик E2) — image/videoUrl и флаг featured.

export interface Review {
    id: string;
    order: number;
    author: string;
    date: string;
    text: string;
    type?: string;
    image?: string;
    videoUrl?: string;
    featured: boolean;
}
