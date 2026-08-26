/**
 * website_screenshot_maker — SDK съёмки full-page PNG.
 *
 *   import { capture, loadConfig, loadMatrix } from "website_screenshot_maker";
 *   const matrix = loadMatrix("./matrix.json");
 *   await capture(loadConfig("./config.json", matrix));
 */
export { capture } from "./core/index.js";
export type { CaptureConfig } from "./core/index.js";
export { atlas } from "./core/index.js";
export type { AtlasOpts } from "./core/index.js";
export { inspectOne } from "./core/index.js";
export { matchPath, collapsePath, induceClusters } from "./core/index.js";
export type { SitePack } from "./core/index.js";
export { heuristicLabeler, refineCrops } from "./core/index.js";
export type { Labeler, CropRefine } from "./core/index.js";
export {
    writeAtlas,
    writeLibrary,
    internItems,
    internAndStamp,
    internTree,
    withAssetFileUrls,
} from "./core/index.js";
export type {
    Atlas,
    AtlasTemplate,
    AtlasSlot,
    CropLibrary,
    LibraryCrop,
} from "./core/index.js";
export type { InspectResult, Occupancy, CropNode } from "./core/index.js";
export { publicTree, mergeAtomStates } from "./core/index.js";
export { copy, writeCopy } from "./core/index.js";
export type {
    CopyOpts,
    CopyDump,
    CopyPage,
    CopyBlock,
    CopyRole,
    CopySlot,
} from "./core/index.js";

export { loadConfig, parseConfigFile, parseOrigin } from "./config/index.js";
export type { ConfigFile } from "./config/index.js";

export {
    parseMatrix,
    loadMatrix,
    resolveDevice,
    resolveDeviceList,
} from "./device/index.js";
export type { Device, DeviceId } from "./device/index.js";
