export function parseJson<T>(text: string): T {
    return JSON.parse(stripJsonFence(text)) as T;
}

export function stripJsonFence(text: string): string {
    return text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/i, "");
}
