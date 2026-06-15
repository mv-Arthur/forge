import type { AiProjectConfig } from "./config.js";
import type { CreatePrParams, GitHubIssue, GitHubPr } from "./github.js";
import type { LabelDefinition, StatusLabel } from "./labels.js";

export type AgentSandbox = "read-only" | "workspace-write";

export type AgentRunParams = {
    sandbox: AgentSandbox;
    outputLastMessage: string;
    prompt: string;
    outputSchema?: string;
};

export type AgentRunnerPort = {
    run: (params: AgentRunParams) => void;
};

export type FilePort = {
    ensureDir: (path: string) => void;
    readText: (path: string) => string;
    writeText: (path: string, content: string) => void;
    repoPath: (...parts: string[]) => string;
};

export type GitHubPort = {
    ensureLabels: (labels: LabelDefinition[]) => void;
    getIssue: (issueNumber: string) => GitHubIssue;
    getPr: (prNumber: string) => GitHubPr;
    getDefaultBranch: () => string;
    setIssueStatus: (issueNumber: string, nextStatus: StatusLabel) => void;
    setPrStatus: (prNumber: string, nextStatus: StatusLabel) => void;
    addIssueComment: (issueNumber: string, body: string) => void;
    addPrComment: (prNumber: string, body: string) => void;
    addPrLabels: (prNumber: string, labels: string[]) => void;
    findOpenPrByHead: (branch: string) => string;
    createPr: (params: CreatePrParams) => string;
    checkoutPr: (prNumber: string) => void;
    prDiff: (prNumber: string) => string;
};

export type GitPort = {
    fetchBase: (baseBranch: string) => void;
    checkoutBranchFromBase: (branch: string, baseBranch: string) => void;
    hasWorkingTreeChanges: () => boolean;
    commitAll: (message: string) => void;
    pushBranch: (branch: string) => void;
};

export type ChecksPort = {
    runScript: (script: string) => void;
};

export type ToolPort = {
    requireCommands: (commands: string[]) => void;
};

export type LoggerPort = {
    log: (message: string) => void;
};

export type ClockPort = {
    createRunId: () => string;
};

export type IronSolverConfig = {
    project: AiProjectConfig;
    baseBranch?: string;
    promptTemplatesDir: string;
    maxReviewIterations: number;
    maxQaIterations: number;
    schemas: {
        reviewResult: string;
        qaResult: string;
    };
};

export type IronSolverDependencies = {
    config: IronSolverConfig;
    github: GitHubPort;
    git: GitPort;
    agent: AgentRunnerPort;
    files: FilePort;
    checks: ChecksPort;
    tools: ToolPort;
    logger: LoggerPort;
    clock: ClockPort;
};
