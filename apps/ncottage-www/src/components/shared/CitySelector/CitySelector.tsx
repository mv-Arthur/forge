"use client";

import { useState } from "react";
import type { City, CityCode } from "@/lib/constants";
import styles from "./CitySelector.module.css";

interface CitySelectorProps {
    cities: City[];
    activeCity: CityCode;
    onCityChange: (code: CityCode) => void;
    className?: string;
}

export function CitySelector({
    cities,
    activeCity,
    onCityChange,
    className,
}: CitySelectorProps) {
    const [open, setOpen] = useState(false);
    const activeLabel = cities.find((c) => c.code === activeCity)?.label;
    const disabled = cities.length <= 1;

    return (
        <div
            className={`${styles.wrapper} ${className || ""}`.trim()}
        >
            <button
                type="button"
                className={styles.select}
                onClick={() => setOpen((v) => !v)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span>{activeLabel}</span>
                {!disabled && (
                    <svg
                        className={styles.chevron}
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.24985 3.8147e-05C1.10154 6.96182e-05 0.956568 0.0440736 0.833261 0.126487C0.709953 0.2089 0.613849 0.326023 0.557096 0.463048C0.500343 0.600072 0.485491 0.750847 0.514417 0.896312C0.543343 1.04178 0.614747 1.1754 0.719604 1.28029L4.4696 5.03029C4.61025 5.17089 4.80098 5.24988 4.99985 5.24988C5.19873 5.24988 5.38946 5.17089 5.5301 5.03029L9.2801 1.28029C9.38496 1.1754 9.45637 1.04178 9.48529 0.896312C9.51422 0.750847 9.49937 0.600072 9.44261 0.463048C9.38586 0.326023 9.28976 0.2089 9.16645 0.126487C9.04314 0.0440736 8.89817 6.96182e-05 8.74985 3.8147e-05L1.24985 3.8147e-05Z"
                            fill="currentColor"
                        />
                    </svg>
                )}
            </button>
            {!disabled && (
                <ul
                    className={`${styles.options} ${open ? styles.optionsOpen : ""}`}
                    role="listbox"
                    aria-hidden={!open}
                >
                    {cities.map((c) => (
                        <li
                            key={c.code}
                            className={styles.option}
                            role="option"
                            aria-selected={c.code === activeCity}
                            onClick={() => {
                                onCityChange(c.code);
                                setOpen(false);
                            }}
                        >
                            {c.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
