import { z } from "zod";

// Поля-ссылки принимают как относительные пути на внутренние страницы (/works),
// так и абсолютные http(s)-URL на внешние ресурсы (видео-хостинг, сайты
// партнёров). Пустая строка допустима для опциональных полей.
function isUrlOrPath(value: string): boolean {
    if (value === "" || value.startsWith("/")) return true;
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

const URL_OR_PATH_MESSAGE =
    "Укажите путь от корня (/page) или полный URL (https://…)";

// Опциональное поле-ссылка: пусто допустимо.
export function optionalUrlOrPath() {
    return z.string().refine(isUrlOrPath, URL_OR_PATH_MESSAGE);
}

// Обязательное поле-ссылка.
export function requiredUrlOrPath(requiredMessage: string) {
    return z
        .string()
        .min(1, requiredMessage)
        .refine(isUrlOrPath, URL_OR_PATH_MESSAGE);
}
