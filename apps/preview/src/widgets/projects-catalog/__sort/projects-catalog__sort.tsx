"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { CheckIcon, ChevronDownIcon, SortIcon } from "@/ui/icons";
import styles from "./projects-catalog__sort.module.css";

export type CatalogSortMode = "priceAsc" | "priceDesc" | "areaAsc" | "areaDesc";

const OPTIONS: Array<{ value: CatalogSortMode; label: string }> = [
    { value: "areaDesc", label: "По площади" },
    { value: "priceAsc", label: "Сначала дешевле" },
    { value: "priceDesc", label: "Сначала дороже" },
    { value: "areaAsc", label: "Сначала компактнее" },
];

export function ProjectsCatalogSort({
    value,
    onChange,
}: {
    value: CatalogSortMode;
    onChange: (value: CatalogSortMode) => void;
}) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const listId = useId();
    const selected = OPTIONS.find((option) => option.value === value);
    const selectedIndex = OPTIONS.findIndex((option) => option.value === value);

    useEffect(() => {
        if (!open) {
            setActiveIndex(-1);
            return;
        }
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }, [open, selectedIndex]);

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
        const option = OPTIONS[index];
        if (!option) return;
        onChange(option.value);
        setOpen(false);
    }

    function handleKey(event: KeyboardEvent<HTMLButtonElement>) {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                if (!open) {
                    setOpen(true);
                } else {
                    setActiveIndex((i) => (i < OPTIONS.length - 1 ? i + 1 : 0));
                }
                break;
            case "ArrowUp":
                event.preventDefault();
                if (!open) {
                    setOpen(true);
                } else {
                    setActiveIndex((i) => (i > 0 ? i - 1 : OPTIONS.length - 1));
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

    return (
        <div ref={wrapperRef} className={styles.wrap}>
            <button
                type="button"
                className={styles.trigger}
                onClick={() => setOpen((o) => !o)}
                onKeyDown={handleKey}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                aria-label="Сортировка"
            >
                <SortIcon className={styles.sortIcon} />
                <span className={styles.value}>
                    {selected?.label ?? "По площади"}
                </span>
                <ChevronDownIcon className={styles.chevron} />
            </button>
            <ul
                id={listId}
                ref={listRef}
                className={`${styles.list} ${open ? styles.listOpen : ""}`}
                role="listbox"
                aria-hidden={!open}
            >
                {OPTIONS.map((option, index) => {
                    const isSelected = option.value === value;
                    const isActive = index === activeIndex;
                    return (
                        <li
                            key={option.value}
                            className={`${styles.option} ${
                                isActive ? styles.optionActive : ""
                            }`}
                            role="option"
                            aria-selected={isSelected}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseDown={(event) => {
                                event.preventDefault();
                                commit(index);
                            }}
                        >
                            <span>{option.label}</span>
                            {isSelected ? (
                                <CheckIcon className={styles.check} />
                            ) : null}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
