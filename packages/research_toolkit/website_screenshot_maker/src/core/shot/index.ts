/**
 * Точка входа модуля shot.
 *
 * Вход: browser, url, Device, индекс, CaptureConfig.
 * Выход: CaptureRow и PNG в out/pages/{deviceId}/{slug}.png.
 *
 * Не импортировать shot.ts напрямую.
 */
export { captureOne, inspectOne, skipReason } from "./shot.js";
export type { InspectResult, Occupancy } from "./shot.js";
export type { CropNode } from "../dissect/tree.js";
