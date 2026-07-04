// Media — единое хранилище ссылок на загруженные файлы (картинки, PDF).
// Проекты и контент ссылаются на Media по id; url денормализуем для отдачи на фронт.

export interface Media {
    id: string;
    key: string;
    url: string;
    filename: string;
    mime: string;
    size: number;
    width?: number;
    height?: number;
    alt?: string;
    folder?: string;
    createdAt: string;
}
