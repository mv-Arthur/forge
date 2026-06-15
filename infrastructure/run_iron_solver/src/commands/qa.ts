import { createInfrastructureSolver } from "../composition.js";

export function qa(root: string, issueNumber: string): void {
    createInfrastructureSolver(root).qaIssue(issueNumber);
}
