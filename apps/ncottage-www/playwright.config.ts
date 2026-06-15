import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const BASE_URL = process.env.BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    // Next dev compiles routes on first hit; one retry absorbs cold-compile
    // timeouts without masking real failures (a real bug fails twice).
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 2 : 4,
    reporter: [["list"], ["html", { open: "never" }]],
    timeout: 60_000,
    expect: { timeout: 10_000 },
    use: {
        baseURL: BASE_URL,
        navigationTimeout: 45_000,
        actionTimeout: 15_000,
        trace: "retain-on-failure",
    },
    projects: [
        {
            name: "desktop",
            use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
        },
        {
            name: "mobile",
            use: { ...devices["Pixel 5"] },
        },
    ],
    webServer: {
        command: "pnpm dev",
        url: BASE_URL,
        // In CI always start a clean server; locally reuse a running dev server.
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
