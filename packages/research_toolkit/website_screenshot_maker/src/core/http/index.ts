/**
 * Точка входа модуля http.
 *
 * Вход: URL.
 * Выход: { status, body }. До 3 same-apex редиректов.
 *
 * Не импортировать http.ts напрямую.
 */
export { fetchText } from "./http.js";
export type { FetchTextResult } from "./http.js";
