// Доменный тип партнёра (коллекция). Общий для backend и www (fallback).

export interface Partner {
    slug: string;
    order: number;
    name: string;
    category: string;
    href?: string;
}
