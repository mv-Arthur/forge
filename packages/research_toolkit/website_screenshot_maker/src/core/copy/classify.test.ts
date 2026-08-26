import { test } from "node:test";
import assert from "node:assert/strict";
import { blocksFromRaw, isNumericText } from "./classify.js";
import type { RawCopyNode } from "./collect.js";
import type { CopySlot } from "./types.js";

function node(partial: Partial<RawCopyNode> & { tag: string; selector: string }): RawCopyNode {
    return {
        text: "",
        ownText: "",
        href: null,
        placeholder: null,
        alt: null,
        ariaLabel: null,
        slotHint: "main",
        fontSize: 16,
        isButton: false,
        inputType: "",
        y: 0,
        ...partial,
    };
}

test("isNumericText accepts 12, 97%, 82 000", () => {
    assert.equal(isNumericText("12"), true);
    assert.equal(isNumericText("97%"), true);
    assert.equal(isNumericText("82 000"), true);
    assert.equal(isNumericText("лет на рынке"), false);
});

test("first main h1 → hero; later h2 stays main", () => {
    const blocks = blocksFromRaw([
        node({ tag: "H1", text: "Готовые проекты", selector: "[data-wsm-copy=\"0\"]" }),
        node({ tag: "H2", text: "Каталог", selector: "[data-wsm-copy=\"1\"]" }),
    ]);
    assert.equal(blocks[0].role, "h1");
    assert.equal(blocks[0].slot, "hero");
    assert.equal(blocks[1].role, "h2");
    assert.equal(blocks[1].slot, "main");
});

test("short line before h1 → eyebrow in hero", () => {
    const blocks = blocksFromRaw([
        node({
            tag: "P",
            text: "Дома под ключ",
            selector: "[data-wsm-copy=\"0\"]",
        }),
        node({ tag: "H1", text: "Готовые проекты", selector: "[data-wsm-copy=\"1\"]" }),
    ]);
    assert.equal(blocks[0].role, "eyebrow");
    assert.equal(blocks[0].slot, "hero");
    assert.equal(blocks[1].role, "h1");
    assert.equal(blocks[1].slot, "hero");
});

test("nav links and header links", () => {
    const blocks = blocksFromRaw([
        node({
            tag: "A",
            text: "Проекты",
            href: "https://ex.test/projects",
            slotHint: "nav",
            selector: "[data-wsm-copy=\"0\"]",
        }),
        node({
            tag: "A",
            text: "Телефон",
            href: "tel:+1",
            slotHint: "header",
            selector: "[data-wsm-copy=\"1\"]",
        }),
    ]);
    assert.equal(blocks[0].role, "nav");
    assert.equal(blocks[0].slot, "nav");
    assert.equal(blocks[1].role, "nav");
    assert.equal(blocks[1].slot, "header");
});

test("form: label, placeholder, submit cta", () => {
    const blocks = blocksFromRaw([
        node({
            tag: "LABEL",
            text: "Имя",
            slotHint: "form",
            selector: "[data-wsm-copy=\"0\"]",
        }),
        node({
            tag: "INPUT",
            text: "",
            placeholder: "Ваше имя",
            slotHint: "form",
            selector: "[data-wsm-copy=\"1\"]",
            inputType: "text",
        }),
        node({
            tag: "BUTTON",
            text: "Позвоните мне",
            slotHint: "form",
            isButton: true,
            selector: "[data-wsm-copy=\"2\"]",
        }),
    ]);
    const roles = blocks.map((b) => b.role);
    assert.deepEqual(roles, ["form-label", "placeholder", "cta"]);
    assert.equal(blocks[1].source, "attr");
    assert.equal(blocks[2].slot, "form");
});

test("numeric + short sibling → kpi pair", () => {
    const blocks = blocksFromRaw([
        node({
            tag: "DIV",
            text: "12",
            ownText: "12",
            selector: "[data-wsm-copy=\"0\"]",
        }),
        node({
            tag: "DIV",
            text: "лет на рынке",
            selector: "[data-wsm-copy=\"1\"]",
        }),
    ]);
    assert.equal(blocks.length, 2);
    assert.equal(blocks[0].role, "kpi-value");
    assert.equal(blocks[0].text, "12");
    assert.equal(blocks[1].role, "kpi-label");
});

test("img alt is attr; p after h2 keeps nearbyHeading", () => {
    const blocks = blocksFromRaw([
        node({ tag: "H2", text: "Каталог", selector: "[data-wsm-copy=\"0\"]" }),
        node({
            tag: "IMG",
            text: "",
            alt: "офис",
            slotHint: "footer" as CopySlot,
            selector: "[data-wsm-copy=\"1\"]",
        }),
        node({
            tag: "P",
            text: "Фото и цена из прайса.",
            selector: "[data-wsm-copy=\"2\"]",
        }),
    ]);
    const alt = blocks.find((b) => b.role === "alt");
    assert.ok(alt);
    assert.equal(alt.source, "attr");
    const body = blocks.find((b) => b.role === "body");
    assert.equal(body?.nearbyHeading, "Каталог");
});

test("duplicate nav text+href collapsed", () => {
    const link = node({
        tag: "A",
        text: "Проекты",
        href: "https://ex.test/projects",
        slotHint: "nav",
        selector: "[data-wsm-copy=\"0\"]",
    });
    const blocks = blocksFromRaw([
        link,
        { ...link, selector: "[data-wsm-copy=\"1\"]" },
    ]);
    assert.equal(blocks.length, 1);
});
