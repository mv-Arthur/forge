import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CliArgsError, parseCliArgs } from "./parse-cli-args.ts";

const URL = "https://yandex.ru/maps/213/moscow/geo/rayon_bibirevo/53211689/";

describe("parseCliArgs", () => {
    it("parses a URL with defaults", () => {
        const args = parseCliArgs([URL]);
        assert.equal(args.url, URL);
        assert.equal(args.query, "");
        assert.equal(args.limit, 100);
        assert.equal(args.format, "json");
        assert.equal(args.out, null);
        assert.equal(args.limitSpecified, false);
        assert.equal(args.maxPerSheet, 48);
        assert.equal(args.help, false);
    });

    it("ignores a lone -- from pnpm/npm", () => {
        const args = parseCliArgs(["--", URL, "-n", "8", "-f", "table"]);
        assert.equal(args.url, URL);
        assert.equal(args.limit, 8);
        assert.equal(args.format, "table");
    });

    it("accepts -o - for stdout", () => {
        const args = parseCliArgs([URL, "-o", "-"]);
        assert.equal(args.out, "-");
    });

    it("parses short flags", () => {
        const args = parseCliArgs([
            URL,
            "-q",
            "кафе",
            "-n",
            "20",
            "-f",
            "table",
            "-o",
            "out.json",
        ]);
        assert.equal(args.query, "кафе");
        assert.equal(args.limit, 20);
        assert.equal(args.format, "table");
        assert.equal(args.out, "out.json");
    });

    it("parses help without a URL", () => {
        const args = parseCliArgs(["--help"]);
        assert.equal(args.help, true);
    });

    it("rejects a missing URL", () => {
        assert.throws(() => parseCliArgs([]), CliArgsError);
    });

    it("rejects an unknown format", () => {
        assert.throws(() => parseCliArgs([URL, "-f", "csv"]), CliArgsError);
    });

    it("collects repeatable --exclude patterns", () => {
        const args = parseCliArgs([
            URL,
            "-f",
            "sheets",
            "--exclude",
            "МФЦ",
            "--exclude",
            "поликлиника",
        ]);
        assert.equal(args.format, "sheets");
        assert.deepEqual(args.exclude, ["МФЦ", "поликлиника"]);
    });
});
