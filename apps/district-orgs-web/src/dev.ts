import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const viteBin = path.join(root, "node_modules", ".bin", "vite");

const api = spawn(
    process.execPath,
    ["--experimental-strip-types", path.join(root, "src/server.ts")],
    {
        cwd: root,
        env: { ...process.env, PORT: "8788" },
        stdio: "inherit",
    }
);

const ui = spawn(viteBin, ["--config", "ui/vite.config.ts"], {
    cwd: root,
    stdio: "inherit",
});

function shutdown() {
    api.kill("SIGTERM");
    ui.kill("SIGTERM");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

api.on("exit", (code) => {
    if (code) process.exit(code ?? 1);
});
ui.on("exit", (code) => {
    if (code) process.exit(code ?? 1);
});
