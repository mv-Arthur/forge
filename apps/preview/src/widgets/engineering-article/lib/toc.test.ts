import assert from "node:assert/strict";
import { test } from "node:test";
import { articleToc } from "./toc.ts";

test("articleToc keeps h2/h3 order and drops the rest", () => {
    assert.deepEqual(
        articleToc([
            { type: "p", text: "intro" },
            { type: "h2", id: "design", text: "Проектирование" },
            { type: "h3", id: "collector", text: "Коллектор" },
            { type: "ul", items: ["a"] },
            { type: "h2", id: "install", text: "Монтаж" },
        ]),
        [
            { id: "design", text: "Проектирование", level: 2 },
            { id: "collector", text: "Коллектор", level: 3 },
            { id: "install", text: "Монтаж", level: 2 },
        ],
    );
});
