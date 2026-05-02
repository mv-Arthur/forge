import styles from "./NotFoundIllustration.module.css";

export function NotFoundIllustration() {
    return (
        <svg
            viewBox="0 0 480 260"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Чертёж дверного проёма с размером 404 мм"
            className={styles.svg}
        >
            <defs>
                <pattern
                    id="wall-hatch"
                    patternUnits="userSpaceOnUse"
                    width="6"
                    height="6"
                    patternTransform="rotate(45)"
                >
                    <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="6"
                        stroke="currentColor"
                        strokeWidth="0.5"
                    />
                </pattern>
            </defs>

            <text className={styles.scale} x="40" y="40">
                М 1:50
            </text>

            <rect
                className={styles.wallFill}
                x="40"
                y="100"
                width="160"
                height="20"
            />
            <rect
                className={styles.wallFill}
                x="280"
                y="100"
                width="160"
                height="20"
            />

            <line className={styles.door} x1="200" y1="120" x2="200" y2="198" />
            <path
                className={styles.swing}
                d="M 200 198 A 78 78 0 0 1 278 120"
            />

            <line
                className={styles.thinLine}
                x1="200"
                y1="124"
                x2="200"
                y2="235"
            />
            <line
                className={styles.thinLine}
                x1="280"
                y1="124"
                x2="280"
                y2="235"
            />

            <line
                className={styles.dimLine}
                x1="170"
                y1="225"
                x2="310"
                y2="225"
            />
            <line className={styles.tick} x1="194" y1="219" x2="206" y2="231" />
            <line className={styles.tick} x1="274" y1="219" x2="286" y2="231" />

            <text className={styles.dimText} x="240" y="218">
                404
            </text>
            <text className={styles.dimUnit} x="240" y="246">
                мм
            </text>
        </svg>
    );
}
