"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import optionsJson from "@data/fixtures/heat-calc.json";
import {
    DETAIL_CALC_AREAS,
    DETAIL_CALC_CITY,
    DETAIL_CALC_DOORS_AREA,
    DETAIL_CALC_FLOOR_AREA,
    DETAIL_CALC_FUEL,
    DETAIL_CALC_LOSS,
    DETAIL_CALC_PER_MONTH,
    DETAIL_CALC_ROOF,
    DETAIL_CALC_ROOF_AREA,
    DETAIL_CALC_SKIP_SUMMER,
    DETAIL_CALC_TEMP,
    DETAIL_CALC_TITLE,
    DETAIL_CALC_WALLS,
    DETAIL_CALC_WALLS_AREA,
    DETAIL_CALC_WINDOWS,
    DETAIL_CALC_WINDOWS_AREA,
} from "@/lib/copy";
import {
    calculateHeat,
    formatKwh,
    formatKwPerC,
    formatRub,
    type HeatCity,
    type HeatEnvelope,
    type HeatFuel,
    type HeatOption,
} from "@/lib/heat-calc";
import { ChevronDownIcon, CloseIcon } from "@/ui/icons";
import type { HeatCalcLayout } from "./heat-calc.types";
import styles from "./heat-calc.module.css";

type Options = {
    walls: HeatOption[];
    roofs: HeatOption[];
    windows: HeatOption[];
    fuels: HeatFuel[];
    cities: HeatCity[];
    defaultEnvelope: HeatEnvelope;
};

const options = optionsJson as Options;
const fallbackEnvelope: HeatEnvelope = {
    walls: 150,
    roof: 150,
    floor: 150,
    windows: 50,
    doors: 10,
};
const defaultWall = options.walls.find((w) => w.default) ?? options.walls[0];
const defaultRoof = options.roofs.find((w) => w.default) ?? options.roofs[0];
const defaultWindow =
    options.windows.find((w) => w.default) ?? options.windows[0];
const defaultFuel = options.fuels[0];
const defaultCity =
    options.cities.find((c) => c.id === "saint_petersburg") ??
    options.cities[0];

function pick<T extends { id: string }>(list: T[], id: string, fallback: T): T {
    return list.find((x) => x.id === id) ?? fallback;
}

function parseNonNeg(raw: string, prev: number): number {
    if (raw === "") return 0;
    const n = Number(raw.replace(",", "."));
    return Number.isFinite(n) && n >= 0 ? n : prev;
}

