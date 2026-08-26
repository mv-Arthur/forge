export type OutputFormat = "json" | "ndjson" | "table" | "sheets";

export interface CliArgs {
    url: string;
    query: string;
    limit: number;
    limitSpecified: boolean;
    format: OutputFormat;
    out: string | null;
    includeOutside: boolean;
    delayMs: number;
    exclude: string[];
    excludeFile: string | null;
    maxPerSheet: number;
    noDensify: boolean;
    help: boolean;
}

export class CliArgsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CliArgsError";
    }
}

const FORMATS = new Set<OutputFormat>(["json", "ndjson", "table", "sheets"]);

const HELP_DEFAULTS: CliArgs = {
    url: "",
    query: "",
    limit: 100,
    limitSpecified: false,
    format: "json",
    out: null,
    includeOutside: false,
    delayMs: 250,
    exclude: [],
    excludeFile: null,
    maxPerSheet: 48,
    noDensify: false,
    help: true,
};

export const USAGE = `Usage: district-orgs <district-url> [options]

List organizations in a Yandex Maps district.

Arguments:
  <district-url>   Maps geo URL, e.g.
                   https://yandex.ru/maps/213/moscow/geo/rayon_bibirevo/53211689/

Options:
  -q, --query <text>        Search text (default: empty = businesses in bounds)
  -n, --limit <number>      Max organizations (default: 100, sheets: 5000)
  -f, --format <name>       json | ndjson | table | sheets (default: json)
  -o, --out <path>          Output file in cwd
                            (default: district-orgs-{slug}-{geoId}.json)
                            Use - for stdout
      --exclude <text>      Drop orgs whose title or category contains text
                            Repeatable
      --exclude-file <path> Blacklist file, one pattern per line
      --max-per-sheet <n>   Max orgs on one sheets page (default: 48)
      --no-densify          Do not grid-search extra cells (sheets only)
      --include-outside     Do not clip results to the district polygon
      --delay-ms <n>        Pause between search pages (default: 250)
  -h, --help                Show this help
`;

export function parseCliArgs(argv: string[]): CliArgs {
    const flags = new Map<string, string | boolean>();
    const positionals: string[] = [];

    for (let i = 0; i < argv.length; i += 1) {
        const token = argv[i];
        if (token == null) break;
        if (token === "--") {
            continue;
        }
        if (token === "-h" || token === "--help") {
            flags.set("help", true);
            continue;
        }
        if (token === "--include-outside") {
            flags.set("includeOutside", true);
            continue;
        }
        if (token === "--no-densify") {
            flags.set("noDensify", true);
            continue;
        }
        const long = token.match(/^--([a-z-]+)=(.*)$/);
        if (long) {
            setFlag(flags, long[1], long[2]);
            continue;
        }
        if (token.startsWith("--") || token.startsWith("-")) {
            const name = normalizeFlag(token);
            const next = argv[i + 1];
            if (next == null || (next.startsWith("-") && next !== "-")) {
                throw new CliArgsError(`Missing value for ${token}`);
            }
            setFlag(flags, name, next);
            i += 1;
            continue;
        }
        positionals.push(token);
    }

    if (flags.get("help") === true) {
        return HELP_DEFAULTS;
    }

    const url = positionals[0];
    if (!url) {
        throw new CliArgsError("District URL is required");
    }
    if (positionals.length > 1) {
        throw new CliArgsError(
            `Unexpected extra arguments: ${positionals.slice(1).join(" ")}`
        );
    }

    const formatRaw = String(flags.get("format") ?? "json");
    if (!FORMATS.has(formatRaw as OutputFormat)) {
        throw new CliArgsError(
            `Unknown format "${formatRaw}". Use json, ndjson, table, or sheets.`
        );
    }

    return {
        url,
        query: String(flags.get("query") ?? ""),
        limit: parsePositiveInt(flags.get("limit"), 100, "--limit"),
        limitSpecified: flags.has("limit"),
        format: formatRaw as OutputFormat,
        out: flags.has("out") ? String(flags.get("out")) : null,
        includeOutside: flags.get("includeOutside") === true,
        delayMs: parsePositiveInt(flags.get("delay-ms"), 250, "--delay-ms"),
        exclude: parseExclude(flags.get("exclude")),
        excludeFile: flags.has("exclude-file")
            ? String(flags.get("exclude-file"))
            : null,
        maxPerSheet: parsePositiveInt(
            flags.get("max-per-sheet"),
            48,
            "--max-per-sheet"
        ),
        noDensify: flags.get("noDensify") === true,
        help: false,
    };
}

function setFlag(
    flags: Map<string, string | boolean>,
    name: string,
    value: string
): void {
    if (name === "exclude") {
        const prev = flags.get("exclude");
        flags.set(
            "exclude",
            typeof prev === "string" ? `${prev}\n${value}` : value
        );
        return;
    }
    flags.set(name, value);
}

function parseExclude(value: string | boolean | undefined): string[] {
    if (typeof value !== "string" || !value) return [];
    return value
        .split(/[\n,]/)
        .map((part) => part.trim())
        .filter(Boolean);
}

function normalizeFlag(token: string): string {
    switch (token) {
        case "-q":
        case "--query":
            return "query";
        case "-n":
        case "--limit":
            return "limit";
        case "-f":
        case "--format":
            return "format";
        case "-o":
        case "--out":
            return "out";
        case "--delay-ms":
            return "delay-ms";
        case "--exclude":
            return "exclude";
        case "--exclude-file":
            return "exclude-file";
        case "--max-per-sheet":
            return "max-per-sheet";
        default:
            throw new CliArgsError(`Unknown option ${token}`);
    }
}

function parsePositiveInt(
    value: string | boolean | undefined,
    fallback: number,
    flag: string
): number {
    if (value == null || value === false) return fallback;
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
        throw new CliArgsError(`${flag} must be a non-negative integer`);
    }
    return n;
}
