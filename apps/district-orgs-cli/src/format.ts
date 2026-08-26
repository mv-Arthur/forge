import type { DistrictOrgsResult, Organization } from "@forge/district-orgs";
import type { OutputFormat } from "./parse-cli-args.ts";

export function formatResult(
    result: DistrictOrgsResult,
    format: OutputFormat
): string {
    if (format === "json") {
        return `${JSON.stringify(result, null, 2)}\n`;
    }
    if (format === "ndjson") {
        const lines = result.organizations.map((org) => JSON.stringify(org));
        return lines.length ? `${lines.join("\n")}\n` : "";
    }
    return formatTable(result);
}

function formatTable(result: DistrictOrgsResult): string {
    const header = `${result.district.title}  (${result.count}${
        result.totalEstimate != null ? ` / ~${result.totalEstimate}` : ""
    })`;
    if (result.organizations.length === 0) {
        return `${header}\n(no organizations)\n`;
    }
    const rows = [
        ["TITLE", "ADDRESS", "PHONE", "CATEGORIES"],
        ...result.organizations.map(toRow),
    ];
    const widths = [0, 1, 2, 3].map((col) =>
        Math.min(
            col === 0 ? 36 : col === 1 ? 40 : col === 2 ? 22 : 28,
            Math.max(...rows.map((row) => row[col]?.length ?? 0))
        )
    );
    const lines = rows.map((row, index) => {
        const cells = row.map((cell, col) => pad(cell, widths[col] ?? 0));
        const line = cells.join("  ");
        if (index === 0) {
            const rule = widths.map((w) => "-".repeat(w)).join("  ");
            return `${line}\n${rule}`;
        }
        return line;
    });
    return `${header}\n${lines.join("\n")}\n`;
}

function toRow(org: Organization): [string, string, string, string] {
    return [
        org.title,
        org.address ?? org.fullAddress ?? "",
        org.phones[0] ?? "",
        org.categories.join(", "),
    ];
}

function pad(value: string, width: number): string {
    if (value.length <= width) return value.padEnd(width);
    if (width <= 1) return value.slice(0, width);
    return `${value.slice(0, width - 1)}…`;
}
