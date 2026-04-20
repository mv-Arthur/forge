"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProjectPickerContent } from "@/lib/constants";
import styles from "./ProjectPicker.module.css";

interface ProjectPickerProps {
    title: ProjectPickerContent["title"];
    text: ProjectPickerContent["text"];
    price: ProjectPickerContent["price"];
    area: ProjectPickerContent["area"];
    technologies: ProjectPickerContent["technologies"];
    floors: ProjectPickerContent["floors"];
    submitLabel: ProjectPickerContent["submitLabel"];
    overlap?: boolean;
}

const numberFormat = new Intl.NumberFormat("ru-RU");

function formatPrice(value: number) {
    return numberFormat.format(value);
}

function formatArea(value: number) {
    return `${numberFormat.format(value)} м²`;
}

function parseDigits(raw: string) {
    const digits = raw.replace(/\D/g, "");
    return digits === "" ? null : Number(digits);
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export function ProjectPicker({
    title,
    text,
    price,
    area,
    technologies,
    floors,
    submitLabel,
    overlap = false,
}: ProjectPickerProps) {
    const router = useRouter();
    const [priceMin, setPriceMin] = useState(price.min);
    const [priceMax, setPriceMax] = useState(price.max);
    const [areaMin, setAreaMin] = useState(area.min);
    const [areaMax, setAreaMax] = useState(area.max);
    const [priceMinDraft, setPriceMinDraft] = useState(formatPrice(price.min));
    const [priceMaxDraft, setPriceMaxDraft] = useState(formatPrice(price.max));
    const [areaMinDraft, setAreaMinDraft] = useState(formatArea(area.min));
    const [areaMaxDraft, setAreaMaxDraft] = useState(formatArea(area.max));
    const [tech, setTech] = useState("");
    const [floor, setFloor] = useState("");

    const pricePercentMin =
        ((priceMin - price.min) / (price.max - price.min)) * 100;
    const pricePercentMax =
        ((priceMax - price.min) / (price.max - price.min)) * 100;
    const areaPercentMin = ((areaMin - area.min) / (area.max - area.min)) * 100;
    const areaPercentMax = ((areaMax - area.min) / (area.max - area.min)) * 100;

    function commitPriceMin() {
        const parsed = parseDigits(priceMinDraft);
        const next =
            parsed === null ? priceMin : clamp(parsed, price.min, priceMax);
        setPriceMin(next);
        setPriceMinDraft(formatPrice(next));
    }

    function commitPriceMax() {
        const parsed = parseDigits(priceMaxDraft);
        const next =
            parsed === null ? priceMax : clamp(parsed, priceMin, price.max);
        setPriceMax(next);
        setPriceMaxDraft(formatPrice(next));
    }

    function commitAreaMin() {
        const parsed = parseDigits(areaMinDraft);
        const next =
            parsed === null ? areaMin : clamp(parsed, area.min, areaMax);
        setAreaMin(next);
        setAreaMinDraft(formatArea(next));
    }

    function commitAreaMax() {
        const parsed = parseDigits(areaMaxDraft);
        const next =
            parsed === null ? areaMax : clamp(parsed, areaMin, area.max);
        setAreaMax(next);
        setAreaMaxDraft(formatArea(next));
    }

    function syncPriceMin(value: number) {
        setPriceMin(value);
        setPriceMinDraft(formatPrice(value));
    }

    function syncPriceMax(value: number) {
        setPriceMax(value);
        setPriceMaxDraft(formatPrice(value));
    }

    function syncAreaMin(value: number) {
        setAreaMin(value);
        setAreaMinDraft(formatArea(value));
    }

    function syncAreaMax(value: number) {
        setAreaMax(value);
        setAreaMaxDraft(formatArea(value));
    }

    function handleSubmit() {
        const params = new URLSearchParams();
        if (priceMin !== price.min) params.set("priceMin", String(priceMin));
        if (priceMax !== price.max) params.set("priceMax", String(priceMax));
        if (areaMin !== area.min) params.set("areaMin", String(areaMin));
        if (areaMax !== area.max) params.set("areaMax", String(areaMax));
        if (tech) params.set("tech", tech);
        if (floor) params.set("floors", floor);
        const query = params.toString();
        router.push(query ? `/projects?${query}` : "/projects");
    }

    return (
        <section
            className={
                overlap
                    ? `${styles.widget} ${styles.widgetOverlap}`
                    : styles.widget
            }
        >
            <div className={styles.wrapper}>
                <div className={styles.heading}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.text}>{text}</p>
                </div>

                <div className={styles.field}>
                    <h3 className={styles.fieldTitle}>Цена (руб.)</h3>
                    <div className={styles.rangeInputs}>
                        <input
                            className={styles.numberInput}
                            type="text"
                            inputMode="numeric"
                            value={priceMinDraft}
                            aria-label="Цена от"
                            onChange={(e) => setPriceMinDraft(e.target.value)}
                            onBlur={commitPriceMin}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") e.currentTarget.blur();
                            }}
                        />
                        <input
                            className={styles.numberInput}
                            type="text"
                            inputMode="numeric"
                            value={priceMaxDraft}
                            aria-label="Цена до"
                            onChange={(e) => setPriceMaxDraft(e.target.value)}
                            onBlur={commitPriceMax}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") e.currentTarget.blur();
                            }}
                        />
                    </div>
                    <div className={styles.slider}>
                        <div className={styles.sliderTrack} />
                        <div
                            className={styles.sliderRange}
                            style={{
                                left: `${pricePercentMin}%`,
                                right: `${100 - pricePercentMax}%`,
                            }}
                        />
                        <input
                            className={styles.sliderInput}
                            type="range"
                            min={price.min}
                            max={price.max}
                            value={priceMin}
                            aria-label="Минимальная цена"
                            onChange={(e) =>
                                syncPriceMin(
                                    Math.min(Number(e.target.value), priceMax)
                                )
                            }
                        />
                        <input
                            className={styles.sliderInput}
                            type="range"
                            min={price.min}
                            max={price.max}
                            value={priceMax}
                            aria-label="Максимальная цена"
                            onChange={(e) =>
                                syncPriceMax(
                                    Math.max(Number(e.target.value), priceMin)
                                )
                            }
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <h3 className={styles.fieldTitle}>Площадь</h3>
                    <div className={styles.rangeInputs}>
                        <input
                            className={styles.numberInput}
                            type="text"
                            inputMode="numeric"
                            value={areaMinDraft}
                            aria-label="Площадь от"
                            onChange={(e) => setAreaMinDraft(e.target.value)}
                            onBlur={commitAreaMin}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") e.currentTarget.blur();
                            }}
                        />
                        <input
                            className={styles.numberInput}
                            type="text"
                            inputMode="numeric"
                            value={areaMaxDraft}
                            aria-label="Площадь до"
                            onChange={(e) => setAreaMaxDraft(e.target.value)}
                            onBlur={commitAreaMax}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") e.currentTarget.blur();
                            }}
                        />
                    </div>
                    <div className={styles.slider}>
                        <div className={styles.sliderTrack} />
                        <div
                            className={styles.sliderRange}
                            style={{
                                left: `${areaPercentMin}%`,
                                right: `${100 - areaPercentMax}%`,
                            }}
                        />
                        <input
                            className={styles.sliderInput}
                            type="range"
                            min={area.min}
                            max={area.max}
                            value={areaMin}
                            aria-label="Минимальная площадь"
                            onChange={(e) =>
                                syncAreaMin(
                                    Math.min(Number(e.target.value), areaMax)
                                )
                            }
                        />
                        <input
                            className={styles.sliderInput}
                            type="range"
                            min={area.min}
                            max={area.max}
                            value={areaMax}
                            aria-label="Максимальная площадь"
                            onChange={(e) =>
                                syncAreaMax(
                                    Math.max(Number(e.target.value), areaMin)
                                )
                            }
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <h3 className={styles.fieldTitle}>Технология</h3>
                    <select
                        className={styles.select}
                        value={tech}
                        onChange={(e) => setTech(e.target.value)}
                        aria-label="Технология"
                    >
                        {technologies.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <h3 className={styles.fieldTitle}>Количество этажей</h3>
                    <select
                        className={styles.select}
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        aria-label="Количество этажей"
                    >
                        {floors.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.submitCell}>
                    <button
                        type="button"
                        className={styles.submit}
                        onClick={handleSubmit}
                    >
                        {submitLabel}
                    </button>
                </div>
            </div>
        </section>
    );
}
