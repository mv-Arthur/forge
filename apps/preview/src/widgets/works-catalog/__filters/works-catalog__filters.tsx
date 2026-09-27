import type { WorksCatalogFiltersProps } from "../works-catalog.types";
import styles from "./works-catalog__filters.module.css";

export function WorksCatalogFilters({
    areaLabel,
    areaMin,
    areaMax,
    areaFrom,
    areaTo,
    areaEnabled,
    onAreaChange,
    onAreaClear,
    areaClearLabel,
    materialsLabel,
    allLabel,
    materials,
    selected,
    onSelect,
}: WorksCatalogFiltersProps) {
    const span = Math.max(1, areaMax - areaMin);
    const fromPct = ((areaFrom - areaMin) / span) * 100;
    const toPct = ((areaTo - areaMin) / span) * 100;
    const areaDirty = areaFrom !== areaMin || areaTo !== areaMax;
    const fromZ = areaFrom > areaMin + span * 0.5 ? 5 : 3;

    return (
        <div className={styles.row}>
            <div className={styles.areaCol}>
                <div className={styles.label}>{areaLabel}</div>
                <div className={styles.area} data-disabled={!areaEnabled}>
                    {areaDirty ? (
                        <button
                            type="button"
                            className={styles.areaClear}
                            onClick={onAreaClear}
                        >
                            {areaClearLabel}
                        </button>
                    ) : null}
                    <div className={styles.areaNums}>
                        <input
                            className={styles.areaNum}
                            inputMode="numeric"
                            value={areaFrom}
                            disabled={!areaEnabled}
                            aria-label="Площадь от"
                            onChange={(e) => {
                                const n = Number(e.target.value);
                                if (!Number.isFinite(n)) return;
                                onAreaChange(
                                    clamp(n, areaMin, areaTo),
                                    areaTo,
                                );
                            }}
                        />
                        <input
                            className={styles.areaNum}
                            inputMode="numeric"
                            value={areaTo}
                            disabled={!areaEnabled}
                            aria-label="Площадь до"
                            onChange={(e) => {
                                const n = Number(e.target.value);
                                if (!Number.isFinite(n)) return;
                                onAreaChange(
                                    areaFrom,
                                    clamp(n, areaFrom, areaMax),
                                );
                            }}
                        />
                    </div>
                    <div className={styles.track}>
                        <div
                            className={styles.fill}
                            style={{
                                left: `${fromPct}%`,
                                width: `${Math.max(0, toPct - fromPct)}%`,
                            }}
                        />
                        <input
                            type="range"
                            className={styles.range}
                            min={areaMin}
                            max={areaMax}
                            step={1}
                            value={areaFrom}
                            disabled={!areaEnabled}
                            style={{ zIndex: fromZ }}
                            aria-label="Площадь от"
                            onChange={(e) =>
                                onAreaChange(
                                    Math.min(Number(e.target.value), areaTo),
                                    areaTo,
                                )
                            }
                        />
                        <input
                            type="range"
                            className={styles.range}
                            min={areaMin}
                            max={areaMax}
                            step={1}
                            value={areaTo}
                            disabled={!areaEnabled}
                            style={{ zIndex: 4 }}
                            aria-label="Площадь до"
                            onChange={(e) =>
                                onAreaChange(
                                    areaFrom,
                                    Math.max(Number(e.target.value), areaFrom),
                                )
                            }
                        />
                    </div>
                </div>
            </div>
            <div className={styles.materialsCol}>
                <div className={styles.label}>{materialsLabel}</div>
                <div className={styles.chips}>
                    <button
                        type="button"
                        className={`${styles.chip} ${
                            selected === "all" ? styles.chipOn : ""
                        }`}
                        aria-pressed={selected === "all"}
                        onClick={() => onSelect("all")}
                    >
                        {allLabel}
                    </button>
                    {materials.map((material) => (
                        <button
                            key={material.id}
                            type="button"
                            className={`${styles.chip} ${
                                selected === material.id ? styles.chipOn : ""
                            }`}
                            aria-pressed={selected === material.id}
                            onClick={() => onSelect(material.id)}
                        >
                            {material.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function clamp(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, Math.round(n)));
}
