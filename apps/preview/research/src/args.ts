export type CliMode = "capture" | "atlas" | "copy";

export type CliArgs = {
    mode: CliMode;
    configPath: string;
};

/** Parse argv after node/tsx and the script path (process.argv.slice(2)). */
export function parseCliArgs(argv: string[]): CliArgs {
    const rest = argv.filter((a) => a !== "-h" && a !== "--help");
    if (rest[0] === "atlas" || rest[0] === "copy") {
        return { mode: rest[0], configPath: rest[1] ?? "" };
    }
    return { mode: "capture", configPath: rest[0] ?? "" };
}
