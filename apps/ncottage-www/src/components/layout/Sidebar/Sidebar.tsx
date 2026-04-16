"use client";

import styles from "./Sidebar.module.css";

export function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <button className={styles.sideButton}>
                <span className={styles.sideButtonText}>
                    Рассчитать стоимость
                </span>
            </button>
            <button className={styles.sideButton}>
                <span className={styles.sideButtonText}>
                    Экскурсия по объектам
                </span>
            </button>
            <button className={`${styles.sideButton} ${styles.accent}`}>
                <span className={styles.sideButtonText}>Акции</span>
            </button>
        </aside>
    );
}
