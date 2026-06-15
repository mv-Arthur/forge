import type { AiProjectConfig } from "@forge/iron-solver";

const defaultProjectKey = "ncottage-www";

const projects: Record<string, AiProjectConfig> = {
    "ncottage-www": {
        key: "ncottage-www",
        label: "project:ncottage-www",
        root: "apps/ncottage-www",
        agentsDir:
            "infrastructure/run_iron_solver/projects/ncottage-www/agents",
        branch: (issueNumber) => `ai/ncottage-www-${issueNumber}`,
        commitTitle: (issueNumber) =>
            `feat(ncottage-www): Implement frontend task #${issueNumber}`,
    },
};

export function getProjectConfig(projectKey?: string): AiProjectConfig {
    const key = projectKey || process.env.AI_PROJECT_KEY || defaultProjectKey;
    const project = projects[key];

    if (!project) {
        throw new Error(`Unknown AI project: ${key}`);
    }

    return project;
}

export type { AiProjectConfig };
