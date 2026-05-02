"use client";

import { useEffect, useRef, useState } from "react";
import type { City, CityCode } from "@/content/contacts";
import { CheckIcon, ChevronDownIcon } from "@/components/ui/icons";
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
    const wrapperRef = useRef<HTMLDivElement>(null);
    const activeLabel = cities.find((c) => c.code === activeCity)?.label;
    const disabled = cities.length <= 1;

    useEffect(() => {
        if (!open) return;

        const handlePointer = (event: MouseEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", handlePointer);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handlePointer);
            document.removeEventListener("keydown", handleKey);
        };
    }, [open]);

    return (
        <div
            ref={wrapperRef}
            className={`${styles.wrapper} ${className || ""}`.trim()}
        >
            <button
                type="button"
                className={styles.trigger}
                onClick={() => setOpen((v) => !v)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={styles.label}>{activeLabel}</span>
                {!disabled && <ChevronDownIcon className={styles.chevron} />}
            </button>
            {!disabled && (
                <ul
                    className={`${styles.options} ${open ? styles.optionsOpen : ""}`}
                    role="listbox"
                    aria-hidden={!open}
                >
                    {cities.map((c) => {
                        const selected = c.code === activeCity;
                        return (
                            <li
                                key={c.code}
                                className={styles.option}
                                role="option"
                                aria-selected={selected}
                                onClick={() => {
                                    onCityChange(c.code);
                                    setOpen(false);
                                }}
                            >
                                <span>{c.label}</span>
                                {selected && (
                                    <CheckIcon className={styles.check} />
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
