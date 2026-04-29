"use client";

import styles from "./RangeSlider.module.css";

interface RangeSliderProps {
    min: number;
    max: number;
    step: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    format?: (n: number) => string;
}

export function RangeSlider({
    min,
    max,
    step,
    value,
    onChange,
    format = (n) => String(n),
}: RangeSliderProps) {
    const [lo, hi] = value;
    const span = max - min || 1;
    const trackLeft = ((Math.max(lo, min) - min) / span) * 100;
    const trackRight = ((max - Math.min(hi, max)) / span) * 100;

    return (
        <div className={styles.root}>
            <div className={styles.labels}>
                <span>{format(lo)}</span>
                <span>{format(hi)}</span>
            </div>
            <div className={styles.slider}>
                <div className={styles.track} />
                <div
                    className={styles.range}
                    style={{ left: `${trackLeft}%`, right: `${trackRight}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={lo}
                    onChange={(e) => {
                        const v = Math.min(Number(e.target.value), hi - step);
                        onChange([Math.max(v, min), hi]);
                    }}
                    className={`${styles.input} ${styles.inputLow}`}
                    aria-label="Минимум"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={hi}
                    onChange={(e) => {
                        const v = Math.max(Number(e.target.value), lo + step);
                        onChange([lo, Math.min(v, max)]);
                    }}
                    className={`${styles.input} ${styles.inputHigh}`}
                    aria-label="Максимум"
                />
            </div>
        </div>
    );
}
