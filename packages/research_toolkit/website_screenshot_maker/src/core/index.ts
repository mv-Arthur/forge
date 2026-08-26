/**
 * Точка входа модуля core.
 *
 * Импорт: `from "./core/index.js"` или с корня SDK.
 *
 * Вход
 *   CaptureConfig: origin, out, devices: Device[], concurrency, navTimeout, locale.
 *
 * Слои
 *   browse — один визит страницы (goto, cookies, lazy scroll)
 *   shot — captureOne (PNG) / inspectOne (PNG + виджеты + атомы + токены)
 *   dissect — collectors (widgets/atoms/tokens) и PNG-гейты
 *   playbook — состояния форм на уже снятых виджетах
 *   copy — текст без PNG
 *   atlas — кластеры шаблонов
 *   catalog — atlas.json; intern только штампует id в дереве, отдельный library.json не пишем
 *
 * Выход
 *   PNG в out/pages/{deviceId}/{slug}.png и manifest.json;
 *   atlas.json / copy.json — отдельные режимы.
 *
 * Не импортировать capture.ts и хелперы напрямую.
 */

import type { Device } from "../device/index.js";

/** Рабочий конфиг после разбора JSON. */
export interface CaptureConfig {
    /** Разобранный origin сайта. */
    origin: URL;
    /** Абсолютный путь для PNG и manifest.json. */
    out: string;
    /** Устройства, с которых снимаем (геометрия из Device). */
    devices: Device[];
    /** Число процессов Chromium (не вкладок). */
    concurrency: number;
    /** Вкладок на один Chromium. По умолчанию 1. */
    tabsPerBrowser: number;
    /** Таймаут page.goto, мс. */
    navTimeout: number;
    /** locale контекста браузера. */
    locale: string;
}

export { capture } from "./capture/index.js";
export { atlas } from "./atlas/index.js";
export type { AtlasOpts } from "./atlas/index.js";
export { inspectOne } from "./shot/index.js";
export type { InspectResult, Occupancy, CropNode } from "./shot/index.js";
export { publicTree, mergeAtomStates } from "./dissect/index.js";
export { matchPath, collapsePath, induceClusters } from "./cluster/index.js";
export type { SitePack } from "./cluster/index.js";
export { heuristicLabeler, refineCrops } from "./label/index.js";
export type { Labeler, CropRefine } from "./label/index.js";
export {
    writeAtlas,
    writeLibrary,
    internItems,
    internAndStamp,
    internTree,
    withAssetFileUrls,
} from "./catalog/index.js";
export type {
    Atlas,
    AtlasTemplate,
    AtlasSlot,
    CropLibrary,
    LibraryCrop,
} from "./catalog/index.js";
export { copy } from "./copy/index.js";
export type {
    CopyOpts,
    CopyDump,
    CopyPage,
    CopyBlock,
    CopyRole,
    CopySlot,
} from "./copy/index.js";
export { writeCopy } from "./copy/index.js";
