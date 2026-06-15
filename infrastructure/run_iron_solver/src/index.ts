import { createInfrastructureSolver } from "./composition.js";
import { parseJobArgs, printJobUsage } from "./job.js";

const root = process.env.GITHUB_WORKSPACE ?? process.cwd();

try {
    const options = parseJobArgs(process.argv.slice(2));

    if (options.help) {
        printJobUsage();
        process.exit(0);
    }

    const solver = createInfrastructureSolver(root, {
        projectKey: options.projectKey,
    });

    switch (options.command) {
        case "route": {
            const eventName = process.env.GITHUB_EVENT_NAME ?? "";
            const eventPath = process.env.GITHUB_EVENT_PATH;

            if (!eventPath) {
                throw new Error("GITHUB_EVENT_PATH is required for route mode");
            }

            solver.route({
                eventName,
                eventPath,
            });
            break;
        }
        case "setup-labels":
            solver.setupLabels();
            break;
        case "develop":
            solver.developIssue(options.value ?? "");
            break;
        case "review":
            solver.reviewPullRequest(options.value ?? "");
            break;
        case "qa":
            solver.qaIssue(options.value ?? "");
            break;
    }
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    printJobUsage();
    process.exit(1);
}
