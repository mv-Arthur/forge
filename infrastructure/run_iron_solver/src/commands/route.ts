import { createInfrastructureSolver } from "../composition.js";

export function route(root: string): void {
    const eventName = process.env.GITHUB_EVENT_NAME ?? "";
    const eventPath = process.env.GITHUB_EVENT_PATH;

    if (!eventPath) {
        throw new Error("GITHUB_EVENT_PATH is required for route mode");
    }

    createInfrastructureSolver(root).route({
        eventName,
        eventPath,
    });
}
