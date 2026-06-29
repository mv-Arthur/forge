// Доменный тип сертификата (коллекция). Общий для backend и www (fallback).

export interface Certificate {
    slug: string;
    order: number;
    title: string;
}
