import type { Project } from "@/domain/project";
import { formatPrice } from "@/lib/utils";
import { DownloadIcon } from "./icons";
import styles from "./ProjectStickyAside.module.css";

interface ProjectStickyAsideProps {
    project: Project;
}

export function ProjectStickyAside({ project }: ProjectStickyAsideProps) {
    const basePackage = project.packages?.[0];
    const packageHighlight = basePackage?.includes[0]?.value;

    return (
        <aside className={styles.aside}>
            <div className={styles.card}>
                <span className={styles.priceLabel}>Стоимость от</span>
                <p className={styles.price}>
                    {formatPrice(basePackage?.price ?? project.price)}
                </p>
                <p className={styles.note}>
                    {basePackage
                        ? `Цена за комплектацию «${basePackage.name}». Фиксируется в договоре после сметы.`
                        : "Ориентир по проекту. Финальная стоимость фиксируется в договоре после сметы."}
                </p>

                {basePackage && (
                    <div className={styles.packageMeta}>
                        <span>{basePackage.tagline ?? "Базовая комплектация"}</span>
                        {packageHighlight && <strong>{packageHighlight}</strong>}
                    </div>
                )}

                <div className={styles.actions}>
                    <a href="#lead" className={styles.primary}>
                        Заказать расчёт
                    </a>
                    <a href="/mortgage" className={styles.secondary}>
                        Ипотека и оплата
                    </a>
                </div>

                {project.pdfUrl && (
                    <a href={project.pdfUrl} className={styles.pdf} download>
                        <DownloadIcon />
                        <span>Скачать PDF проекта</span>
                    </a>
                )}

                <ul className={styles.trust}>
                    <li>
                        <span className={styles.trustValue}>7 лет</span>
                        <span className={styles.trustLabel}>гарантия</span>
                    </li>
                    <li>
                        <span className={styles.trustValue}>0 ₽</span>
                        <span className={styles.trustLabel}>предоплата</span>
                    </li>
                    <li>
                        <span className={styles.trustValue}>
                            {project.specs.buildTime}
                        </span>
                        <span className={styles.trustLabel}>срок</span>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
