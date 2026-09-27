import assert from "node:assert/strict";
import { test } from "node:test";
import {
    HIT_SALES,
    LINE_TITLE,
    POPULAR_BATH_TAB,
    POPULAR_INDIVIDUAL_TAB,
} from "@/lib/copy";
import {
    buildCatalogSections,
    pinFilled,
    type CatalogSectionProject,
} from "./sections";

function row(
    slug: string,
    projectClass: CatalogSectionProject["projectClass"],
    detailFilled = false
): CatalogSectionProject {
    return { slug, projectClass, detailFilled };
}

const favor = row("favor", "serial", true);
const lester = row("lester", "serial");
const don = row("don", "serial");
const arkada = row("arkada", "serial");
const fort = row("fort", "serial", true);
const brig = row("brig", "individual", true);
const wald = row("wald", "individual");
const banya = row("banya-levashovo", "bath", true);

test("pinFilled moves hits to the front", () => {
    assert.deepEqual(
        pinFilled([lester, favor, don]).map((p) => p.slug),
        ["favor", "lester", "don"]
    );
});

test("all kinds: mixed hits section first, hits removed below", () => {
    const sections = buildCatalogSections(
        [don, arkada, lester, favor, wald, brig, banya],
        []
    );
    assert.equal(sections[0]?.key, "hits");
    assert.equal(sections[0]?.title, HIT_SALES);
    assert.deepEqual(
        sections[0]?.projects.map((p) => p.slug),
        ["favor", "brig", "banya-levashovo"]
    );
    assert.deepEqual(
        sections.map((s) => s.title),
        [
            HIT_SALES,
            LINE_TITLE.scandi,
            LINE_TITLE.barn,
            LINE_TITLE.modern,
            POPULAR_INDIVIDUAL_TAB,
        ]
    );
    const modern = sections.find((s) => s.key === "line:modern");
    assert.deepEqual(
        modern?.projects.map((p) => p.slug),
        ["lester"]
    );
});

test("explicit three kinds matches empty kind", () => {
    const projects = [favor, lester, brig, banya];
    const empty = buildCatalogSections(projects, []).map((s) => s.key);
    const all = buildCatalogSections(projects, [
        "serial",
        "individual",
        "bath",
    ]).map((s) => s.key);
    assert.deepEqual(empty, all);
});

test("serial only: modern (hit) first, no mixed hits section", () => {
    const sections = buildCatalogSections(
        [don, arkada, lester, favor],
        ["serial"]
    );
    assert.deepEqual(
        sections.map((s) => s.title),
        [LINE_TITLE.modern, LINE_TITLE.scandi, LINE_TITLE.barn]
    );
    assert.equal(
        sections.some((s) => s.key === "hits"),
        false
    );
    assert.deepEqual(
        sections[0]?.projects.map((p) => p.slug),
        ["favor", "lester"]
    );
});

test("serial+individual: hit sections first, then remaining lines", () => {
    const sections = buildCatalogSections(
        [don, arkada, lester, favor, wald, brig],
        ["serial", "individual"]
    );
    assert.deepEqual(
        sections.map((s) => s.title),
        [
            LINE_TITLE.modern,
            POPULAR_INDIVIDUAL_TAB,
            LINE_TITLE.scandi,
            LINE_TITLE.barn,
        ]
    );
    assert.equal(
        sections.some((s) => s.key === "hits"),
        false
    );
    assert.deepEqual(
        sections[1]?.projects.map((p) => p.slug),
        ["brig", "wald"]
    );
});

test("two serial hits: earlier LINE_ORDER hit stays first", () => {
    const sections = buildCatalogSections(
        [don, lester, favor, fort],
        ["serial"]
    );
    assert.deepEqual(
        sections.map((s) => s.title),
        [LINE_TITLE.modern, LINE_TITLE.classic, LINE_TITLE.scandi]
    );
});

test("serial+bath: modern then bath, then remaining lines", () => {
    const sections = buildCatalogSections(
        [don, arkada, lester, favor, banya],
        ["serial", "bath"]
    );
    assert.deepEqual(
        sections.map((s) => s.title),
        [
            LINE_TITLE.modern,
            POPULAR_BATH_TAB,
            LINE_TITLE.scandi,
            LINE_TITLE.barn,
        ]
    );
});

test("individual only: individual section, hit pinned", () => {
    const sections = buildCatalogSections([wald, brig], ["individual"]);
    assert.deepEqual(
        sections.map((s) => s.title),
        [POPULAR_INDIVIDUAL_TAB]
    );
    assert.deepEqual(
        sections[0]?.projects.map((p) => p.slug),
        ["brig", "wald"]
    );
});

test("bath only: bath section", () => {
    const sections = buildCatalogSections([banya], ["bath"]);
    assert.deepEqual(
        sections.map((s) => s.title),
        [POPULAR_BATH_TAB]
    );
});
