import { createIronSolver } from "@forge/iron-solver";

import { createChecksAdapter, createToolAdapter } from "./adapters/shell.js";
import { createClockAdapter } from "./adapters/clock.js";
import { createCodexAdapter } from "./adapters/codex.js";
import { createFileAdapter } from "./adapters/files.js";
import { createGitAdapter } from "./adapters/git.js";
import { createGitHubAdapter } from "./adapters/github.js";
import { getProjectConfig } from "./projects/config.js";

import type { IronSolver } from "@forge/iron-solver";

export type InfrastructureSolverOptions = {
    projectKey?: string;
};

export function createInfrastructureSolver(
    root: string,
    options: InfrastructureSolverOptions = {}
): IronSolver {
    const files = createFileAdapter(root);

    return createIronSolver({
        config: {
            project: getProjectConfig(options.projectKey),
            baseBranch: process.env.BASE_BRANCH,
            promptTemplatesDir: "packages/iron-solver/prompt-templates",
            maxReviewIterations: Number(
                process.env.MAX_REVIEW_ITERATIONS ?? "5"
            ),
            maxQaIterations: Number(process.env.MAX_QA_ITERATIONS ?? "5"),
            schemas: {
                reviewResult: files.repoPath(
                    "infrastructure/run_iron_solver/schemas/review-result.schema.json"
                ),
                qaResult: files.repoPath(
                    "infrastructure/run_iron_solver/schemas/qa-result.schema.json"
                ),
            },
        },
        github: createGitHubAdapter(root),
        git: createGitAdapter(root),
        agent: createCodexAdapter(root),
        files,
        checks: createChecksAdapter(root),
        tools: createToolAdapter(root),
        logger: console,
        clock: createClockAdapter(),
    });
}
