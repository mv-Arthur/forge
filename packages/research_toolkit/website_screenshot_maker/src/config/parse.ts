import fs from "fs";
import path from "path";
import type { CaptureConfig } from "../core/index.js";
import { resolveDevice, resolveDeviceList, type Device } from "../device/index.js";

type DeviceMatrix = readonly Device[];

function asRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error("config must be a JSON object");
    }
    return value as Record<string, unknown>;
}

function optString(value: unknown, field: string): string | undefined {
    if (value === undefined) return undefined;
    if (typeof value !== "string" || !value.trim()) {
        throw new Error(`${field} must be a non-empty string`);
    }
    return value;
}

function optNumber(value: unknown, field: string): number | undefined {
    if (value === undefined) return undefined;
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
        throw new Error(`${field} must be a positive number`);
    }
    return value;
}

const DEFAULT_OUT = ".out";

function resolveOut(p: string | undefined, baseDir: string): string {
    if (!p) return path.resolve(baseDir, DEFAULT_OUT);
    return path.isAbsolute(p) ? p : path.resolve(baseDir, p);
}

function parseDevicesList(value: unknown, matrix: DeviceMatrix): Device[] {
    if (!Array.isArray(value) || value.length === 0) {
        throw new Error("devices must be a non-empty array of string ids");
    }
    return value.map((item, i) => {
        if (typeof item !== "string" || !item.trim()) {
            throw new Error(`devices[${i}] must be a string id`);
        }
        return resolveDevice(item, matrix);
    });
}

/** Разобрать http(s) origin из строки. */
export function parseOrigin(raw: string): URL {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("origin must be http(s)");
    }
    url.hash = "";
    url.search = "";
    if (!url.pathname) url.pathname = "/";
    return url;
}

/** Разобрать объект конфига (уже из JSON). Id устройств резолвятся по matrix. */
export function parseConfigFile(
    raw: unknown,
    baseDir: string,
    matrix: DeviceMatrix,
): CaptureConfig {
    const obj = asRecord(raw);
    const origin = optString(obj.origin, "origin");
    if (!origin) throw new Error("origin is required");

    if (obj.viewport !== undefined) {
        throw new Error("use devices only");
    }

    const devices = obj.devices === undefined
        ? resolveDeviceList(["desktop"], matrix)
        : parseDevicesList(obj.devices, matrix);

    const out = resolveOut(optString(obj.out, "out"), baseDir);
    return {
        origin: parseOrigin(origin),
        out,
        devices,
        concurrency: optNumber(obj.concurrency, "concurrency") ?? 2,
        tabsPerBrowser: optNumber(obj.tabsPerBrowser, "tabsPerBrowser") ?? 1,
        navTimeout: optNumber(obj.navTimeout, "navTimeout") ?? 45000,
        locale: optString(obj.locale, "locale") ?? "ru-RU",
    };
}

/** Загрузить конфиг из JSON-файла. Относительные пути — от папки файла. */
export function loadConfig(filePath: string, matrix: DeviceMatrix): CaptureConfig {
    const abs = path.resolve(filePath);
    if (!fs.existsSync(abs)) {
        throw new Error(`config not found: ${abs}`);
    }
    const parsed: unknown = JSON.parse(fs.readFileSync(abs, "utf8"));
    return parseConfigFile(parsed, path.dirname(abs), matrix);
}
