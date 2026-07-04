// Доменный тип сертификата (коллекция). Общий для backend и www (fallback).

export interface Certificate {
    slug: string;
    order: number;
    title: string;
    // Опциональные: картинка-превью документа и ссылка на сам файл (PDF и т.п.).
    imageUrl?: string;
    fileUrl?: string;
}
