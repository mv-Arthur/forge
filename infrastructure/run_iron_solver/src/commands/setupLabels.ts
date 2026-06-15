import { createInfrastructureSolver } from "../composition.js";

export function setupLabels(root: string): void {
    createInfrastructureSolver(root).setupLabels();
}
