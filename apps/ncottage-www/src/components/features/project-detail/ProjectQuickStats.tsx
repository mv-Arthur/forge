import type { Project } from "@/domain/project";
import { formatArea } from "@/lib/utils";
import { AreaIcon, BathIcon, BedIcon, DimsIcon, FloorsIcon } from "./icons";
import { pluralBathrooms, pluralBedrooms, pluralFloors } from "./helpers";
import styles from "./ProjectQuickStats.module.css";

interface ProjectQuickStatsProps {
    project: Project;
}

export function ProjectQuickStats({ project }: ProjectQuickStatsProps) {
    const items = [
        {
            icon: <AreaIcon />,
            value: formatArea(project.area),
            label: "Площадь",
        },
        {
            icon: <FloorsIcon />,
            value: `${project.floors} ${pluralFloors(project.floors)}`,
            label: "Этажность",
        },
        {
            icon: <BedIcon />,
            value: `${project.bedrooms} ${pluralBedrooms(project.bedrooms)}`,
            label: "Спален",
        },
        {
            icon: <BathIcon />,
            value: `${project.bathrooms} ${pluralBathrooms(project.bathrooms)}`,
            label: "Санузлов",
        },
        {
            icon: <DimsIcon />,
            value: `${project.specs.dimensions} м`,
            label: "Габариты",
        },
    ];

    return (
        <ul className={styles.list}>
            {items.map((item) => (
                <li key={item.label} className={styles.item}>
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.value}>{item.value}</span>
                    <span className={styles.label}>{item.label}</span>
                </li>
            ))}
        </ul>
    );
}
