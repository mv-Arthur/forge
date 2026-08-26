import type { Locator } from "playwright";
import fs from "fs";
import path from "path";
import { dropIfDuplicatePng, isBlankPng } from "./blank-png.js";

export async function screenshotLocator(
    loc: Locator,
    abs: string,
    opts?: {
        minBytes?: number;
        timeout?: number;
        visibleTimeout?: number;
        unique?: boolean;
        blank?: boolean;
    },
): Promise<boolean> {
    const minBytes = opts?.minBytes ?? 1;
    const timeout = opts?.timeout ?? 1500;
    const visibleTimeout = opts?.visibleTimeout ?? 400;
    try {
        if (!(await loc.isVisible({ timeout: visibleTimeout }))) return false;
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        await loc.screenshot({
            path: abs,
            type: "png",
            animations: "disabled",
            caret: "hide",
            timeout,
        });
        if (!fs.existsSync(abs) || fs.statSync(abs).size < minBytes) {
            try {
                fs.unlinkSync(abs);
            } catch {
                /* */
            }
            return false;
        }
        if (opts?.blank !== false && isBlankPng(abs)) {
            try {
                fs.unlinkSync(abs);
            } catch {
                /* */
            }
            return false;
        }
        if (opts?.unique !== false && dropIfDuplicatePng(abs)) {
            try {
                fs.unlinkSync(abs);
            } catch {
                /* */
            }
            return false;
        }
        return true;
    } catch {
        try {
            fs.unlinkSync(abs);
        } catch {
            /* */
        }
        return false;
    }
}
