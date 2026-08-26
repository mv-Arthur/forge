/**
 * Точка входа модуля copy.
 *
 * Вход: CaptureConfig + CopyOpts (pack/allow), тот же discover что atlas.
 * Выход: copy.json — текст представителей шаблона с role/slot/selector.
 *
 * Не импортировать copy.ts напрямую.
 */
export { copy, type CopyOpts } from "./copy.js";
export { writeCopy } from "./dump.js";
export { copyOne } from "./copy-one.js";
export { blocksFromRaw, isNumericText } from "./classify.js";
export type {
    CopyDump,
    CopyPage,
    CopyBlock,
    CopyRole,
    CopySlot,
} from "./types.js";
