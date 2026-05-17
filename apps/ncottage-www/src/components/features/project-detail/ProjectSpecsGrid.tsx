import type { Project } from "@/domain/project";
import { formatArea } from "@/lib/utils";
import { pluralFloors } from "./helpers";
import styles from "./ProjectSpecsGrid.module.css";

interface ProjectSpecsGridProps {
    project: Project;
}

export function ProjectSpecsGrid({ project }: ProjectSpecsGridProps) {
    const groups = [
        {
            title: "Объёмы",
            items: [
                { label: "Площадь", value: formatArea(project.area) },
                {
                    label: "Этажность",
                    value: `${project.floors} ${pluralFloors(project.floors)}`,
                },
                { label: "Габариты", value: `${project.specs.dimensions} м` },
                { label: "Спален", value: String(project.bedrooms) },
                { label: "Санузлов", value: String(project.bathrooms) },
            ],
        },
        {
            title: "Конструктив",
            items: [
                { label: "Стены", value: project.specs.wallMaterial },
                { label: "Кровля", value: project.specs.roofType },
                { label: "Фундамент", value: project.specs.foundation },
            ],
        },
        {
            title: "Сроки",
            items: [
                {
                    label: "Срок строительства",
                    value: project.specs.buildTime,
                },
                { label: "Гарантия", value: "7 лет" },
                { label: "Предоплата", value: "Не требуется" },
            ],
        },
    ];

    return (
        <div className={styles.grid}>
            {groups.map((g) => (
                <div key={g.title} className={styles.card}>
                    <h3 className={styles.cardTitle}>{g.title}</h3>
                    <dl className={styles.list}>
                        {g.items.map((it) => (
                            <div key={it.label} className={styles.row}>
                                <dt className={styles.term}>{it.label}</dt>
                                <dd className={styles.def}>{it.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            ))}
        </div>
    );
}
