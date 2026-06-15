import type { ClockPort } from "@forge/iron-solver";

export function createClockAdapter(): ClockPort {
    return {
        createRunId: () =>
            new Date()
                .toISOString()
                .replace(/[-:]/g, "")
                .replace(/\.\d{3}Z$/, "")
                .replace("T", "-"),
    };
}
