import styles from "./loading.module.css";

export default function Loading() {
    return (
        <div className={styles.slot} data-route-loader="" aria-busy="true">
            <div className={styles.bar} aria-hidden="true" />
        </div>
    );
}
