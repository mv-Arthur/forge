"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { CheckIcon, ChevronDownIcon } from "@/components/ui/icons";
import styles from "./Select.module.css";

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    "aria-label"?: string;
    className?: string;
    disabled?: boolean;
}

export function Select({
    options,
    value,
    onChange,
    placeholder,
    "aria-label": ariaLabel,
    className,
    disabled = false,
}: SelectProps) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const listId = useId();

    const selected = options.find((option) => option.value === value);
    const display = selected?.label ?? placeholder ?? "";
    const isPlaceholder = !selected;

    useEffect(() => {
        if (!open) {
            setActiveIndex(-1);
            return;
        }
        const idx = options.findIndex((option) => option.value === value);
        setActiveIndex(idx >= 0 ? idx : 0);
    }, [open, value, options]);

    useEffect(() => {
        if (!open) return;

        const handlePointer = (event: MouseEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const handleKey = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", handlePointer);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handlePointer);
            document.removeEventListener("keydown", handleKey);
        };
    }, [open]);

    useEffect(() => {
        if (!open || activeIndex < 0) return;
        const node = listRef.current?.children[activeIndex] as
            | HTMLElement
            | undefined;
        node?.scrollIntoView({ block: "nearest" });
    }, [activeIndex, open]);

    function commit(index: number) {
        const option = options[index];
        if (!option) return;
        onChange(option.value);
        setOpen(false);
    }

    function handleKey(event: KeyboardEvent<HTMLButtonElement>) {
        if (disabled) return;

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                if (!open) {
                    setOpen(true);
                } else {
                    setActiveIndex((i) => (i < options.length - 1 ? i + 1 : 0));
                }
                break;
            case "ArrowUp":
                event.preventDefault();
                if (!open) {
                    setOpen(true);
                } else {
                    setActiveIndex((i) => (i > 0 ? i - 1 : options.length - 1));
                }
                break;
            case "Home":
                if (open) {
                    event.preventDefault();
                    setActiveIndex(0);
                }
                break;
            case "End":
                if (open) {
                    event.preventDefault();
                    setActiveIndex(options.length - 1);
                }
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                if (open && activeIndex >= 0) {
                    commit(activeIndex);
                } else {
                    setOpen((o) => !o);
                }
                break;
            case "Tab":
                if (open) setOpen(false);
                break;
        }
    }

    const triggerClass = [
        styles.trigger,
        isPlaceholder ? styles.triggerPlaceholder : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            ref={wrapperRef}
            className={[styles.wrapper, className].filter(Boolean).join(" ")}
        >
            <button
                type="button"
                className={triggerClass}
                onClick={() => !disabled && setOpen((o) => !o)}
                onKeyDown={handleKey}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                aria-label={ariaLabel}
            >
                <span className={styles.value}>{display}</span>
                <ChevronDownIcon className={styles.chevron} />
            </button>
            <ul
                id={listId}
                ref={listRef}
                className={[styles.options, open ? styles.optionsOpen : ""]
                    .filter(Boolean)
                    .join(" ")}
                role="listbox"
                aria-hidden={!open}
            >
                {options.map((option, index) => {
                    const isSelected = option.value === value;
                    const isActive = index === activeIndex;
                    const optionClass = [
                        styles.option,
                        isActive ? styles.optionActive : "",
                    ]
                        .filter(Boolean)
                        .join(" ");
                    return (
                        <li
                            key={option.value}
                            className={optionClass}
                            role="option"
                            aria-selected={isSelected}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseDown={(event) => {
                                event.preventDefault();
                                commit(index);
                            }}
                        >
                            <span className={styles.optionLabel}>
                                {option.label}
                            </span>
                            {isSelected && (
                                <CheckIcon className={styles.check} />
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
