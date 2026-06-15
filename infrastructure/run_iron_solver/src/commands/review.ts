import { createInfrastructureSolver } from "../composition.js";

export function review(root: string, prNumber: string): void {
    createInfrastructureSolver(root).reviewPullRequest(prNumber);
}
