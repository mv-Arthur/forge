/**
 * Точка входа модуля device.
 *
 * Импорт: `from "./device/index.js"` или с корня SDK.
 *
 * Вход
 *   1. Матрица пресетов — JSON-файл или массив. Владеет потребитель, не SDK.
 *   2. Строковый id пресета из этой матрицы.
 *
 * Выход
 *   `Device` — полный viewport: id, width, height, deviceScaleFactor, isMobile, userAgent?
 *
 * Неизвестный id → throw `unknown device:`.
 * Не импортировать resolve.ts напрямую.
 */

/** Имя пресета из матрицы потребителя. */
export type DeviceId = string;

/** Сущность устройства: геометрия окна и флаги контекста. */
export interface Device {
    /** Стабильный id пресета. */
    id: string;
    /** Ширина окна, px. */
    width: number;
    /** Высота окна, px. */
    height: number;
    /** deviceScaleFactor для Playwright. */
    deviceScaleFactor: number;
    /** isMobile контекста Playwright. */
    isMobile: boolean;
    /** User-Agent; если нет — desktop UA в capture. */
    userAgent?: string;
}

export {
    parseMatrix,
    loadMatrix,
    resolveDevice,
    resolveDeviceList,
} from "./resolve.js";
