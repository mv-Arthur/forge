import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
    root: fileURLToPath(new URL(".", import.meta.url)),
    plugins: [react()],
    server: {
        host: "127.0.0.1",
        port: 8787,
        strictPort: true,
        allowedHosts: true,
        proxy: {
            "/api": {
                target: "http://127.0.0.1:8788",
                timeout: 0,
                proxyTimeout: 0,
            },
        },
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
    },
});
