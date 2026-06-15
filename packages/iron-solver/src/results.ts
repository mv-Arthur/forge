import { parseJson } from "./json.js";

export type ReviewResult = {
    result: "pass" | "fail";
    summary: string;
    blocking: string[];
    nonBlocking: string[];
    requiredFixes: string[];
};

export type QaResult = {
    result: "pass" | "fail";
    summary: string;
    checklist: Array<{
        item: string;
        passed: boolean;
    }>;
    bugs: Array<{
        title: string;
        steps: string[];
        expected: string;
        actual: string;
    }>;
    screenshots: string[];
};

export function parseReviewResult(text: string): ReviewResult {
    return parseJson<ReviewResult>(text);
}

export function parseQaResult(text: string): QaResult {
    return parseJson<QaResult>(text);
}

export function renderReviewResult(
    result: ReviewResult,
    marker: string
): string {
    return [
        marker,
        `## AI frontend review: ${result.result}`,
        "",
        result.summary,
        "",
        "### Blocking",
        ...(result.blocking.length
            ? result.blocking.map((item) => `- ${item}`)
            : ["- None"]),
        "",
        "### Non-blocking",
        ...(result.nonBlocking.length
            ? result.nonBlocking.map((item) => `- ${item}`)
            : ["- None"]),
        "",
        "### Required fixes",
        ...(result.requiredFixes.length
            ? result.requiredFixes.map((item) => `- ${item}`)
            : ["- None"]),
    ].join("\n");
}

export function renderQaResult(result: QaResult, marker: string): string {
    return [
        marker,
        `## AI frontend QA: ${result.result}`,
        "",
        result.summary,
        "",
        "### Checklist",
        ...(result.checklist.length
            ? result.checklist.map(
                  (item) => `- [${item.passed ? "x" : " "}] ${item.item}`
              )
            : ["- None"]),
        "",
        "### Bugs",
        ...(result.bugs.length
            ? result.bugs.flatMap((bug) => [
                  `- ${bug.title}`,
                  `  - Steps: ${bug.steps.join("; ")}`,
                  `  - Expected: ${bug.expected}`,
                  `  - Actual: ${bug.actual}`,
              ])
            : ["- None"]),
        "",
        "### Screenshots",
        ...(result.screenshots.length
            ? result.screenshots.map((item) => `- ${item}`)
            : ["- None"]),
    ].join("\n");
}
