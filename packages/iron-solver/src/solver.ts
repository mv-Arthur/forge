import { renderTemplate } from "@forge/shared";

import { getAiLabel, getProjectLabels } from "./labels.js";
import { decideRoute } from "./routing.js";
import {
    countCommentsByMarker,
    extractIssueMarker,
    hasLabel,
} from "./github.js";
import {
    parseQaResult,
    parseReviewResult,
    renderQaResult,
    renderReviewResult,
} from "./results.js";

import type { AgentRole, AiProjectConfig } from "./config.js";
import type { IronSolverDependencies } from "./ports.js";
import type { StatusLabel } from "./labels.js";

const reviewFailMarker = "<!-- forge-ai:frontend-review-fail -->";
const reviewPassMarker = "<!-- forge-ai:frontend-review-pass -->";
const qaFailMarker = "<!-- forge-ai:frontend-qa-fail -->";
const qaPassMarker = "<!-- forge-ai:frontend-qa-pass -->";

export type RouteParams = {
    eventName: string;
    eventPath: string;
};

export type IronSolver = {
    route: (params: RouteParams) => void;
    setupLabels: () => void;
    developIssue: (issueNumber: string) => void;
    reviewPullRequest: (prNumber: string) => void;
    qaIssue: (issueNumber: string) => void;
};

export function createIronSolver(deps: IronSolverDependencies): IronSolver {
    return new DefaultIronSolver(deps);
}

export class DefaultIronSolver implements IronSolver {
    public constructor(private readonly deps: IronSolverDependencies) {}

    public route(params: RouteParams): void {
        const deps = this.deps;
        const payload = JSON.parse(
            deps.files.readText(params.eventPath)
        ) as unknown;
        const decision = decideRoute(
            params.eventName,
            payload,
            deps.config.project
        );

        deps.logger.log(
            `Iron Solver route: ${decision.kind} (${decision.reason})`
        );

        switch (decision.kind) {
            case "develop":
                this.developIssue(decision.issueNumber);
                break;
            case "review":
                this.reviewPullRequest(decision.prNumber);
                break;
            case "qa":
                this.qaIssue(decision.issueNumber);
                break;
            case "noop":
                break;
        }
    }

    public setupLabels(): void {
        const deps = this.deps;

        deps.tools.requireCommands(["gh"]);
        deps.github.ensureLabels(getProjectLabels(deps.config.project));
    }

