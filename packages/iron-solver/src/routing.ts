import { getRoutingLabels } from "./labels.js";

import type { AiProjectConfig } from "./config.js";

export type RouteDecision =
    | {
          kind: "develop";
          issueNumber: string;
          reason: string;
      }
    | {
          kind: "review";
          prNumber: string;
          reason: string;
      }
    | {
          kind: "qa";
          issueNumber: string;
          reason: string;
      }
    | {
          kind: "noop";
          reason: string;
      };

export function decideRoute(
    eventName: string,
    payload: unknown,
    project: AiProjectConfig
): RouteDecision {
    if (eventName === "workflow_dispatch") {
        return decideWorkflowDispatch(payload);
    }

    if (eventName === "issues") {
        return decideIssueRoute(payload, project);
    }

    if (eventName === "pull_request") {
        return decidePullRequestRoute(payload, project);
    }

    return {
        kind: "noop",
        reason: `unsupported event ${eventName || "unknown"}`,
    };
}

function decideWorkflowDispatch(payload: unknown): RouteDecision {
    const inputs = getObject(payload, "inputs");
    const mode = getString(inputs, "mode");
    const issueNumber = getString(inputs, "issue_number");
    const prNumber = getString(inputs, "pr_number");

    if (mode === "develop") {
        requireInput(issueNumber, "issue_number");

        return {
            kind: "develop",
            issueNumber,
            reason: "manual develop dispatch",
        };
    }

    if (mode === "review") {
        requireInput(prNumber, "pr_number");

        return {
            kind: "review",
            prNumber,
            reason: "manual review dispatch",
        };
    }

    if (mode === "qa") {
        requireInput(issueNumber, "issue_number");

        return {
            kind: "qa",
            issueNumber,
            reason: "manual QA dispatch",
        };
    }

    return {
        kind: "noop",
        reason: `unsupported workflow_dispatch mode ${mode || "unknown"}`,
    };
}

function decideIssueRoute(
    payload: unknown,
    project: AiProjectConfig
): RouteDecision {
    const issue = getObject(payload, "issue");
    const issueNumber = getNumberString(issue, "number");
    const labels = getLabels(issue);

    if (!issueNumber) {
        return {
            kind: "noop",
            reason: "missing issue number",
        };
    }

    if (!hasRequiredLabels(labels, project)) {
        return {
            kind: "noop",
            reason: "issue does not have Iron Solver routing labels",
        };
    }

    if (
        hasAnyLabel(labels, [
            "status:ready-for-develop",
            "status:review-fixes",
            "status:qa-fixes",
        ])
    ) {
        return {
            kind: "develop",
            issueNumber,
            reason: "issue is ready for development",
        };
    }

    if (hasLabel(labels, "status:ready-for-test")) {
        return {
            kind: "qa",
            issueNumber,
            reason: "issue is ready for QA",
        };
    }

    return {
        kind: "noop",
        reason: "issue status is not actionable",
    };
}

function decidePullRequestRoute(
    payload: unknown,
    project: AiProjectConfig
): RouteDecision {
    const pullRequest = getObject(payload, "pull_request");
    const prNumber = getNumberString(pullRequest, "number");
    const labels = getLabels(pullRequest);
    const draft = getBoolean(pullRequest, "draft");

    if (!prNumber) {
        return {
            kind: "noop",
            reason: "missing PR number",
        };
    }

    if (draft) {
        return {
            kind: "noop",
            reason: "PR is draft",
        };
    }

    if (!hasRequiredLabels(labels, project)) {
        return {
            kind: "noop",
            reason: "PR does not have Iron Solver routing labels",
        };
    }

    if (hasLabel(labels, "status:review")) {
        return {
            kind: "review",
            prNumber,
            reason: "PR is ready for review",
        };
    }

    return {
        kind: "noop",
        reason: "PR status is not actionable",
    };
}

function hasRequiredLabels(
    labels: string[],
    project: AiProjectConfig
): boolean {
    return getRoutingLabels(project).every((label) => hasLabel(labels, label));
}

function hasAnyLabel(labels: string[], requiredLabels: string[]): boolean {
    return requiredLabels.some((label) => hasLabel(labels, label));
}

function hasLabel(labels: string[], label: string): boolean {
    return labels.includes(label);
}

function getLabels(value: JsonObject | null): string[] {
    const labels = getArray(value, "labels");

    return labels.flatMap((item) => {
        const label = asObject(item);
        const name = getString(label, "name");

        return name ? [name] : [];
    });
}

function requireInput(value: string, name: string): void {
    if (!value) {
        throw new Error(`workflow_dispatch input ${name} is required`);
    }
}

function getObject(value: unknown, key: string): JsonObject | null {
    return asObject(asObject(value)?.[key]);
}

function getArray(value: JsonObject | null, key: string): unknown[] {
    const item = value?.[key];

    return Array.isArray(item) ? item : [];
}

function getString(value: JsonObject | null, key: string): string {
    const item = value?.[key];

    return typeof item === "string" ? item : "";
}

function getBoolean(value: JsonObject | null, key: string): boolean {
    const item = value?.[key];

    return typeof item === "boolean" ? item : false;
}

function getNumberString(value: JsonObject | null, key: string): string {
    const item = value?.[key];

    if (typeof item === "number") {
        return item.toString();
    }

    return typeof item === "string" ? item : "";
}

function asObject(value: unknown): JsonObject | null {
    return value != null && typeof value === "object" && !Array.isArray(value)
        ? (value as JsonObject)
        : null;
}

type JsonObject = Record<string, unknown>;
