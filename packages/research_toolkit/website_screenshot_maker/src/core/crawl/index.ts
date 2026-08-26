/**
 * Точка входа модуля crawl.
 *
 * Вход: HTML-сиды (обычно home) и origin.
 * Выход: Set канонических same-origin URL по BFS href-графу.
 *
 * Не импортировать crawl.ts напрямую.
 */
export { crawlPages } from "./crawl.js";