    public developIssue(issueNumber: string): void {
        const deps = this.deps;
        const project = deps.config.project;
        const runId = deps.clock.createRunId();
        const runDir = deps.files.repoPath(
            ".iron-solver/ai-runs",
            `issue-${issueNumber}`,
            `frontend-dev-${runId}`
        );
        const branch = project.branch(issueNumber);
        let prNumber = "";

        deps.tools.requireCommands(["gh", "git", "node", "pnpm"]);
        deps.files.ensureDir(runDir);
        deps.github.ensureLabels(getProjectLabels(deps.config.project));

        try {
            const issue = deps.github.getIssue(issueNumber);
            deps.files.writeText(
                deps.files.repoPath(runDir, "issue.json"),
                JSON.stringify(issue, null, 4)
            );

            if (!hasLabel(issue, project.label)) {
                deps.github.addIssueComment(
                    issueNumber,
                    `<!-- forge-ai:developer-wrong-project -->\nAI frontend developer expected label \`${project.label}\`. Needs human attention.`
                );
                deps.github.setIssueStatus(
                    issueNumber,
                    "status:needs-human-attention"
                );
                return;
            }

            const baseBranch =
                deps.config.baseBranch || deps.github.getDefaultBranch();

            deps.github.setIssueStatus(issueNumber, "status:in-develop");
            deps.git.fetchBase(baseBranch);

            const existingPr = deps.github.findOpenPrByHead(branch);
            let prJson = "null";

            if (existingPr) {
                prNumber = existingPr;
                deps.github.checkoutPr(existingPr);
                const pr = deps.github.getPr(existingPr);
                prJson = JSON.stringify(pr, null, 4);
                deps.files.writeText(
                    deps.files.repoPath(runDir, "pr.json"),
                    prJson
                );
            } else {
                deps.git.checkoutBranchFromBase(branch, baseBranch);
            }

            const prompt = this.buildDevelopPrompt({
                project,
                issueJson: JSON.stringify(issue, null, 4),
                prJson,
                issueTitle: issue.title,
                issueUrl: issue.url,
            });
            deps.files.writeText(
                deps.files.repoPath(runDir, "prompt.md"),
                prompt
            );

            deps.agent.run({
                sandbox: "workspace-write",
                outputLastMessage: deps.files.repoPath(
                    runDir,
                    "agent-result.md"
                ),
                prompt,
            });

            deps.checks.runScript("lint");
            deps.checks.runScript("typecheck");

            if (!deps.git.hasWorkingTreeChanges()) {
                if (!existingPr) {
                    deps.github.addIssueComment(
                        issueNumber,
                        "<!-- forge-ai:developer-no-changes -->\nAI frontend developer finished without code changes. Needs human attention."
                    );
                    deps.github.setIssueStatus(
                        issueNumber,
                        "status:needs-human-attention"
                    );
                    return;
                }
            } else {
                deps.git.commitAll(project.commitTitle(issueNumber));
            }

            deps.git.pushBranch(branch);

            if (!existingPr) {
                prNumber = deps.github.createPr({
                    base: baseBranch,
                    head: branch,
                    title: project.commitTitle(issueNumber),
                    body: [
                        `<!-- forge-ai:issue=${issueNumber} -->`,
                        `<!-- forge-ai:project=${project.key} -->`,
                        `Closes #${issueNumber}`,
                        "",
                        `AI frontend implementation for: ${issue.title}`,
                    ].join("\n"),
                });
            }

            deps.github.addPrLabels(prNumber, [
                "frontend",
                getAiLabel(project),
                project.label,
            ]);

            const nextStatus: StatusLabel = "status:review";
            const nextStage = "review";

            deps.github.setIssueStatus(issueNumber, nextStatus);
            deps.github.setPrStatus(prNumber, nextStatus);

            deps.github.addIssueComment(
                issueNumber,
                `<!-- forge-ai:developer-done -->\nAI frontend developer finished changes and moved the task to ${nextStage}.\n\nPR: #${prNumber}`
            );
        } catch (error) {
            deps.github.addIssueComment(
                issueNumber,
                `<!-- forge-ai:developer-error -->\nAI frontend developer failed. Check runner logs.\n\n${formatError(error)}`
            );
            deps.github.setIssueStatus(
                issueNumber,
                "status:needs-human-attention"
            );
            throw error;
        }
    }

    public reviewPullRequest(prNumber: string): void {
        const deps = this.deps;
        const project = deps.config.project;
        const runId = deps.clock.createRunId();
        const runDir = deps.files.repoPath(
            ".iron-solver/ai-runs",
            `pr-${prNumber}`,
            `frontend-review-${runId}`
        );

        deps.tools.requireCommands(["gh", "git", "node"]);
        deps.files.ensureDir(runDir);
        deps.github.ensureLabels(getProjectLabels(deps.config.project));

        try {
            const pr = deps.github.getPr(prNumber);
            deps.files.writeText(
                deps.files.repoPath(runDir, "pr.json"),
                JSON.stringify(pr, null, 4)
            );

            const issueNumber = extractIssueMarker(pr.body);

            if (!issueNumber) {
                deps.github.addPrComment(
                    prNumber,
                    "<!-- forge-ai:reviewer-missing-issue -->\nCannot find linked issue marker in PR body. Needs human attention."
                );
                return;
            }

            const issue = deps.github.getIssue(issueNumber);
            deps.files.writeText(
                deps.files.repoPath(runDir, "issue.json"),
                JSON.stringify(issue, null, 4)
            );

            if (
                !hasLabel(pr, project.label) ||
                !hasLabel(issue, project.label)
            ) {
                deps.github.addPrComment(
                    prNumber,
                    `<!-- forge-ai:reviewer-wrong-project -->\nAI frontend reviewer expected label \`${project.label}\` on PR and issue. Needs human attention.`
                );
                deps.github.setIssueStatus(
                    issueNumber,
                    "status:needs-human-attention"
                );
                deps.github.setPrStatus(
                    prNumber,
                    "status:needs-human-attention"
                );
                return;
            }

            deps.github.setIssueStatus(issueNumber, "status:review");
            deps.github.setPrStatus(prNumber, "status:review");

            deps.github.checkoutPr(prNumber);
            const diff = deps.github.prDiff(prNumber);
            deps.files.writeText(
                deps.files.repoPath(runDir, "diff.patch"),
                diff
            );

            const prompt = this.buildReviewPrompt({
                project,
                prNumber,
                baseBranch: pr.baseRefName,
                issueJson: JSON.stringify(issue, null, 4),
                prJson: JSON.stringify(pr, null, 4),
                diff,
            });
            deps.files.writeText(
                deps.files.repoPath(runDir, "prompt.md"),
                prompt
            );

            const resultPath = deps.files.repoPath(
                runDir,
                "review-result.json"
            );
            deps.agent.run({
                sandbox: "read-only",
                outputSchema: deps.config.schemas.reviewResult,
                outputLastMessage: resultPath,
                prompt,
            });

            const result = parseReviewResult(deps.files.readText(resultPath));

            if (result.result === "fail") {
                const nextIteration =
                    countCommentsByMarker(pr, reviewFailMarker) + 1;
                deps.github.addPrComment(
                    prNumber,
                    renderReviewResult(result, reviewFailMarker)
                );

                if (nextIteration >= deps.config.maxReviewIterations) {
                    deps.github.addIssueComment(
                        issueNumber,
                        `<!-- forge-ai:review-limit -->\nAI review reached iteration limit (${deps.config.maxReviewIterations}). Needs human attention.`
                    );
                    deps.github.setIssueStatus(
                        issueNumber,
                        "status:needs-human-attention"
                    );
                    deps.github.setPrStatus(
                        prNumber,
                        "status:needs-human-attention"
                    );
                } else {
                    deps.github.setIssueStatus(
                        issueNumber,
                        "status:review-fixes"
                    );
                    deps.github.setPrStatus(prNumber, "status:review-fixes");
                }
            } else {
                deps.github.addPrComment(
                    prNumber,
                    renderReviewResult(result, reviewPassMarker)
                );
                deps.github.setIssueStatus(
                    issueNumber,
                    "status:ready-for-human-code-review"
                );
                deps.github.setPrStatus(
                    prNumber,
                    "status:ready-for-human-code-review"
                );
            }
        } catch (error) {
            deps.github.addPrComment(
                prNumber,
                `<!-- forge-ai:reviewer-error -->\nAI frontend reviewer failed. Check runner logs.\n\n${formatError(error)}`
            );
            throw error;
        }
    }

