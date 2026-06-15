import { commandSucceeds, runCommand } from "./shell.js";

import type { AgentRunnerPort } from "@forge/iron-solver";

export function createCodexAdapter(root: string): AgentRunnerPort {
    return {
        run: (params) => {
            if (!commandSucceeds("which", ["codex"], root)) {
                throw new Error("Required command not found: codex");
            }

            const args = [
                "exec",
                "--cd",
                root,
                "--sandbox",
                params.sandbox,
                "--ask-for-approval",
                "never",
            ];

            if (params.outputSchema) {
                args.push("--output-schema", params.outputSchema);
            }

            args.push("--output-last-message", params.outputLastMessage, "-");

            runCommand("codex", args, {
                cwd: root,
                input: params.prompt,
            });
        },
    };
}