export function HeatCalc({
    projectName,
    envelope: envelopeProp,
    onClose,
    layout = "dialog",
}: {
    projectName?: string;
    envelope?: HeatEnvelope;
    onClose?: () => void;
    layout?: HeatCalcLayout;
}) {
    const isPage = layout === "page";
    const [draftEnvelope, setDraftEnvelope] = useState<HeatEnvelope>(
        () => envelopeProp ?? options.defaultEnvelope ?? fallbackEnvelope,
    );
    const envelope =
        !isPage && envelopeProp ? envelopeProp : draftEnvelope;
    const [tIn, setTIn] = useState(22);
    const [cityId, setCityId] = useState(defaultCity.id);
    const [cityQuery, setCityQuery] = useState(defaultCity.name);
    const [cityOpen, setCityOpen] = useState(false);
    const [wallId, setWallId] = useState(defaultWall.id);
    const [roofId, setRoofId] = useState(defaultRoof.id);
    const [windowId, setWindowId] = useState(defaultWindow.id);
    const [fuelId, setFuelId] = useState(defaultFuel.id);
    const [fuelPrices, setFuelPrices] = useState<Record<string, number>>(() =>
        Object.fromEntries(options.fuels.map((f) => [f.id, f.price])),
    );
    const [skipSummer, setSkipSummer] = useState(false);
    const [sheetUp, setSheetUp] = useState(false);
    const cityBox = useRef<HTMLDivElement>(null);

    const city = pick(options.cities, cityId, defaultCity);
    const wall = pick(options.walls, wallId, defaultWall);
    const roof = pick(options.roofs, roofId, defaultRoof);
    const windowOpt = pick(options.windows, windowId, defaultWindow);
    const fuel = pick(options.fuels, fuelId, defaultFuel);
    const fuelPrice = fuelPrices[fuel.id] ?? fuel.price;

    const result = useMemo(
        () =>
            calculateHeat({
                envelope,
                tIn,
                wallR: wall.r0,
                roofR: roof.r0,
                windowR: windowOpt.r0,
                fuelPrice,
                fuelKwh: fuel.kwh,
                temps: city.temps,
                skipSummer,
            }),
        [envelope, tIn, wall, roof, windowOpt, fuelPrice, fuel, city, skipSummer],
    );

    const cityHits = options.cities.filter((c) =>
        c.name.toLowerCase().includes(cityQuery.trim().toLowerCase()),
    );

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!cityBox.current?.contains(e.target as Node)) setCityOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    function setArea(key: keyof HeatEnvelope, raw: string) {
        setDraftEnvelope((prev) => ({
            ...prev,
            [key]: parseNonNeg(raw, prev[key]),
        }));
    }

    return (
        <div
            className={styles.overlay}
            data-layout={layout}
            data-section="heat-calc"
        >
            {isPage ? null : (
                <button
                    type="button"
                    className={styles.backdrop}
                    aria-label="Закрыть"
                    onClick={onClose}
                />
            )}
            <div className={styles.stage}>
        <div
            className={styles.shell}
            role={isPage ? undefined : "dialog"}
            aria-modal={isPage ? undefined : "true"}
            aria-labelledby={isPage ? undefined : "heat-calc-title"}
        >
            {isPage ? null : (
            <div className={styles.head}>
                <h2 id="heat-calc-title" className={styles.headTitle}>
                    {DETAIL_CALC_TITLE} проекта {projectName}
                </h2>
                <button
                    type="button"
                    className={styles.close}
                    aria-label="Закрыть"
                    onClick={onClose}
                >
                    <CloseIcon />
                </button>
            </div>
            )}
            <div className={styles.main}>
                <div className={styles.controls}>
                    <div>
                    <label className={styles.label} htmlFor="heat-temp">
                        {DETAIL_CALC_TEMP}
                    </label>
                    <div className={styles.sliderBox}>
                        <input
                            id="heat-temp"
                            type="range"
                            min={18}
                            max={26}
                            step={1}
                            value={tIn}
                            onChange={(e) => setTIn(Number(e.target.value))}
                            className={styles.slider}
                            aria-valuemin={18}
                            aria-valuemax={26}
                            aria-valuenow={tIn}
                        />
                        <div className={styles.ticks}>
                            {[18, 20, 22, 24, 26].map((n) => (
                                <span key={n}>{n}</span>
                            ))}
                        </div>
                    </div>

                    <label className={styles.label} htmlFor="heat-city">
                        {DETAIL_CALC_CITY}
                    </label>
                    <div className={styles.city} ref={cityBox}>
                        <input
                            id="heat-city"
                            className={styles.cityInput}
                            value={cityQuery}
                            onChange={(e) => {
                                setCityQuery(e.target.value);
                                setCityOpen(true);
                            }}
                            onFocus={() => setCityOpen(true)}
                            autoComplete="off"
                        />
                        {cityOpen ? (
                            <ul className={styles.suggest}>
                                {cityHits.map((c) => (
                                    <li key={c.id}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCityId(c.id);
                                                setCityQuery(c.name);
                                                setCityOpen(false);
                                            }}
                                        >
                                            {c.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>

                    <p className={styles.label}>{DETAIL_CALC_AREAS}</p>
                    <div className={styles.block}>
                        <AreaRow
                            name={DETAIL_CALC_WALLS_AREA}
                            value={envelope.walls}
                            onChange={
                                isPage
                                    ? (raw) => setArea("walls", raw)
                                    : undefined
                            }
                        />
                        <AreaRow
                            name={DETAIL_CALC_ROOF_AREA}
                            value={envelope.roof}
                            onChange={
                                isPage
                                    ? (raw) => setArea("roof", raw)
                                    : undefined
                            }
                        />
                        <AreaRow
                            name={DETAIL_CALC_FLOOR_AREA}
                            value={envelope.floor}
                            onChange={
                                isPage
                                    ? (raw) => setArea("floor", raw)
                                    : undefined
                            }
                        />
                        <AreaRow
                            name={DETAIL_CALC_WINDOWS_AREA}
                            value={envelope.windows}
                            onChange={
                                isPage
                                    ? (raw) => setArea("windows", raw)
                                    : undefined
                            }
                        />
                        <AreaRow
                            name={DETAIL_CALC_DOORS_AREA}
                            value={envelope.doors}
                            onChange={
                                isPage
                                    ? (raw) => setArea("doors", raw)
                                    : undefined
                            }
                        />
                    </div>

                    <p className={styles.label}>{DETAIL_CALC_WALLS}</p>
                    <div className={styles.block}>
                        <OptionRow
                            items={options.walls}
                            value={wallId}
                            onChange={setWallId}
                        />
                    </div>

                    <p className={styles.label}>{DETAIL_CALC_ROOF}</p>
                    <OptionRow
                        items={options.roofs}
                        value={roofId}
                        onChange={setRoofId}
                        pale
                    />
                    </div>

                    <div>
                            <p className={styles.label}>{DETAIL_CALC_WINDOWS}</p>
                            <div className={styles.block}>
                                {options.windows.map((w) => (
                                    <label key={w.id} className={styles.radio}>
                                        <input
                                            type="radio"
                                            name="heat-window"
                                            checked={windowId === w.id}
                                            onChange={() => setWindowId(w.id)}
                                        />
                                        <span className={styles.radioBox} />
                                        <span className={styles.radioName}>
                                            {w.name}
                                        </span>
                                        <span className={styles.radioR}>
                                            R<sub>0</sub> = {w.r0}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <p className={styles.label}>{DETAIL_CALC_FUEL}</p>
                            <div className={styles.block}>
                                {options.fuels.map((f) => (
                                    <label key={f.id} className={styles.radio}>
                                        <input
                                            type="radio"
                                            name="heat-fuel"
                                            checked={fuelId === f.id}
                                            onChange={() => setFuelId(f.id)}
                                        />
                                        <span className={styles.radioBox} />
                                        <span className={styles.radioName}>
                                            {f.name}
                                        </span>
                                        {fuelId === f.id ? (
                                            <span className={styles.fuelPrice}>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={String(
                                                        fuelPrices[f.id] ??
                                                            f.price,
                                                    )}
                                                    onChange={(e) => {
                                                        const n = Number(
                                                            e.target.value.replace(
                                                                ",",
                                                                ".",
                                                            ),
                                                        );
                                                        if (
                                                            Number.isFinite(n) &&
                                                            n >= 0
                                                        ) {
                                                            setFuelPrices(
                                                                (p) => ({
                                                                    ...p,
                                                                    [f.id]: n,
                                                                }),
                                                            );
                                                        } else if (
                                                            e.target.value ===
                                                            ""
                                                        ) {
                                                            setFuelPrices(
                                                                (p) => ({
                                                                    ...p,
                                                                    [f.id]: 0,
                                                                }),
                                                            );
                                                        }
                                                    }}
                                                    className={styles.fuelInput}
                                                />
                                                <span className={styles.fuelUnit}>
                                                    {f.unit}
                                                </span>
                                                <span
                                                    className={styles.fuelEq}
                                                >
                                                    {(
                                                        (fuelPrices[f.id] ??
                                                            f.price) * f.kwh
                                                    ).toFixed(2)}{" "}
                                                    ₽/кВт·ч
                                                </span>
                                            </span>
                                        ) : null}
                                    </label>
                                ))}
                            </div>
                        </div>
                </div>

                <div
                    className={styles.results}
                    data-up={sheetUp ? "true" : undefined}
                >
                    <div className={styles.summary}>
                        <div className={styles.summaryMonth}>
                            {Math.round(result.monthlyPrice).toLocaleString(
                                "ru-RU",
                            )}{" "}
                            {DETAIL_CALC_PER_MONTH}
                        </div>
                        <div className={styles.summaryYear}>
                            <div>{formatRub(result.yearlyPrice)}</div>
                            <div className={styles.muted}>
                                {formatKwh(result.yearlyKwh)}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className={styles.toggle}
                        aria-expanded={sheetUp}
                        onClick={() => setSheetUp((v) => !v)}
                    >
                        <ChevronDownIcon />
                    </button>
                    <div className={styles.loss}>
                        {DETAIL_CALC_LOSS}
                        <strong>{formatKwPerC(result.perDegree)}</strong>
                    </div>
                    <hr className={styles.hr} />
                    <label className={styles.check}>
                        <span>{DETAIL_CALC_SKIP_SUMMER}</span>
                        <input
                            type="checkbox"
                            checked={skipSummer}
                            onChange={(e) => setSkipSummer(e.target.checked)}
                        />
                    </label>
                    <div className={styles.months}>
                        {result.months.map((m) => (
                            <div key={m.name} className={styles.month}>
                                <div
                                    className={styles.bar}
                                    style={{
                                        background: m.color,
                                        width: `calc(72px + (100% - 148px) * ${m.bar})`,
                                    }}
                                >
                                    <span>{m.name}</span>
                                    <span>{m.temp}</span>
                                </div>
                                <div className={styles.amounts}>
                                    <div>{formatRub(m.price)}</div>
                                    <div className={styles.muted}>
                                        {formatKwh(m.kwh)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
            </div>
        </div>
    );
}

function AreaRow({
    name,
    value,
    onChange,
}: {
    name: string;
    value: number;
    onChange?: (raw: string) => void;
}) {
    return (
        <div className={styles.area}>
            <span>{name}</span>
            {onChange ? (
                <label className={styles.areaInput}>
                    <input
                        className={styles.areaField}
                        type="text"
                        inputMode="decimal"
                        aria-label={name}
                        value={String(value)}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    м²
                </label>
            ) : (
                <span>
                    {value} м²
                </span>
            )}
        </div>
    );
}

function OptionRow({
    items,
    value,
    onChange,
    pale = false,
}: {
    items: HeatOption[];
    value: string;
    onChange: (id: string) => void;
    pale?: boolean;
}) {
    return (
        <div className={styles.options} data-pale={pale ? "true" : undefined}>
            {items.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    className={styles.option}
                    data-on={item.id === value ? "true" : undefined}
                    onClick={() => onChange(item.id)}
                >
                    <span>{item.name}</span>
                    <span>
                        R<sub>0</sub> = {item.r0}
                    </span>
                </button>
            ))}
        </div>
    );
}
