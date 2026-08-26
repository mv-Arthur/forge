import fs from "fs";
import path from "path";
import type { Device } from "./index.js";

/** Разобрать JSON-массив пресетов в Device[]. */
export function parseMatrix(raw: unknown): Device[] {
    if (!Array.isArray(raw) || raw.length === 0) {
        throw new Error("device matrix must be a non-empty array");
    }
    const seen = new Set<string>();
    return raw.map((row, i) => {
        if (!row || typeof row !== "object") {
            throw new Error(`device matrix[${i}] must be an object`);
        }
        const r = row as Record<string, unknown>;
        if (typeof r.id !== "string" || !r.id) {
            throw new Error(`device matrix[${i}].id is required`);
        }
        if (seen.has(r.id)) {
            throw new Error(`device matrix[${i}].id is duplicated: ${r.id}`);
        }
        seen.add(r.id);
        if (typeof r.width !== "number" || r.width <= 0) {
            throw new Error(`device matrix[${i}].width is required`);
        }
        if (typeof r.height !== "number" || r.height <= 0) {
            throw new Error(`device matrix[${i}].height is required`);
        }
        return {
            id: r.id,
            width: r.width,
            height: r.height,
            deviceScaleFactor:
                typeof r.deviceScaleFactor === "number" ? r.deviceScaleFactor : 1,
            isMobile: r.isMobile === true,
            userAgent: typeof r.userAgent === "string" ? r.userAgent : undefined,
        };
    });
}

/** Загрузить матрицу устройств из JSON-файла. */
export function loadMatrix(filePath: string): Device[] {
    const abs = path.resolve(filePath);
    if (!fs.existsSync(abs)) {
        throw new Error(`device matrix not found: ${abs}`);
    }
    return parseMatrix(JSON.parse(fs.readFileSync(abs, "utf8")));
}

/**
 * Вход: строковый id пресета и матрица потребителя.
 * Выход: полный Device.
 */
export function resolveDevice(id: string, matrix: readonly Device[]): Device {
    const found = matrix.find((d) => d.id === id);
    if (!found) throw new Error(`unknown device: ${id}`);
    return found;
}

/** Список id → список Device по переданной матрице. */
export function resolveDeviceList(ids: string[], matrix: readonly Device[]): Device[] {
    return ids.map((id) => resolveDevice(id, matrix));
}