    public qaIssue(issueNumber: string): void {
        const deps = this.deps;
        const project = deps.config.project;
        const runId = deps.clock.createRunId();
        const runDir = deps.files.repoPath(
            ".iron-solver/ai-runs",
            `issue-${issueNumber}`,
            `frontend-qa-${runId}`
        );
        const branch = project.branch(issueNumber);

        deps.tools.requireCommands(["gh", "git", "node", "pnpm"]);
        deps.files.ensureDir(runDir);
        deps.github.ensureLabels(getProjectLabels(deps.config.project));

        let prNumber = "";

        try {
            const issue = deps.github.getIssue(issueNumber);
            deps.files.writeText(
                deps.files.repoPath(runDir, "issue.json"),
                JSON.stringify(issue, null, 4)
            );

            if (!hasLabel(issue, project.label)) {
                deps.github.addIssueComment(
                    issueNumber,
                    `<!-- forge-ai:qa-wrong-project -->\nAI frontend QA expected label \`${project.label}\`. Needs human attention.`
                );
                deps.github.setIssueStatus(
                    issueNumber,
                    "status:needs-human-attention"
                );
                return;
            }

            prNumber = deps.github.findOpenPrByHead(branch);

            if (!prNumber) {
                deps.github.addIssueComment(
                    issueNumber,
                    `<!-- forge-ai:qa-missing-pr -->\nCannot find open PR for branch ${branch}. Needs human attention.`
                );
                deps.github.setIssueStatus(
                    issueNumber,
                    "status:needs-human-attention"
                );
                return;
            }

            const pr = deps.github.getPr(prNumber);
            deps.files.writeText(
                deps.files.repoPath(runDir, "pr.json"),
                JSON.stringify(pr, null, 4)
            );

            if (!hasLabel(pr, project.label)) {
                deps.github.addIssueComment(
                    issueNumber,
                    `<!-- forge-ai:qa-pr-wrong-project -->\nAI frontend QA expected label \`${project.label}\` on PR #${prNumber}. Needs human attention.`
                );
                deps.github.setIssueStatus(
                    issueNumber,
                    "status:needs-human-attention"
                );
                deps.github.setPrStatus(
                    prNumber,
                    "status:needs-human-attention"
                );
                return;
            }

            deps.github.setIssueStatus(issueNumber, "status:testing");
            deps.github.setPrStatus(prNumber, "status:testing");

            deps.github.checkoutPr(prNumber);

            const prompt = this.buildQaPrompt({
                project,
                issueNumber,
                prNumber,
                runDir,
                issueJson: JSON.stringify(issue, null, 4),
                prJson: JSON.stringify(pr, null, 4),
            });
            deps.files.writeText(
                deps.files.repoPath(runDir, "prompt.md"),
                prompt
            );

            const resultPath = deps.files.repoPath(runDir, "qa-result.json");
            deps.agent.run({
                sandbox: "workspace-write",
                outputSchema: deps.config.schemas.qaResult,
                outputLastMessage: resultPath,
                prompt,
            });

            const result = parseQaResult(deps.files.readText(resultPath));

            if (result.result === "fail") {
                const nextIteration =
                    countCommentsByMarker(issue, qaFailMarker) + 1;
                deps.github.addIssueComment(
                    issueNumber,
                    renderQaResult(result, qaFailMarker)
                );

                if (nextIteration >= deps.config.maxQaIterations) {
                    deps.github.addIssueComment(
                        issueNumber,
                        `<!-- forge-ai:qa-limit -->\nAI QA reached iteration limit (${deps.config.maxQaIterations}). Needs human attention.`
                    );
                    deps.github.setIssueStatus(
                        issueNumber,
                        "status:needs-human-attention"
                    );
                    deps.github.setPrStatus(
                        prNumber,
                        "status:needs-human-attention"
                    );
                } else {
                    deps.github.setIssueStatus(issueNumber, "status:qa-fixes");
                    deps.github.setPrStatus(prNumber, "status:qa-fixes");
                }
            } else {
                deps.github.addIssueComment(
                    issueNumber,
                    renderQaResult(result, qaPassMarker)
                );
                deps.github.setIssueStatus(
                    issueNumber,
                    "status:ready-for-human-final-review"
                );
                deps.github.setPrStatus(
                    prNumber,
                    "status:ready-for-human-final-review"
                );
            }
        } catch (error) {
            deps.github.addIssueComment(
                issueNumber,
                `<!-- forge-ai:qa-error -->\nAI frontend QA failed. Check runner logs.\n\n${formatError(error)}`
            );
            deps.github.setIssueStatus(
                issueNumber,
                "status:needs-human-attention"
            );
            throw error;
        }
    }

