import styles from "./EmptyState.module.css";

// Пустое состояние листинга: показывается, когда коллекция пуста, чтобы между
// статичной chrome страницы не оставалось «дыры».
export function EmptyState({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <div className={styles.root} role="status">
            <p className={styles.title}>{title}</p>
            {description && <p className={styles.description}>{description}</p>}
        </div>
    );
}
