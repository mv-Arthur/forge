import type { AiProjectConfig } from "./config.js";

export const statusLabels = [
    "status:ready-for-develop",
    "status:in-develop",
    "status:review",
    "status:review-fixes",
    "status:ready-for-human-code-review",
    "status:ready-for-test",
    "status:testing",
    "status:qa-fixes",
    "status:ready-for-human-final-review",
    "status:needs-human-attention",
] as const;

export const legacyStatusLabels = ["status:ready-for-human-review"] as const;

export const statusLabelsToClear = [
    ...statusLabels,
    ...legacyStatusLabels,
] as const;

export type StatusLabel = (typeof statusLabels)[number];

export type LabelDefinition = {
    name: string;
    color: string;
    description: string;
};

const defaultAiLabel = "ai:codex";

const frontendLabel: LabelDefinition = {
    name: "frontend",
    color: "0E8A16",
    description: "Frontend task",
};

const defaultAiLabelDefinition: LabelDefinition = {
    name: defaultAiLabel,
    color: "5319E7",
    description: "Handled by AI agent pipeline",
};

export const baseLabels: LabelDefinition[] = [frontendLabel];

export const statusLabelDefinitions: LabelDefinition[] = [
    {
        name: "status:ready-for-develop",
        color: "C5DEF5",
        description: "Ready for AI development",
    },
    {
        name: "status:in-develop",
        color: "1D76DB",
        description: "AI development in progress",
    },
    {
        name: "status:review",
        color: "FBCA04",
        description: "Ready for AI review",
    },
    {
        name: "status:review-fixes",
        color: "F9D0C4",
        description: "Needs AI review fixes",
    },
    {
        name: "status:ready-for-human-code-review",
        color: "D4C5F9",
        description: "Ready for human code review before AI QA",
    },
    {
        name: "status:ready-for-test",
        color: "BFDADC",
        description: "Human-approved and ready for AI QA",
    },
    {
        name: "status:testing",
        color: "0052CC",
        description: "AI QA in progress",
    },
    {
        name: "status:qa-fixes",
        color: "D93F0B",
        description: "Needs AI QA fixes",
    },
    {
        name: "status:ready-for-human-final-review",
        color: "0E8A16",
        description: "Ready for human final review",
    },
    {
        name: "status:needs-human-attention",
        color: "B60205",
        description: "Needs human attention",
    },
];

export const commonLabels: LabelDefinition[] = [
    ...baseLabels,
    ...statusLabelDefinitions,
];

export function getAiLabel(project: AiProjectConfig): string {
    return project.aiLabel ?? defaultAiLabel;
}

export function getProjectLabels(project: AiProjectConfig): LabelDefinition[] {
    return [
        frontendLabel,
        {
            name: getAiLabel(project),
            color: project.aiLabelColor ?? defaultAiLabelDefinition.color,
            description:
                project.aiLabelDescription ??
                defaultAiLabelDefinition.description,
        },
        {
            name: project.label,
            color: project.labelColor ?? "1D76DB",
            description: project.labelDescription ?? `${project.key} project`,
        },
        ...statusLabelDefinitions,
    ];
}

export function getRoutingLabels(project: AiProjectConfig): string[] {
    return (
        project.requiredLabels ?? [
            "frontend",
            getAiLabel(project),
            project.label,
        ]
    );
}
