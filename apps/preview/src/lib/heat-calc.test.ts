import assert from "node:assert/strict";
import { test } from "node:test";
import {
    calculateHeat,
    heatLossPerDegree,
    monthBar,
    monthColor,
    type HeatEnvelope,
} from "./heat-calc.ts";

const sv3: HeatEnvelope = {
    walls: 141.5,
    roof: 96.17,
    floor: 80.85,
    windows: 46.84,
    doors: 2.67,
};

const msk = [-9, -8, -2, 6, 13, 17, 18, 16, 11, 5, -1, -6];
const spb = [-5, -5, -1, 5, 11, 16, 19, 17, 12, 6, 1, -2];

test("U matches GWD 0.296 kW/°C for 160 mm / roof 200 / window 0.3", () => {
    const h = heatLossPerDegree(sv3, 1.6, 3.85, 0.3);
    assert.equal(Number(h.toFixed(3)), 0.296);
});

test("Moscow 22°C gas matches GWD monthly prices", () => {
    const r = calculateHeat({
        envelope: sv3,
        tIn: 22,
        wallR: 1.6,
        roofR: 3.85,
        windowR: 0.3,
        fuelPrice: 6.8,
        fuelKwh: 0.118,
        temps: msk,
        skipSummer: false,
    });
    const gwd = [5480, 4790, 4242, 2737, 1591, 855, 707, 1061, 1882, 3005, 3935, 4949];
    for (let i = 0; i < 12; i++) {
        assert.equal(r.months[i].price, gwd[i], `month ${i}`);
    }
    assert.equal(Math.round(r.yearlyPrice), 35234);
    assert.equal(Math.round(r.monthlyPrice), 2936);
});

test("skip summer zeroes May-Sep like GWD API heating_in_summer=0", () => {
    const r = calculateHeat({
        envelope: sv3,
        tIn: 22,
        wallR: 1.6,
        roofR: 3.85,
        windowR: 0.3,
        fuelPrice: 6.8,
        fuelKwh: 0.118,
        temps: msk,
        skipSummer: true,
    });
    for (const i of [4, 5, 6, 7, 8]) {
        assert.equal(r.months[i].price, 0);
    }
    assert.equal(r.months[0].price, 5480);
    assert.equal(Math.round(r.yearlyPrice), 29138);
});

test("SPb 22°C AAC 300 / roof 250 / window 0.49 / gas matches GWD generic", () => {
    const r = calculateHeat({
        envelope: sv3,
        tIn: 22,
        wallR: 2.5,
        roofR: 4.81,
        windowR: 0.49,
        fuelPrice: 6.8,
        fuelKwh: 0.118,
        temps: spb,
        skipSummer: false,
    });
    assert.equal(Number(r.perDegree.toFixed(3)), 0.195);
    assert.ok(Math.abs(Math.round(r.yearlyPrice) - 21641) <= 1);
    assert.ok(Math.abs(Math.round(r.monthlyPrice) - 1803) <= 1);
});

test("electricity Moscow 22°C matches GWD 5.1 ₽/kWh path", () => {
    const r = calculateHeat({
        envelope: sv3,
        tIn: 22,
        wallR: 1.6,
        roofR: 3.85,
        windowR: 0.3,
        fuelPrice: 5,
        fuelKwh: 1.02,
        temps: msk,
        skipSummer: false,
    });
    assert.equal(r.months[0].price, 34829);
    assert.equal(Math.round(r.yearlyPrice), 223943);
});

test("month bar and color", () => {
    assert.equal(monthColor(-9), "#9BD2FF");
    assert.equal(monthColor(6), "#C6E2FF");
    assert.equal(monthColor(17), "#FCBC8E");
    assert.ok(monthBar(-25) === 0);
    assert.ok(monthBar(25) === 1);
});
