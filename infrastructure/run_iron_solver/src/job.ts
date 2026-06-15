export type JobCommand = "route" | "develop" | "review" | "qa" | "setup-labels";

export type ParsedJobArgs = {
    command: JobCommand;
    value?: string;
    projectKey?: string;
    help: boolean;
};

export function parseJobArgs(args: string[]): ParsedJobArgs {
    const positional: string[] = [];
    let projectKey = process.env.AI_PROJECT_KEY;
    let help = false;

    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];

        if (arg === "--") {
            continue;
        }

        if (arg === "--help" || arg === "-h") {
            help = true;
            continue;
        }

        if (arg === "--project" || arg === "--project-key") {
            const value = args[index + 1];

            if (!value) {
                throw new Error(`${arg} value is required`);
            }

            projectKey = value;
            index += 1;
            continue;
        }

        if (arg.startsWith("--project=")) {
            projectKey = arg.slice("--project=".length);
            continue;
        }

        if (arg.startsWith("--project-key=")) {
            projectKey = arg.slice("--project-key=".length);
            continue;
        }

        if (arg.startsWith("-")) {
            throw new Error(`Unknown option: ${arg}`);
        }

        positional.push(arg);
    }

    const command = normalizeCommand(positional[0] ?? "route");
    const value = positional[1];

    if (!help) {
        validateCommandValue(command, value);
    }

    return {
        command,
        value,
        projectKey,
        help,
    };
}

export function printJobUsage(): void {
    console.error(
        [
            "Usage:",
            "  pnpm --dir infrastructure/run_iron_solver route",
            "  pnpm --dir infrastructure/run_iron_solver setup-labels",
            "  pnpm --dir infrastructure/run_iron_solver develop <issue-number>",
            "  pnpm --dir infrastructure/run_iron_solver review <pr-number>",
            "  pnpm --dir infrastructure/run_iron_solver qa <issue-number>",
            "",
            "Options:",
            "  --project <key>    Project key, defaults to AI_PROJECT_KEY or ncottage-www",
        ].join("\n")
    );
}

function normalizeCommand(command: string): JobCommand {
    if (
        command === "route" ||
        command === "develop" ||
        command === "review" ||
        command === "qa" ||
        command === "setup-labels"
    ) {
        return command;
    }

    throw new Error(`Unknown Iron Solver command: ${command}`);
}

function validateCommandValue(command: JobCommand, value: string | undefined) {
    if (command === "develop" && !value) {
        throw new Error("develop requires issue number");
    }

    if (command === "review" && !value) {
        throw new Error("review requires PR number");
    }

    if (command === "qa" && !value) {
        throw new Error("qa requires issue number");
    }
}