    private buildDevelopPrompt(params: DevelopPromptParams): string {
        return renderTemplate(this.readPromptTemplate("develop.md"), {
            agentPrompt: this.readAgentPrompt(
                params.project,
                "frontend-developer"
            ),
            projectKey: params.project.key,
            projectRoot: params.project.root,
            issueUrl: params.issueUrl,
            issueTitle: params.issueTitle,
            issueJson: params.issueJson,
            prJson: params.prJson,
        });
    }

    private buildReviewPrompt(params: ReviewPromptParams): string {
        return renderTemplate(this.readPromptTemplate("review.md"), {
            agentPrompt: this.readAgentPrompt(
                params.project,
                "frontend-reviewer"
            ),
            prNumber: params.prNumber,
            projectKey: params.project.key,
            baseBranch: params.baseBranch,
            projectRoot: params.project.root,
            issueJson: params.issueJson,
            prJson: params.prJson,
            diff: params.diff,
        });
    }

    private buildQaPrompt(params: QaPromptParams): string {
        return renderTemplate(this.readPromptTemplate("qa.md"), {
            agentPrompt: this.readAgentPrompt(params.project, "frontend-qa"),
            issueNumber: params.issueNumber,
            prNumber: params.prNumber,
            projectKey: params.project.key,
            projectRoot: params.project.root,
            runDir: params.runDir,
            issueJson: params.issueJson,
            prJson: params.prJson,
        });
    }

    private readAgentPrompt(project: AiProjectConfig, role: AgentRole): string {
        const deps = this.deps;

        return deps.files.readText(
            deps.files.repoPath(project.agentsDir, `${role}/prompt.md`)
        );
    }

    private readPromptTemplate(fileName: string): string {
        const deps = this.deps;

        return deps.files.readText(
            deps.files.repoPath(deps.config.promptTemplatesDir, fileName)
        );
    }
}

function formatError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

type DevelopPromptParams = {
    project: AiProjectConfig;
    issueJson: string;
    prJson: string;
    issueTitle: string;
    issueUrl: string;
};

type ReviewPromptParams = {
    project: AiProjectConfig;
    prNumber: string;
    baseBranch: string;
    issueJson: string;
    prJson: string;
    diff: string;
};

type QaPromptParams = {
    project: AiProjectConfig;
    issueNumber: string;
    prNumber: string;
    runDir: string;
    issueJson: string;
    prJson: string;
};
