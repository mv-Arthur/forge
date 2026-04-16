"use client";

import { useState, useMemo } from "react";
import type { Project, Technology } from "@/types/project";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { Button } from "@/components/ui/Button";
import styles from "./ProjectFilter.module.css";

interface ProjectFilterProps {
    projects: Project[];
}

const TECHNOLOGIES: { value: Technology | "all"; label: string }[] = [
    { value: "all", label: "Все" },
    { value: "gas-concrete", label: "Газобетон" },
    { value: "brick", label: "Кирпич" },
    { value: "frame", label: "Каркас" },
    { value: "sip", label: "СИП-панели" },
    { value: "fachwerk", label: "Фахверк" },
];

const FLOOR_OPTIONS = [
    { value: 0, label: "Все" },
    { value: 1, label: "1 этаж" },
    { value: 2, label: "2 этажа" },
];

export function ProjectFilter({ projects }: ProjectFilterProps) {
    const [tech, setTech] = useState<Technology | "all">("all");
    const [floors, setFloors] = useState(0);
    const [priceMax, setPriceMax] = useState(15000000);

    const filtered = useMemo(() => {
        return projects.filter((p) => {
            if (tech !== "all" && p.technology !== tech) return false;
            if (floors !== 0 && p.floors !== floors) return false;
            if (p.price > priceMax) return false;
            return true;
        });
    }, [projects, tech, floors, priceMax]);

    function reset() {
        setTech("all");
        setFloors(0);
        setPriceMax(15000000);
    }

    return (
        <div>
            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Технология</label>
                    <div className={styles.chips}>
                        {TECHNOLOGIES.map((t) => (
                            <button
                                key={t.value}
                                className={`${styles.chip} ${tech === t.value ? styles.chipActive : ""}`}
                                onClick={() => setTech(t.value)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Этажность</label>
                    <div className={styles.chips}>
                        {FLOOR_OPTIONS.map((f) => (
                            <button
                                key={f.value}
                                className={`${styles.chip} ${floors === f.value ? styles.chipActive : ""}`}
                                onClick={() => setFloors(f.value)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>
                        Бюджет до{" "}
                        {new Intl.NumberFormat("ru-RU").format(priceMax)} ₽
                    </label>
                    <input
                        type="range"
                        min={1000000}
                        max={15000000}
                        step={500000}
                        value={priceMax}
                        onChange={(e) => setPriceMax(Number(e.target.value))}
                        className={styles.range}
                    />
                </div>

                <Button variant="ghost" size="sm" onClick={reset}>
                    Сбросить
                </Button>
            </div>

            <p className={styles.count}>
                Найдено проектов: {filtered.length}
            </p>

            <div className={styles.grid}>
                {filtered.map((project) => (
                    <ProjectCard key={project.slug} project={project} />
                ))}
            </div>

            {filtered.length === 0 && (
                <p className={styles.empty}>
                    По выбранным фильтрам ничего не найдено. Попробуйте
                    изменить параметры.
                </p>
            )}
        </div>
    );
}
