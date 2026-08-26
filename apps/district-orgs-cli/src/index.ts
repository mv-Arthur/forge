#!/usr/bin/env node
import { runCli } from "./run-cli.ts";

const code = await runCli(process.argv.slice(2), {
    stdout: process.stdout,
    stderr: process.stderr,
});
process.exitCode = code;
