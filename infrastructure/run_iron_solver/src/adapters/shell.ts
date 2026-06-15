import { spawnSync } from "node:child_process";

import type { ChecksPort, ToolPort } from "@forge/iron-solver";
import type { SpawnSyncOptionsWithStringEncoding } from "node:child_process";

export type RunOptions = {
    cwd: string;
    input?: string;
    env?: NodeJS.ProcessEnv;
    allowFailure?: boolean;
    silent?: boolean;
};

export type RunResult = {
    status: number;
    stdout: string;
    stderr: string;
};

export function createChecksAdapter(root: string): ChecksPort {
    return {
        runScript: (script) => {
            runCommand("pnpm", [script], {
                cwd: root,
            });
        },
    };
}

export function createToolAdapter(root: string): ToolPort {
    return {
        requireCommands: (commands) => {
            for (const command of commands) {
                requireCommand(command, root);
            }
        },
    };
}

export function runCommand(
    command: string,
    args: string[],
    options: RunOptions
): RunResult {
    const spawnOptions: SpawnSyncOptionsWithStringEncoding = {
        cwd: options.cwd,
        env: options.env ?? process.env,
        encoding: "utf8",
        input: options.input,
        stdio: options.silent ? "pipe" : ["pipe", "inherit", "inherit"],
    };
    const result = spawnSync(command, args, spawnOptions);
    const status = result.status ?? 1;

    if (result.error) {
        throw result.error;
    }

    if (status !== 0 && !options.allowFailure) {
        throw new Error(`${command} ${args.join(" ")} failed with ${status}`);
    }

    return {
        status,
        stdout: result.stdout ?? "",
        stderr: result.stderr ?? "",
    };
}

export function captureCommand(
    command: string,
    args: string[],
    cwd: string
): string {
    return runCommand(command, args, {
        cwd,
        silent: true,
    }).stdout.trim();
}

export function commandSucceeds(
    command: string,
    args: string[],
    cwd: string
): boolean {
    return (
        runCommand(command, args, {
            cwd,
            allowFailure: true,
            silent: true,
        }).status === 0
    );
}

function requireCommand(command: string, cwd: string): void {
    if (!commandSucceeds("which", [command], cwd)) {
        throw new Error(`Required command not found: ${command}`);
    }
}
