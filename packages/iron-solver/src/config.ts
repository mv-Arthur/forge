export type AgentRole =
    | "frontend-developer"
    | "frontend-reviewer"
    | "frontend-qa";

export type AiProjectConfig = {
    key: string;
    label: string;
    aiLabel?: string;
    aiLabelColor?: string;
    aiLabelDescription?: string;
    labelColor?: string;
    labelDescription?: string;
    root: string;
    agentsDir: string;
    branch: (issueNumber: string) => string;
    commitTitle: (issueNumber: string) => string;
    requiredLabels?: string[];
};
