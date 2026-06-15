import { createInfrastructureSolver } from "../composition.js";

export function develop(root: string, issueNumber: string): void {
    createInfrastructureSolver(root).developIssue(issueNumber);
}
