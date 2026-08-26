import { test } from "node:test";
import assert from "node:assert/strict";
import { pickRepresentatives } from "./representatives.js";
import { emptyOccupancy, type Occupancy } from "../dissect/occupancy.js";

const poor: Occupancy = emptyOccupancy();
const rich: Occupancy = {
    ...emptyOccupancy(),
    has_form: true,
    has_nav: true,
    card_bucket: "4+",
};

test("6 URL 2 occupancy → length 2", () => {
    const rows = [
        { url: "https://e.test/a", occupancy: rich },
        { url: "https://e.test/b", occupancy: rich },
        { url: "https://e.test/c", occupancy: rich },
        { url: "https://e.test/d", occupancy: poor },
        { url: "https://e.test/e", occupancy: poor },
        { url: "https://e.test/f", occupancy: poor },
    ];
    const picked = pickRepresentatives(rows, 3);
    assert.equal(picked.length, 2);
});
