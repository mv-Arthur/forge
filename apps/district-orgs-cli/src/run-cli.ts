import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { listDistrictOrgs, tileOrganizations } from "@forge/district-orgs";
import { artifactFileName } from "./artifact-path.ts";
import { formatResult } from "./format.ts";
import { CliArgsError, parseCliArgs, USAGE } from "./parse-cli-args.ts";
import type { CliArgs } from "./parse-cli-args.ts";
import { markersForGroups, renderSheetsHtml } from "./render-sheet.ts";
import { fetchStaticMapPng } from "./static-map.ts";

export interface CliIo {
    stdout: { write(chunk: string): void };
    stderr: { write(chunk: string): void };
    fetch?: typeof fetch;
    writeFile?: (path: string, data: string) => Promise<void>;
    readFile?: (path: string) => Promise<string>;
    cwd?: string;
}

export async function runCli(argv: string[], io: CliIo): Promise<number> {
    let args;
    try {
        args = parseCliArgs(argv);
    } catch (error) {
        const message =
            error instanceof CliArgsError ? error.message : String(error);
        io.stderr.write(`${message}\n\n${USAGE}`);
        return 2;
    }

    if (args.help) {
        io.stdout.write(USAGE);
        return 0;
    }

    try {
        const exclude = await loadExclude(args, io);
        const limit =
            args.format === "sheets" && !args.limitSpecified
                ? 5000
                : args.limit;
        const result = await listDistrictOrgs(args.url, {
            query: args.query,
            limit,
            delayMs: args.delayMs,
            includeOutside: args.includeOutside,
            densify: args.format === "sheets" && !args.noDensify,
            exclude,
            fetch: io.fetch,
        });

        const text =
            args.format === "sheets"
                ? await buildSheets(result, args, io)
                : formatResult(result, args.format);

        if (args.out === "-") {
            io.stdout.write(text);
            return 0;
        }
        const cwd = io.cwd ?? process.cwd();
        const relative =
            args.out ??
            artifactFileName(result.district, args.format, args.query);
        const outPath = path.resolve(cwd, relative);
        const write = io.writeFile ?? writeFile;
        await write(outPath, text);
        if (args.format === "sheets") {
            io.stderr.write(
                `Wrote ${result.count} organizations on sheets to ${outPath}\n`
            );
        } else {
            io.stderr.write(
                `Wrote ${result.count} organizations to ${outPath}\n`
            );
        }
        return 0;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        io.stderr.write(`${message}\n`);
        return 1;
    }
}

async function loadExclude(args: CliArgs, io: CliIo): Promise<string[]> {
    const patterns = [...args.exclude];
    if (!args.excludeFile) return patterns;
    const cwd = io.cwd ?? process.cwd();
    const filePath = path.resolve(cwd, args.excludeFile);
    const read = io.readFile ?? ((p: string) => readFile(p, "utf8"));
    const body = await read(filePath);
    for (const line of body.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) patterns.push(trimmed);
    }
    return patterns;
}

async function buildSheets(
    result: Awaited<ReturnType<typeof listDistrictOrgs>>,
    args: CliArgs,
    io: CliIo
): Promise<string> {
    const sheets = tileOrganizations(
        result.organizations,
        result.district.bounds,
        args.maxPerSheet
    );
    const http = io.fetch ?? fetch;
    const maps: string[] = [];
    for (const sheet of sheets) {
        maps.push(
            await fetchStaticMapPng(
                sheet.bounds,
                http,
                markersForGroups(sheet.groups)
            )
        );
    }
    return renderSheetsHtml({
        district: result.district,
        sheets,
        maps,
        query: result.query,
    });
}
