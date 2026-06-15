import { statusLabelsToClear } from "@forge/iron-solver";

import { captureCommand, runCommand } from "./shell.js";

import type {
    CreatePrParams,
    GitHubIssue,
    GitHubPort,
    GitHubPr,
    LabelDefinition,
} from "@forge/iron-solver";

export function createGitHubAdapter(root: string): GitHubPort {
    return {
        ensureLabels: (labels) => ensureLabels(root, labels),
        getIssue: (issueNumber) =>
            ghJson<GitHubIssue>(root, [
                "issue",
                "view",
                issueNumber,
                "--json",
                "number,title,body,labels,url,comments",
            ]),
        getPr: (prNumber) =>
            ghJson<GitHubPr>(root, [
                "pr",
                "view",
                prNumber,
                "--json",
                "number,title,body,baseRefName,headRefName,url,labels,comments",
            ]),
        getDefaultBranch: () =>
            ghJson<RepoInfo>(root, [
                "repo",
                "view",
                "--json",
                "defaultBranchRef",
            ]).defaultBranchRef.name,
        setIssueStatus: (issueNumber, nextStatus) => {
            for (const label of statusLabelsToClear) {
                gh(
                    root,
                    ["issue", "edit", issueNumber, "--remove-label", label],
                    {
                        allowFailure: true,
                        silent: true,
                    }
                );
            }

            gh(
                root,
                ["issue", "edit", issueNumber, "--add-label", nextStatus],
                {
                    silent: true,
                }
            );
        },
        setPrStatus: (prNumber, nextStatus) => {
            for (const label of statusLabelsToClear) {
                gh(root, ["pr", "edit", prNumber, "--remove-label", label], {
                    allowFailure: true,
                    silent: true,
                });
            }

            gh(root, ["pr", "edit", prNumber, "--add-label", nextStatus], {
                silent: true,
            });
        },
        addIssueComment: (issueNumber, body) => {
            gh(root, ["issue", "comment", issueNumber, "--body", body], {
                silent: true,
            });
        },
        addPrComment: (prNumber, body) => {
            gh(root, ["pr", "comment", prNumber, "--body", body], {
                silent: true,
            });
        },
        addPrLabels: (prNumber, labels) => {
            gh(
                root,
                ["pr", "edit", prNumber, "--add-label", labels.join(",")],
                {
                    silent: true,
                }
            );
        },
        findOpenPrByHead: (branch) => {
            const prs = ghJson<Array<{ number: number }>>(root, [
                "pr",
                "list",
                "--state",
                "open",
                "--head",
                branch,
                "--json",
                "number",
            ]);

            return prs[0]?.number.toString() ?? "";
        },
        createPr: (params) => createPr(root, params),
        checkoutPr: (prNumber) => {
            gh(root, ["pr", "checkout", prNumber]);
        },
        prDiff: (prNumber) => gh(root, ["pr", "diff", prNumber]),
    };
}

function ensureLabels(root: string, labels: LabelDefinition[]): void {
    for (const label of labels) {
        gh(
            root,
            [
                "label",
                "create",
                label.name,
                "--color",
                label.color,
                "--description",
                label.description,
                "--force",
            ],
            {
                silent: true,
            }
        );
    }
}

function createPr(root: string, params: CreatePrParams): string {
    const url = gh(root, [
        "pr",
        "create",
        "--base",
        params.base,
        "--head",
        params.head,
        "--title",
        params.title,
        "--body",
        params.body,
    ]).trim();

    return url.split("/").at(-1) ?? "";
}

function gh(root: string, args: string[], options: GhOptions = {}): string {
    return runCommand("gh", args, {
        cwd: root,
        allowFailure: options.allowFailure,
        silent: options.silent ?? true,
    }).stdout;
}

function ghJson<T>(root: string, args: string[]): T {
    return JSON.parse(captureCommand("gh", args, root)) as T;
}

type GhOptions = {
    allowFailure?: boolean;
    silent?: boolean;
};

type RepoInfo = {
    defaultBranchRef: {
        name: string;
    };
};
