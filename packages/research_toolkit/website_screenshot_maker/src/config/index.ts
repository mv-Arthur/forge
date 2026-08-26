/**
 * Точка входа модуля config.
 *
 * Импорт: `from "./config/index.js"` или с корня SDK.
 *
 * Вход
 *   JSON-файл или объект: origin, devices? (id из матрицы потребителя),
 *   out?, concurrency?, navTimeout?, locale?
 *   плюс матрица устройств, которую передаёт потребитель.
 *
 * Выход
 *   CaptureConfig для capture(): origin, out, devices: Device[], concurrency, navTimeout, locale.
 *
 * Не импортировать parse.ts напрямую.
 */

/** Форма JSON-конфига. */
export interface ConfigFile {
    /** Корень сайта, http(s). Обязательное. */
    origin: string;
    /** Куда писать артефакты. По умолчанию `.out` рядом с конфигом. */
    out?: string;
    /** Id устройств из матрицы, которую потребитель передаёт в loadConfig. */
    devices?: string[];
    /** Сколько процессов Chromium. Страниц сразу: concurrency * tabsPerBrowser. */
    concurrency?: number;
    /** Вкладок на один Chromium. По умолчанию 1. */
    tabsPerBrowser?: number;
    /** Таймаут навигации, мс. По умолчанию 45000. */
    navTimeout?: number;
    /** locale Playwright, например ru-RU. */
    locale?: string;
}

export { parseOrigin, parseConfigFile, loadConfig } from "./parse.js";
