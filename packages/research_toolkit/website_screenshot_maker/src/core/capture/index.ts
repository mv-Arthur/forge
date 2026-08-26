/**
 * Точка входа модуля capture.
 *
 * Вход: CaptureConfig.
 * Выход: PNG и manifest.json в config.out.
 *
 * Не импортировать capture.ts напрямую.
 */
export { capture, browserWorkerCount } from "./capture.js";
