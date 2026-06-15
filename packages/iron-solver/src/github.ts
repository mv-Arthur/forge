export type GitHubLabel = {
    name: string;
};

export type GitHubComment = {
    body: string;
};

export type GitHubIssue = {
    number: number;
    title: string;
    body: string;
    labels: GitHubLabel[];
    url: string;
    comments: GitHubComment[];
};

export type GitHubPr = {
    number: number;
    title: string;
    body: string;
    baseRefName: string;
    headRefName: string;
    url: string;
    labels: GitHubLabel[];
    comments: GitHubComment[];
};

export type CreatePrParams = {
    base: string;
    head: string;
    title: string;
    body: string;
};

export function hasLabel(
    entity: { labels: GitHubLabel[] },
    label: string
): boolean {
    return entity.labels.some((item) => item.name === label);
}

export function extractIssueMarker(text: string): string {
    const match =
        text.match(/<!--\s*forge-ai:issue=(\d+)\s*-->/) ??
        text.match(/(?:Closes|Fixes|Resolves)\s+#(\d+)/i);

    return match?.[1] ?? "";
}

export function countCommentsByMarker(
    entity: { comments: GitHubComment[] },
    marker: string
): number {
    return entity.comments.filter((comment) => comment.body.includes(marker))
        .length;
}
