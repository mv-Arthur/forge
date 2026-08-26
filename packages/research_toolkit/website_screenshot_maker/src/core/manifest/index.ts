/**
 * Точка входа модуля manifest.
 *
 * Вход: строки съёмки, число discovered, флаг final, CaptureConfig.
 * Выход: out/manifest.json.
 *
 * Не импортировать manifest.ts напрямую.
 */
export { writeManifest } from "./manifest.js";
export type { CaptureRow, CaptureStatus } from "./manifest.js";
