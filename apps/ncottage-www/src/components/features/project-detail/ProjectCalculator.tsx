"use client";

import { useMemo, useState } from "react";
import type { ProjectOption, ProjectPackage } from "@/domain/project";
import { formatPrice } from "@/lib/utils";
import { CheckIcon } from "./icons";
import { useProjectConfig } from "./ProjectConfigContext";
import styles from "./ProjectCalculator.module.css";

interface ProjectCalculatorProps {
    packages: ProjectPackage[];
    options?: ProjectOption[];
}

export function ProjectCalculator({
    packages,
    options = [],
}: ProjectCalculatorProps) {
    const defaultIndex = Math.max(
        0,
        packages.findIndex((p) => p.highlighted)
    );
    const [packageIndex, setPackageIndex] = useState(defaultIndex);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const { setSummary } = useProjectConfig();

    const activePackage = packages[packageIndex];

    const total = useMemo(() => {
        const optionsTotal = options
            .filter((o) => selectedOptions.includes(o.label))
            .reduce((sum, o) => sum + o.price, 0);
        return activePackage.price + optionsTotal;
    }, [activePackage, options, selectedOptions]);

    function toggleOption(label: string) {
        setSelectedOptions((prev) =>
            prev.includes(label)
                ? prev.filter((l) => l !== label)
                : [...prev, label]
        );
    }

    function handleRequest() {
        const chosen = options.filter((o) => selectedOptions.includes(o.label));
        const parts = [`Комплектация «${activePackage.name}»`];
        if (chosen.length > 0) {
            parts.push(`опции: ${chosen.map((o) => o.label).join(", ")}`);
        }
        parts.push(`ориентировочно ${formatPrice(total)}`);
        setSummary(parts.join("; "));

        const lead = document.getElementById("lead");
        lead?.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <div className={styles.root}>
            <div
                className={styles.packages}
                role="radiogroup"
                aria-label="Комплектация"
            >
                {packages.map((pkg, index) => {
                    const isActive = index === packageIndex;
                    return (
                        <button
                            type="button"
                            key={pkg.name}
                            role="radio"
                            aria-checked={isActive}
                            className={`${styles.package} ${isActive ? styles.packageActive : ""}`}
                            onClick={() => setPackageIndex(index)}
                        >
                            <span className={styles.packageHead}>
                                <span className={styles.packageName}>
                                    {pkg.name}
                                </span>
                                {pkg.highlighted && (
                                    <span className={styles.packageBadge}>
                                        Популярная
                                    </span>
                                )}
                            </span>
                            {pkg.tagline && (
                                <span className={styles.packageTagline}>
                                    {pkg.tagline}
                                </span>
                            )}
                            <span className={styles.packagePrice}>
                                от {formatPrice(pkg.price)}
                            </span>
                        </button>
                    );
                })}
            </div>

            <ul className={styles.includes}>
                {activePackage.includes.map((inc) => {
                    const isOmitted = inc.value
                        .toLowerCase()
                        .startsWith("не входит");
                    return (
                        <li
                            key={inc.label}
                            className={`${styles.incRow} ${isOmitted ? styles.incRowOff : ""}`}
                        >
                            <span className={styles.incIcon}>
                                {isOmitted ? (
                                    <span className={styles.dash} />
                                ) : (
                                    <CheckIcon />
                                )}
                            </span>
                            <span className={styles.incLabel}>{inc.label}</span>
                            <span className={styles.incValue}>{inc.value}</span>
                        </li>
                    );
                })}
            </ul>

            {options.length > 0 && (
                <div className={styles.options}>
                    <p className={styles.optionsTitle}>Дополнительные опции</p>
                    <ul className={styles.optionsList}>
                        {options.map((opt) => {
                            const checked = selectedOptions.includes(opt.label);
                            return (
                                <li key={opt.label}>
                                    <label
                                        className={`${styles.option} ${checked ? styles.optionChecked : ""}`}
                                    >
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={checked}
                                            onChange={() =>
                                                toggleOption(opt.label)
                                            }
                                        />
                                        <span className={styles.optionLabel}>
                                            {opt.label}
                                        </span>
                                        <span className={styles.optionPrice}>
                                            +{formatPrice(opt.price)}
                                        </span>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            <div className={styles.summary}>
                <div className={styles.summaryTotal}>
                    <span className={styles.summaryLabel}>
                        Ориентировочная стоимость
                    </span>
                    <span className={styles.summaryValue}>
                        от {formatPrice(total)}
                    </span>
                </div>
                <button
                    type="button"
                    className={styles.cta}
                    onClick={handleRequest}
                >
                    Получить точный расчёт
                </button>
            </div>
            <p className={styles.note}>
                Предварительный расчёт. Точную смету с выбранной комплектацией и
                опциями менеджер пришлёт после консультации.
            </p>
        </div>
    );
}
