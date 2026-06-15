import { commandSucceeds, runCommand } from "./shell.js";

import type { GitPort } from "@forge/iron-solver";

export function createGitAdapter(root: string): GitPort {
    return {
        fetchBase: (baseBranch) => {
            runCommand("git", ["fetch", "origin", baseBranch, "--prune"], {
                cwd: root,
            });
        },
        checkoutBranchFromBase: (branch, baseBranch) => {
            runCommand(
                "git",
                ["checkout", "-B", branch, `origin/${baseBranch}`],
                {
                    cwd: root,
                }
            );
        },
        hasWorkingTreeChanges: () =>
            !commandSucceeds("git", ["diff", "--quiet"], root) ||
            !commandSucceeds("git", ["diff", "--cached", "--quiet"], root),
        commitAll: (message) => {
            runCommand("git", ["add", "-A"], {
                cwd: root,
            });

            if (
                !commandSucceeds("git", ["diff", "--cached", "--quiet"], root)
            ) {
                runCommand("git", ["commit", "-m", message], {
                    cwd: root,
                });
            }
        },
        pushBranch: (branch) => {
            runCommand("git", ["push", "-u", "origin", branch], {
                cwd: root,
            });
        },
    };
}
