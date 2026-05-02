import type { Project } from "@/domain/project";
import { formatPrice } from "@/lib/utils";
import { DownloadIcon } from "./icons";
import styles from "./ProjectStickyAside.module.css";

interface ProjectStickyAsideProps {
    project: Project;
}

export function ProjectStickyAside({ project }: ProjectStickyAsideProps) {
    return (
        <aside className={styles.aside}>
            <div className={styles.card}>
                <span className={styles.priceLabel}>Стоимость от</span>
                <p className={styles.price}>{formatPrice(project.price)}</p>
                <p className={styles.note}>
                    Цена за «Базовую» комплектацию. Фиксируется в договоре.
                </p>

                <div className={styles.actions}>
                    <a href="#lead" className={styles.primary}>
                        Заказать расчёт
                    </a>
                    <a href="#lead" className={styles.secondary}>
                        Задать вопрос
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
                        <span className={styles.trustValue}>5 лет</span>
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
