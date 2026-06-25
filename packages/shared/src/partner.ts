// Доменный тип партнёра (коллекция). Общий для backend и www (fallback).

export interface Partner {
    slug: string;
    name: string;
    category: string;
    href?: string;
}
