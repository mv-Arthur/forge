/**
 * Точка входа модуля url.
 *
 * Вход: сырой URL / pathname / origin.
 * Выход: канон URL, slug файла, skip ассетов и admin.
 *
 * Не импортировать url.ts напрямую.
 */
export {
    apexHost,
    sameApexOrigin,
    normalizeUrl,
    acceptPageHref,
    isPaginationOnly,
    isSkippablePath,
    slugFromUrl,
} from "./url.js";
